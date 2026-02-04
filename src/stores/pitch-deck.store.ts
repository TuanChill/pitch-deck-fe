/**
 * Pitch Deck Store
 *
 * Manages pitch deck upload and analysis flow state.
 * Phase 04: Integrated real API services for analysis operations.
 *
 * @module stores/pitch-deck
 */

import { pollAnalysisComplete, startAnalysis } from '@/services/api/analysis.service';
import type { AnalysisResponse, PitchDeckDetailResponse } from '@/types/response/pitch-deck';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AnalysisStage = 'idle' | 'uploading' | 'analyzing' | 'insights' | 'completed' | 'error';

type UploadState = AnalysisStage;

type State = {
  uploadState: UploadState;
  currentStage: AnalysisStage;
  currentUpload: PitchDeckDetailResponse | null;
  currentAnalysis: AnalysisResponse | null;
  error: string | null;
  history: AnalysisResponse[];
  isAnalyzing: boolean;
  analysisProgress: number;
};

type Actions = {
  setUploadState: (state: UploadState) => void;
  setCurrentStage: (stage: AnalysisStage) => void;
  setCurrentUpload: (upload: PitchDeckDetailResponse | null) => void;
  setCurrentAnalysis: (analysis: AnalysisResponse | null) => void;
  setError: (error: string | null) => void;
  addToHistory: (analysis: AnalysisResponse) => void;
  clearHistory: () => void;
  removeFromHistory: (deckId: string) => void;
  reset: () => void;
  /** Start VC analysis for a pitch deck */
  startPitchDeckAnalysis: (
    pitchDeckUuid: string,
    onProgress?: (progress: number) => void
  ) => Promise<void>;
  /** Check analysis status by UUID */
  checkAnalysisStatus: (analysisUuid: string) => Promise<AnalysisResponse>;
  /** Clear analysis error state */
  clearAnalysisError: () => void;
  /** Set analysis progress */
  setAnalysisProgress: (progress: number) => void;
};

const defaultState: State = {
  uploadState: 'idle',
  currentStage: 'idle',
  currentUpload: null,
  currentAnalysis: null,
  error: null,
  history: [],
  isAnalyzing: false,
  analysisProgress: 0
};

export const usePitchDeckStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setUploadState: (uploadState) => set({ uploadState }),

      setCurrentStage: (currentStage) => set({ currentStage }),

      setCurrentUpload: (currentUpload) => set({ currentUpload }),

      setCurrentAnalysis: (currentAnalysis) => {
        set({
          currentAnalysis,
          uploadState: 'completed',
          currentStage: 'completed',
          isAnalyzing: false
        });
        if (currentAnalysis) {
          get().addToHistory(currentAnalysis);
        }
      },

      setError: (error) =>
        set({ error, uploadState: 'error', currentStage: 'error', isAnalyzing: false }),

      setAnalysisProgress: (progress) => set({ analysisProgress: progress }),

      addToHistory: (analysis) => {
        const history = get().history;
        const filtered = history.filter((a) => a.deckId !== analysis.deckId);
        set({ history: [analysis, ...filtered].slice(0, 10) });
      },

      clearHistory: () => set({ history: [] }),

      removeFromHistory: (deckId) => {
        const history = get().history.filter((a) => a.deckId !== deckId);
        set({ history });
      },

      clearAnalysisError: () => set({ error: null, currentStage: 'idle' }),

      startPitchDeckAnalysis: async (pitchDeckUuid, onProgress) => {
        set({ currentStage: 'analyzing', isAnalyzing: true, error: null, analysisProgress: 0 });
        try {
          // Start analysis and poll for completion
          const result = await startAnalysis(pitchDeckUuid);
          const analysis = await pollAnalysisComplete(result.uuid, {
            onProgress: (progress) => {
              set({ analysisProgress: progress });
              onProgress?.(progress);
            }
          });
          get().setCurrentAnalysis(analysis);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Analysis failed';
          set({ error: errorMsg, currentStage: 'error', isAnalyzing: false });
          throw err;
        }
      },

      checkAnalysisStatus: async (analysisUuid) => {
        try {
          const result = await pollAnalysisComplete(analysisUuid);
          get().setCurrentAnalysis(result);

          return result;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Failed to check analysis status';
          set({ error: errorMsg, currentStage: 'error', isAnalyzing: false });
          throw err;
        }
      },

      reset: () => set(defaultState)
    }),
    {
      name: 'pitch-deck-storage',
      partialize: (state) => ({
        history: state.history
      })
    }
  )
);

export const selectUploadState = (state: State) => ({
  uploadState: state.uploadState,
  currentStage: state.currentStage,
  currentUpload: state.currentUpload,
  error: state.error,
  isAnalyzing: state.isAnalyzing,
  analysisProgress: state.analysisProgress
});

export const selectAnalysis = (state: State) => state.currentAnalysis;
export const selectHistory = (state: State) => state.history;
export const selectCurrentStage = (state: State) => state.currentStage;
