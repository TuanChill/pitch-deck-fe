import { AGENT_TO_STAGE_MAP } from '@/constants/pipeline-stages';
import {
  getAnalysisByDeck,
  getAnalysisStatus,
  pollAnalysisComplete,
  startAnalysis
} from '@/services/api';
import { usePipelineStore } from '@/stores/pipeline.store';
import type { AnalysisStatusResponse } from '@/types/response/pitch-deck';
import { useEffect, useRef } from 'react';

interface UsePipelineAutoStartOptions {
  autoStart?: boolean;
  onProgress?: (progress: number) => void;
  onComplete?: (analysisUuid: string) => void;
  onError?: (error: string) => void;
}

export const usePipelineAutoStart = (
  deckUuid: string,
  options: UsePipelineAutoStartOptions = {}
) => {
  const { autoStart = true, onProgress, onComplete, onError } = options;

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
    clearAnalysis
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

  // Check pipeline status on mount
  useEffect(() => {
    if (!deckUuid || hasChecked.current) return;
    hasChecked.current = true;

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
