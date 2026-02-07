import { AGENT_TO_STAGE_MAP } from '@/constants/pipeline-stages';
import {
  getAnalysisByDeck,
  getDetailedProgress,
  getPitchDeckDetail,
  getPitchDeckSummary,
  startAnalysis
} from '@/services/api';
import { usePipelineStore } from '@/stores/pipeline.store';
import type { DetailedProgressResponse } from '@/types/response/pitch-deck';
import { useEffect, useRef } from 'react';

interface UsePipelineAutoStartOptions {
  autoStart?: boolean;
  mock?: boolean;
  currentStep?: 'extract' | 'summary' | 'analytics' | 'swot' | 'pestle' | 'recommendation' | 'done';
  onProgress?: (progress: number) => void;
  onComplete?: (analysisUuid: string) => void;
  onError?: (error: string) => void;
  onDeckUpdate?: (deck: { currentStep: string }) => void;
}

const STAGES = ['extract', 'summary', 'analytics', 'swot', 'pestle', 'recommendation'] as const;
type Stage = (typeof STAGES)[number];
const MOCK_MAX_PROGRESS = 99; // Mock stops at 99%, waits for backend step update
const MOCK_PROGRESS_INTERVAL = 800; // Update every 100ms
const MOCK_PROGRESS_INCREMENT = 2; // 2% increment per update (reaches 99% in ~5s)
const POLL_INTERVAL = 2000; // 2 seconds for real polling
const MAX_POLLS = 180; // 15 minutes max

