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
  currentStep?: 'extract' | 'summary' | 'analytics' | 'swot' | 'pestle' | 'recommendation' | 'done';
  onProgress?: (progress: number) => void;
  onComplete?: (analysisUuid: string) => void;
  onError?: (error: string) => void;
  onDeckUpdate?: (deck: { currentStep: string }) => void;
}

const STAGES = ['extract', 'summary', 'analytics', 'swot', 'pestle', 'recommendation'] as const;
type Stage = (typeof STAGES)[number];
const POLL_INTERVAL = 2000; // 2 seconds for polling
const MAX_POLLS = 180; // 15 minutes max

export const usePipelineAutoStart = (
  deckUuid: string,
  options: UsePipelineAutoStartOptions = {}
) => {
  const {
    autoStart = true,
    currentStep,
    onProgress,
    onComplete,
    onError,
    onDeckUpdate
  } = options;

  const hasChecked = useRef(false);
  const isPollingRef = useRef(false);
  const deckStepRef = useRef<string | undefined>(undefined);

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

  const runPipeline = async () => {
    if (!deckUuid) return;

    if (hasChecked.current && !currentStep) return;
    hasChecked.current = true;

    if (currentStep === 'done') {
      syncStagesWithCurrentStep('done');
      await completePipeline(deckUuid);

      return;
    }

    // Sync with current step before starting
    if (currentStep) {
      syncStagesWithCurrentStep(currentStep);
    }

    setPolling(true);
    resetPollCount();
    isPollingRef.current = true;

    try {
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
      isPollingRef.current = false;
      setPolling(false);
    }
  };

  // Sync when currentStep prop changes
  useEffect(() => {
    if (currentStep && currentStep !== deckStepRef.current) {
      syncStagesWithCurrentStep(currentStep);
      deckStepRef.current = currentStep;

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
  }, [deckUuid, autoStart]);

  // Cleanup
  useEffect(() => {
    return () => {
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
