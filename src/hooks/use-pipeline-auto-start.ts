import { AGENT_TO_STAGE_MAP } from '@/constants/pipeline-stages';
import {
  getAnalysisByDeck,
  getAnalysisStatus,
  getPitchDeckSummary,
  pollAnalysisComplete,
  startAnalysis
} from '@/services/api';
import { usePipelineStore } from '@/stores/pipeline.store';
import type { AnalysisStatusResponse } from '@/types/response/pitch-deck';
import { useEffect, useRef } from 'react';

interface UsePipelineAutoStartOptions {
  autoStart?: boolean;
  mock?: boolean; // Mock mode for development/demo - skips API calls
  onProgress?: (progress: number) => void;
  onComplete?: (analysisUuid: string) => void;
  onError?: (error: string) => void;
}

export const usePipelineAutoStart = (
  deckUuid: string,
  options: UsePipelineAutoStartOptions = {}
) => {
  const { autoStart = true, mock = false, onProgress, onComplete, onError } = options;

  const hasChecked = useRef(false);
  const isPollingRef = useRef(false);

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

  // Map backend agents to pipeline stages
  const mapAgentsToStages = (statusResponse: AnalysisStatusResponse) => {
    if (!statusResponse.agents) return;

    statusResponse.agents.forEach((agent) => {
      const stageId = AGENT_TO_STAGE_MAP[agent.agentName];
      if (stageId) {
        updateStage(stageId, {
          status: agent.status,
          progress: agent.status === 'completed' ? 100 : 0
        });
      }
    });

    // Set current stage from currentStep
    if (statusResponse.currentStep) {
      const currentStageId = AGENT_TO_STAGE_MAP[statusResponse.currentStep];
      if (currentStageId) {
        setCurrentStage(currentStageId);
        updateStage(currentStageId, { status: 'running', progress: 50 });
      }
    }

    // Update overall progress
    setOverallProgress(statusResponse.progress);
    onProgress?.(statusResponse.progress);
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

  // Check pipeline status on mount
  useEffect(() => {
    if (!deckUuid || hasChecked.current) return;
    hasChecked.current = true;

    // Mock mode - sequential stage completion for demo
    if (mock) {
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

          // Get detailed status
          const statusResponse = await getAnalysisStatus(existingAnalysis.uuid);
          mapAgentsToStages(statusResponse);

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

          // Continue polling for pending/processing
          if (existingAnalysis.status === 'pending' || existingAnalysis.status === 'processing') {
            await pollAnalysisComplete(existingAnalysis.uuid, {
              onProgress: (progress) => {
                setOverallProgress(progress);
                onProgress?.(progress);
              }
            });
            onComplete?.(existingAnalysis.uuid);

            // Fetch summary data after pipeline completes
            await fetchSummaryData(deckUuid);

            return;
          }
        } else {
          // No analysis exists - start new one if auto-start enabled
          if (autoStart) {
            const newAnalysis = await startAnalysis(deckUuid);
            setAnalysisUuid(newAnalysis.uuid);
            setOverallStatus(newAnalysis.status);

            // Poll until complete
            await pollAnalysisComplete(newAnalysis.uuid, {
              onProgress: (progress) => {
                setOverallProgress(progress);
                onProgress?.(progress);
              }
            });
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
