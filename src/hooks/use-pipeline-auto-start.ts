import { AGENT_TO_STAGE_MAP } from '@/constants/pipeline-stages';
import {
  getAnalysisByDeck,
  getDetailedProgress,
  getPitchDeckSummary,
  startAnalysis
} from '@/services/api';
import { usePipelineStore } from '@/stores/pipeline.store';
import type { DetailedProgressResponse } from '@/types/response/pitch-deck';
import { useEffect, useRef } from 'react';

interface UsePipelineAutoStartOptions {
  autoStart?: boolean;
  mock?: boolean; // Mock mode for development/demo - skips API calls
  currentStep?: 'extract' | 'summary' | 'analytics' | 'swot' | 'pestle' | 'recommendation' | 'done'; // Backend currentStep for sync
  onProgress?: (progress: number) => void;
  onComplete?: (analysisUuid: string) => void;
  onError?: (error: string) => void;
}

export const usePipelineAutoStart = (
  deckUuid: string,
  options: UsePipelineAutoStartOptions = {}
) => {
  const { autoStart = true, mock = false, currentStep, onProgress, onComplete, onError } = options;

  const hasChecked = useRef(false);
  const isPollingRef = useRef(false);
  const previousStepRef = useRef<string | undefined>(undefined);

  const {
    analysisUuid,
    stages,
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

  // Map backend agents to pipeline stages using detailed progress
  const mapAgentsToStages = (progressResponse: DetailedProgressResponse) => {
    if (!progressResponse.agents) return;

    // Update each stage with per-agent progress (0-100%)
    progressResponse.agents.forEach((agent) => {
      const stageId = AGENT_TO_STAGE_MAP[agent.agentName];
      if (stageId) {
        updateStage(stageId, {
          status: agent.status,
          progress: agent.progress // Real per-agent progress (0-100)
        });
      }
    });

    // Set current stage from currentAgent
    if (progressResponse.progress.currentAgent) {
      const currentStageId = AGENT_TO_STAGE_MAP[progressResponse.progress.currentAgent];
      if (currentStageId) {
        setCurrentStage(currentStageId);
      }
    }

    // Update overall progress
    setOverallProgress(progressResponse.progress.overall);
    onProgress?.(progressResponse.progress.overall);
  };

  // Fetch summary data after pipeline completes
  const fetchSummaryData = async (deckUuid: string) => {
    try {
      const summary = await getPitchDeckSummary(deckUuid);
      setSummaryData(summary);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch summary';
      console.error('Failed to fetch summary:', errorMsg);
      // Don't set error state - summary is optional, tabs can handle missing data
    }
  };

  /**
   * Sync pipeline stages with backend currentStep
   * Marks all stages up to currentStep as completed
   */
  const syncStagesWithCurrentStep = (step: string) => {
    const stages = ['extract', 'summary', 'analytics', 'swot', 'pestle', 'recommendation'];
    const stepIndex = stages.indexOf(step);

    if (step === 'done') {
      // All stages completed
      stages.forEach((stageId) => {
        updateStage(stageId, { status: 'completed', progress: 100 });
      });
      setOverallStatus('completed');
      setOverallProgress(100);

      return;
    }

    if (stepIndex >= 0) {
      // Mark completed stages
      for (let i = 0; i <= stepIndex; i++) {
        updateStage(stages[i], { status: 'completed', progress: 100 });
      }
      // Set progress based on completed stages
      const progress = Math.round(((stepIndex + 1) / stages.length) * 100);
      setOverallProgress(progress);
      onProgress?.(progress);
    }
  };

  // Sync when currentStep changes (for backend step tracking)
  useEffect(() => {
    if (currentStep && currentStep !== previousStepRef.current) {
      syncStagesWithCurrentStep(currentStep);
      previousStepRef.current = currentStep;

      // If done, mark as completed
      if (currentStep === 'done') {
        setOverallStatus('completed');
        onComplete?.(deckUuid);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  /**
   * Poll with fixed 1s interval for real-time progress tracking
   * Phase 01: Uses getDetailedProgress() for per-agent progress (0-100%)
   */
  const pollWithFixedInterval = async (analysisUuid: string): Promise<void> => {
    const POLL_INTERVAL = 1000; // 1 second fixed interval
    const MAX_POLLS = 300; // 5 minutes max

    for (let i = 0; i < MAX_POLLS; i++) {
      try {
        const progressResponse = await getDetailedProgress(analysisUuid);
        mapAgentsToStages(progressResponse);

        // Check if terminal status reached
        if (progressResponse.status === 'completed') {
          setOverallStatus('completed');
          setPolling(false);
          onComplete?.(analysisUuid);
          await fetchSummaryData(deckUuid);

          return;
        }

        if (progressResponse.status === 'failed') {
          setOverallStatus('failed');
          setPolling(false);
          setError(progressResponse.errorMessage || 'Analysis failed');
          onError?.(progressResponse.errorMessage || 'Analysis failed');

          return;
        }

        // Wait 1 second before next poll
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Polling failed';
        setError(errorMsg);
        setPolling(false);
        onError?.(errorMsg);

        return;
      }
    }

    // Max polls exceeded
    setError('Analysis timed out');
    setPolling(false);
    onError?.('Analysis timed out');
  };

  // Check pipeline status on mount and when currentStep changes
  useEffect(() => {
    if (!deckUuid) return;

    // Reset check if currentStep changed (for re-sync)
    if (currentStep) {
      // Allow re-run when currentStep changes for sync
    }

    if (hasChecked.current && !currentStep) return;
    hasChecked.current = true;

    // Mock mode - sequential stage completion for demo
    if (mock) {
      // If currentStep is 'done', skip mock mode and sync as completed
      if (currentStep === 'done') {
        syncStagesWithCurrentStep('done');
        onComplete?.(deckUuid);
        fetchSummaryData(deckUuid); // Fire and forget

        return;
      }

      // If currentStep exists, sync stages before starting mock
      if (currentStep) {
        syncStagesWithCurrentStep(currentStep);
        // If already at recommendation, skip mock and mark complete
        if (currentStep === 'recommendation') {
          setOverallStatus('completed');
          onComplete?.(deckUuid);
          fetchSummaryData(deckUuid); // Fire and forget

          return;
        }
      }

      // Reset state first to clear any persisted completed state
      clearAnalysis();

      const mockUuid = 'mock-uuid-' + deckUuid;
      setAnalysisUuid(mockUuid);

      // Run stages sequentially with delays
      const stages = ['extract', 'summary', 'analytics', 'swot', 'pestle', 'recommendation'];
      let currentStageIndex = 0;

      const runNextStage = async () => {
        if (currentStageIndex >= stages.length) {
          // All stages complete
          setOverallStatus('completed');
          onProgress?.(100);
          onComplete?.(mockUuid);
          setPolling(false);

          // Fetch summary data after pipeline completes (mock mode)
          await fetchSummaryData(deckUuid);

          return;
        }

        const stageId = stages[currentStageIndex];
        let progress = 0;

        // Set stage to running at 0%
        updateStage(stageId, { status: 'running', progress: 0 });
        setCurrentStage(stageId);

        // Animate progress from 0% to 100% over 2 seconds
        const progressInterval = setInterval(() => {
          progress += 5; // Increment by 5% every 100ms
          updateStage(stageId, { progress });

          const overallProgress = Math.round((currentStageIndex * 100 + progress) / stages.length);
          onProgress?.(overallProgress);

          if (progress >= 100) {
            clearInterval(progressInterval);
            // Mark as completed
            updateStage(stageId, { status: 'completed', progress: 100 });
            setCurrentStage(null);
            currentStageIndex++;
            // Small delay before next stage
            setTimeout(runNextStage, 500);
          }
        }, 100); // Update every 100ms
      };

      setPolling(true);
      runNextStage();

      return;
    }

    const checkAndStartPipeline = async () => {
      try {
        setPolling(true);
        resetPollCount();
        isPollingRef.current = true;

        // Check for existing analysis
        const existingAnalysis = await getAnalysisByDeck(deckUuid);

        if (existingAnalysis) {
          // Analysis exists
          setAnalysisUuid(existingAnalysis.uuid);
          setOverallStatus(existingAnalysis.status);

          // Get detailed progress using new endpoint
          const progressResponse = await getDetailedProgress(existingAnalysis.uuid);
          mapAgentsToStages(progressResponse);

          // If completed or failed, stop polling
          if (existingAnalysis.status === 'completed') {
            setPolling(false);
            onComplete?.(existingAnalysis.uuid);

            // Fetch summary data after pipeline completes
            await fetchSummaryData(deckUuid);

            return;
          }

          if (existingAnalysis.status === 'failed') {
            setPolling(false);
            setError(existingAnalysis.errorMessage || 'Analysis failed');
            onError?.(existingAnalysis.errorMessage || 'Analysis failed');

            // Auto-start if enabled
            if (autoStart) {
              const newAnalysis = await startAnalysis(deckUuid);
              setAnalysisUuid(newAnalysis.uuid);
              setOverallStatus(newAnalysis.status);
              clearAnalysis(); // Reset stages for new analysis
            }

            return;
          }

          // Continue polling for pending/processing with fixed 1s interval
          if (existingAnalysis.status === 'pending' || existingAnalysis.status === 'processing') {
            await pollWithFixedInterval(existingAnalysis.uuid);

            return;
          }
        } else {
          // No analysis exists - start new one if auto-start enabled
          if (autoStart) {
            const newAnalysis = await startAnalysis(deckUuid);
            setAnalysisUuid(newAnalysis.uuid);
            setOverallStatus(newAnalysis.status);

            // Poll with fixed 1s interval until complete
            await pollWithFixedInterval(newAnalysis.uuid);
            onComplete?.(newAnalysis.uuid);

            // Fetch summary data after pipeline completes
            await fetchSummaryData(deckUuid);
          } else {
            setPolling(false);
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to check pipeline status';
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setPolling(false);
        isPollingRef.current = false;
      }
    };

    checkAndStartPipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckUuid, autoStart]);

  // Cleanup on unmount
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
    stages,
    currentStage: usePipelineStore((s) => s.currentStage),
    error: usePipelineStore((s) => s.error)
  };
};