export const usePipelineAutoStart = (
  deckUuid: string,
  options: UsePipelineAutoStartOptions = {}
) => {
  const {
    autoStart = true,
    mock = false,
    currentStep,
    onProgress,
    onComplete,
    onError,
    onDeckUpdate
  } = options;

  const hasChecked = useRef(false);
  const isPollingRef = useRef(false);
  const previousStepRef = useRef<string | undefined>(undefined);
  const deckStepRef = useRef<string | undefined>(undefined);
  const mockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mockProgressRef = useRef(0);

  const {
    analysisUuid,
    setAnalysisUuid,
    setOverallStatus,
    setOverallProgress,
    updateStage,
    setCurrentStage,
    setPolling,
    resetPollCount,
    setError,
    clearAnalysis,
    setSummaryData
  } = usePipelineStore();

  const fetchSummaryData = async (deckUuid: string) => {
    try {
      const summary = await getPitchDeckSummary(deckUuid);
      setSummaryData(summary);
    } catch (err) {
      console.error('Failed to fetch summary:', err instanceof Error ? err.message : err);
    }
  };

  /**
   * Sync pipeline stages with backend currentStep
   */
  const syncStagesWithCurrentStep = (step: string) => {
    const stepIndex = STAGES.indexOf(step as Stage);

    if (step === 'done') {
      STAGES.forEach((stageId) => {
        updateStage(stageId, { status: 'completed', progress: 100 });
      });
      setOverallStatus('completed');
      setOverallProgress(100);

      return;
    }

    if (stepIndex >= 0) {
      // Previous stages: completed
      for (let i = 0; i < stepIndex; i++) {
        updateStage(STAGES[i], { status: 'completed', progress: 100 });
      }
      // Current stage: running
      updateStage(STAGES[stepIndex], { status: 'running', progress: 0 });
      setCurrentStage(STAGES[stepIndex]);
      // Future stages: pending
      for (let i = stepIndex + 1; i < STAGES.length; i++) {
        updateStage(STAGES[i], { status: 'pending', progress: 0 });
      }
      // Progress based on completed stages only
      const progress = Math.round((stepIndex / STAGES.length) * 100);
      setOverallProgress(progress);
      onProgress?.(progress);
    }
  };

  const completePipeline = async (analysisUuid: string) => {
    setOverallStatus('completed');
    setPolling(false);
    setOverallProgress(100);
    onProgress?.(100);
    onComplete?.(analysisUuid);
    await fetchSummaryData(deckUuid);
  };

  const handleFailedPipeline = (errorMessage?: string) => {
    setOverallStatus('failed');
    setPolling(false);
    const errorMsg = errorMessage || 'Analysis failed';
    setError(errorMsg);
    onError?.(errorMsg);
  };

  const mapAgentsToStages = (progressResponse: DetailedProgressResponse) => {
    if (!progressResponse.agents) return;

    progressResponse.agents.forEach((agent) => {
      const stageId = AGENT_TO_STAGE_MAP[agent.agentName];
      if (stageId) {
        updateStage(stageId, {
          status: agent.status,
          progress: agent.progress
        });
      }
    });

    if (progressResponse.progress.currentAgent) {
      const currentStageId = AGENT_TO_STAGE_MAP[progressResponse.progress.currentAgent];
      if (currentStageId) {
        setCurrentStage(currentStageId);
      }
    }

    setOverallProgress(progressResponse.progress.overall);
    onProgress?.(progressResponse.progress.overall);
  };

  /**
   * Start mock progress for current step (stops at 99%)
   */
  const startMockProgress = (step: string) => {
    const stepIndex = STAGES.indexOf(step as Stage);
    if (stepIndex < 0) return;

    // Clear any existing mock interval
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
    }

    mockProgressRef.current = 0;
    const stageId = STAGES[stepIndex];

    updateStage(stageId, { status: 'running', progress: 0 });
    setCurrentStage(stageId);

    mockIntervalRef.current = setInterval(() => {
      mockProgressRef.current += MOCK_PROGRESS_INCREMENT;

      if (mockProgressRef.current >= MOCK_MAX_PROGRESS) {
        mockProgressRef.current = MOCK_MAX_PROGRESS;
        clearInterval(mockIntervalRef.current!);
        mockIntervalRef.current = null;
      }

      updateStage(stageId, { progress: mockProgressRef.current });

      const overallProgress = Math.round(
        (stepIndex * 100 + mockProgressRef.current) / STAGES.length
      );
      setOverallProgress(overallProgress);
      onProgress?.(overallProgress);
    }, MOCK_PROGRESS_INTERVAL);
  };

  /**
   * Poll deck for currentStep changes (used in mock mode)
   */
  const pollDeckForStepChange = async () => {
    while (isPollingRef.current) {
      try {
        const deckDetail = await getPitchDeckDetail(deckUuid);
        const newDeckStep = deckDetail.currentStep;

        if (newDeckStep && newDeckStep !== deckStepRef.current) {
          deckStepRef.current = newDeckStep;

          // Complete previous stage
          if (previousStepRef.current && previousStepRef.current !== 'done') {
            const prevIndex = STAGES.indexOf(previousStepRef.current as Stage);
            if (prevIndex >= 0) {
              updateStage(STAGES[prevIndex], { status: 'completed', progress: 100 });
            }
          }

          previousStepRef.current = newDeckStep;
          onDeckUpdate?.({ currentStep: newDeckStep });

          if (newDeckStep === 'done') {
            if (mockIntervalRef.current) {
              clearInterval(mockIntervalRef.current);
              mockIntervalRef.current = null;
            }

            await completePipeline(deckUuid);

            return;
          }

          // Start mock for new step
          syncStagesWithCurrentStep(newDeckStep);
          startMockProgress(newDeckStep);
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Polling failed';
        setError(errorMsg);
        setPolling(false);
        onError?.(errorMsg);

        return;
      }
    }
  };

  const runPipeline = async () => {
    if (!deckUuid) return;

    if (currentStep && deckStepRef.current === undefined) {
      deckStepRef.current = currentStep;
      previousStepRef.current = currentStep;
    }

    if (hasChecked.current && !currentStep) return;
    hasChecked.current = true;

    if (currentStep === 'done') {
      syncStagesWithCurrentStep('done');
      await completePipeline(deckUuid);

      return;
    }

    setPolling(true);
    resetPollCount();
    isPollingRef.current = true;

    try {
      // === MOCK MODE ===
      if (mock) {
        clearAnalysis();

        if (currentStep) {
          syncStagesWithCurrentStep(currentStep);
          if (currentStep === 'recommendation') {
            await completePipeline(deckUuid);

            return;
          }
          startMockProgress(currentStep);
          pollDeckForStepChange();
        }

        return;
      }

      // === REAL MODE ===
      const existingAnalysis = await getAnalysisByDeck(deckUuid);

      if (existingAnalysis) {
        setAnalysisUuid(existingAnalysis.uuid);
        setOverallStatus(existingAnalysis.status);

        const progressResponse = await getDetailedProgress(existingAnalysis.uuid);
        mapAgentsToStages(progressResponse);

        if (existingAnalysis.status === 'completed') {
          await completePipeline(existingAnalysis.uuid);

          return;
        }

        if (existingAnalysis.status === 'failed') {
          handleFailedPipeline(existingAnalysis.errorMessage);
          if (autoStart) {
            const newAnalysis = await startAnalysis(deckUuid);
            setAnalysisUuid(newAnalysis.uuid);
            setOverallStatus(newAnalysis.status);
            clearAnalysis();
          } else {
            return;
          }
        }

        for (let i = 0; i < MAX_POLLS; i++) {
          const progressResponse = await getDetailedProgress(existingAnalysis.uuid);
          mapAgentsToStages(progressResponse);

          const deckDetail = await getPitchDeckDetail(deckUuid);
          const newDeckStep = deckDetail.currentStep;

          if (newDeckStep && newDeckStep !== deckStepRef.current) {
            deckStepRef.current = newDeckStep;
            syncStagesWithCurrentStep(newDeckStep);
            onDeckUpdate?.({ currentStep: newDeckStep });

            if (newDeckStep === 'done') {
              await completePipeline(existingAnalysis.uuid);

              return;
            }
          }

          if (progressResponse.status === 'completed') {
            await completePipeline(existingAnalysis.uuid);

            return;
          }

          if (progressResponse.status === 'failed') {
            handleFailedPipeline(progressResponse.errorMessage);

            return;
          }

          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        }

        setError('Analysis timed out');
        setPolling(false);
        onError?.('Analysis timed out');
      } else if (autoStart) {
        const newAnalysis = await startAnalysis(deckUuid);
        setAnalysisUuid(newAnalysis.uuid);
        setOverallStatus(newAnalysis.status);

        for (let i = 0; i < MAX_POLLS; i++) {
          const progressResponse = await getDetailedProgress(newAnalysis.uuid);
          mapAgentsToStages(progressResponse);

          const deckDetail = await getPitchDeckDetail(deckUuid);
          const newDeckStep = deckDetail.currentStep;

          if (newDeckStep && newDeckStep !== deckStepRef.current) {
            deckStepRef.current = newDeckStep;
            syncStagesWithCurrentStep(newDeckStep);
            onDeckUpdate?.({ currentStep: newDeckStep });

            if (newDeckStep === 'done') {
              await completePipeline(newAnalysis.uuid);

              return;
            }
          }

          if (progressResponse.status === 'completed') {
            await completePipeline(newAnalysis.uuid);

            return;
          }

          if (progressResponse.status === 'failed') {
            handleFailedPipeline(progressResponse.errorMessage);

            return;
          }

          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        }

        setError('Analysis timed out');
        setPolling(false);
        onError?.('Analysis timed out');
      } else {
        setPolling(false);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Pipeline failed';
      setError(errorMsg);
      setPolling(false);
      onError?.(errorMsg);
    } finally {
      if (!mock) {
        isPollingRef.current = false;
        setPolling(false);
      }
    }
  };

  // Sync when currentStep prop changes
  useEffect(() => {
    if (currentStep && currentStep !== previousStepRef.current) {
      syncStagesWithCurrentStep(currentStep);
      previousStepRef.current = currentStep;

      if (mock && mockIntervalRef.current === null) {
        startMockProgress(currentStep);
      }

      if (currentStep === 'done') {
        setOverallStatus('completed');
        onComplete?.(deckUuid);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Run pipeline on mount
  useEffect(() => {
    runPipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckUuid, autoStart, mock]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
      }
      if (isPollingRef.current) {
        setPolling(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isPolling: usePipelineStore((s) => s.isPolling),
    analysisUuid,
    overallStatus: usePipelineStore((s) => s.overallStatus),
    overallProgress: usePipelineStore((s) => s.overallProgress),
    stages: usePipelineStore((s) => s.stages),
    currentStage: usePipelineStore((s) => s.currentStage),
    error: usePipelineStore((s) => s.error)
  };
};
