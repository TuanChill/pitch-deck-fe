import type {
  UploadPitchDeckResponse,
  PitchDeckAnalysisResponse
} from '@/types/response/pitch-deck';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AnalysisStage = 'idle' | 'uploading' | 'analyzing' | 'insights' | 'completed' | 'error';

type UploadState = AnalysisStage;

type State = {
  uploadState: UploadState;
  currentStage: AnalysisStage;
  currentUpload: UploadPitchDeckResponse | null;
  currentAnalysis: PitchDeckAnalysisResponse | null;
  error: string | null;
  history: PitchDeckAnalysisResponse[];
};

type Actions = {
  setUploadState: (state: UploadState) => void;
  setCurrentStage: (stage: AnalysisStage) => void;
  setCurrentUpload: (upload: UploadPitchDeckResponse | null) => void;
  setCurrentAnalysis: (analysis: PitchDeckAnalysisResponse | null) => void;
  setError: (error: string | null) => void;
  addToHistory: (analysis: PitchDeckAnalysisResponse) => void;
  clearHistory: () => void;
  removeFromHistory: (deckId: string) => void;
  reset: () => void;
};

const defaultState: State = {
  uploadState: 'idle',
  currentStage: 'idle',
  currentUpload: null,
  currentAnalysis: null,
  error: null,
  history: []
};

export const usePitchDeckStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setUploadState: (uploadState) => set({ uploadState }),

      setCurrentStage: (currentStage) => set({ currentStage }),

      setCurrentUpload: (currentUpload) => set({ currentUpload }),

      setCurrentAnalysis: (currentAnalysis) => {
        set({ currentAnalysis, uploadState: 'completed', currentStage: 'completed' });
        if (currentAnalysis) {
          get().addToHistory(currentAnalysis);
        }
      },

      setError: (error) => set({ error, uploadState: 'error', currentStage: 'error' }),

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
  error: state.error
});

export const selectAnalysis = (state: State) => state.currentAnalysis;
export const selectHistory = (state: State) => state.history;
export const selectCurrentStage = (state: State) => state.currentStage;
