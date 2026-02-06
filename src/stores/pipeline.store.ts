import { INITIAL_STAGES } from '@/constants/pipeline-stages';
import type { PipelineStore } from '@/types/domain/pipeline';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  analysisUuid: null,
  overallStatus: null,
  overallProgress: 0,
  stages: INITIAL_STAGES,
  currentStage: null,
  isPolling: false,
  pollCount: 0,
  error: null,
  summaryData: null
};

export const usePipelineStore = create<PipelineStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Analysis management
      setAnalysisUuid: (uuid) => set({ analysisUuid: uuid }),

      clearAnalysis: () =>
        set({
          analysisUuid: null,
          overallStatus: null,
          overallProgress: 0,
          stages: INITIAL_STAGES,
          currentStage: null,
          isPolling: false,
          pollCount: 0,
          error: null,
          summaryData: null
        }),

      // Status updates
      setOverallStatus: (status) => set({ overallStatus: status }),

      setOverallProgress: (progress) =>
        set({ overallProgress: Math.max(0, Math.min(100, progress)) }),

      // Stage management
      setStages: (stages) => set({ stages }),

      updateStage: (stageId, updates) =>
        set((state) => ({
          stages: {
            ...state.stages,
            [stageId]: {
              ...state.stages[stageId],
              ...updates
            }
          }
        })),

      setCurrentStage: (stageId) => set({ currentStage: stageId }),

      // Polling control
      setPolling: (isPolling) => set({ isPolling }),

      incrementPollCount: () => set((state) => ({ pollCount: state.pollCount + 1 })),

      resetPollCount: () => set({ pollCount: 0 }),

      // Error handling
      setError: (error) => set({ error }),

      // Summary data
      setSummaryData: (data) => set({ summaryData: data }),

      // Reset
      reset: () => set(initialState),

      // Mock completed state for development/demo
      mockCompleted: () =>
        set((state) => ({
          overallStatus: 'completed',
          overallProgress: 100,
          stages: Object.fromEntries(
            Object.keys(state.stages).map((key) => [
              key,
              { ...state.stages[key], status: 'completed', progress: 100 }
            ])
          ),
          currentStage: null,
          isPolling: false,
          error: null
        }))
    }),
    {
      name: 'pipeline-storage',
      partialize: (state) => ({
        analysisUuid: state.analysisUuid,
        stages: state.stages,
        currentStage: state.currentStage
      })
    }
  )
);
