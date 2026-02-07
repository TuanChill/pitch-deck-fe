import { getPitchDeckDetail, getPitchDeckSummary } from '@/services/api';
import { usePipelineStore } from '@/stores/pipeline.store';
import { useEffect, useRef } from 'react';

interface UsePipelineAutoStartOptions {
  currentStep?: 'extract' | 'summary' | 'analytics' | 'swot' | 'pestle' | 'recommendation' | 'done';
  onComplete?: (deckUuid: string) => void;
  onError?: (error: string) => void;
  onDeckUpdate?: (deck: { currentStep: string }) => void;
}

const STAGES = ['extract', 'summary', 'analytics', 'swot', 'pestle', 'recommendation'] as const;
type Stage = (typeof STAGES)[number];
const POLL_INTERVAL = 2000; // 2 seconds for polling
const MAX_POLLS = 450; // 15 minutes max

export const usePipelineAutoStart = (
  deckUuid: string,
  options: UsePipelineAutoStartOptions = {}
) => {
  const { currentStep, onComplete, onError, onDeckUpdate } = options;

  const isPollingRef = useRef(false);
  const deckStepRef = useRef<string | undefined>(undefined);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    setOverallStatus,
    setOverallProgress,
    updateStage,
    setCurrentStage,
    setPolling,
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
      setOverallStatus('running');
    }
  };

  const completePipeline = async () => {
    setOverallStatus('completed');
    setPolling(false);
    setOverallProgress(100);
    onComplete?.(deckUuid);
    await fetchSummaryData(deckUuid);
    stopPolling();
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    isPollingRef.current = false;
    setPolling(false);
  };

  const pollDeckStatus = async () => {
    if (!deckUuid || !isPollingRef.current) return;

    try {
      const deckDetail = await getPitchDeckDetail(deckUuid);
      const newDeckStep = deckDetail.currentStep;

      if (newDeckStep && newDeckStep !== deckStepRef.current) {
        deckStepRef.current = newDeckStep;
        syncStagesWithCurrentStep(newDeckStep);
        onDeckUpdate?.({ currentStep: newDeckStep });

        if (newDeckStep === 'done') {
          await completePipeline();
        }
      }
    } catch (err) {
      console.error('Failed to poll deck status:', err);
    }
  };

  const startPolling = () => {
    if (isPollingRef.current) return;

    isPollingRef.current = true;
    setPolling(true);

    // Initial sync with current step
    if (currentStep) {
      syncStagesWithCurrentStep(currentStep);
      deckStepRef.current = currentStep;

      if (currentStep === 'done') {
        completePipeline();

        return;
      }
    }

    // Start polling interval
    pollIntervalRef.current = setInterval(pollDeckStatus, POLL_INTERVAL);
    // Also poll immediately
    pollDeckStatus();
  };

  // Start polling on mount
  useEffect(() => {
    if (!deckUuid) return;

    startPolling();

    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckUuid]);

  // Sync when currentStep prop changes
  useEffect(() => {
    if (currentStep && currentStep !== deckStepRef.current) {
      syncStagesWithCurrentStep(currentStep);
      deckStepRef.current = currentStep;

      if (currentStep === 'done') {
        completePipeline();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  return {
    isPolling: usePipelineStore((s) => s.isPolling),
    overallStatus: usePipelineStore((s) => s.overallStatus),
    overallProgress: usePipelineStore((s) => s.overallProgress),
    stages: usePipelineStore((s) => s.stages),
    currentStage: usePipelineStore((s) => s.currentStage),
    error: usePipelineStore((s) => s.error)
  };
};
