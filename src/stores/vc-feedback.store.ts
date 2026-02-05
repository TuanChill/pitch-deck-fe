/**
 * VC Feedback Store
 * Zustand store for VC pitch deck feedback state management
 */

import type { VcFeedbackResponse, FeedbackGenerationState } from '@/types/domain/vc-feedback';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VcFeedbackState {
  // State
  feedback: VcFeedbackResponse | null;
  generationState: FeedbackGenerationState;

  // Actions
  setFeedback: (feedback: VcFeedbackResponse | null) => void;
  setGenerationState: (state: FeedbackGenerationState) => void;
  clearFeedback: () => void;
  resetGenerationState: () => void;
}

/**
 * Initial generation state
 */
const initialGenerationState: FeedbackGenerationState = {
  status: 'pending',
  progress: 0,
  error: undefined
};

/**
 * VC Feedback Store
 * Manages VC feedback data and generation state
 */
export const useVcFeedbackStore = create<VcFeedbackState>()(
  persist(
    (set) => ({
      // Initial state
      feedback: null,
      generationState: initialGenerationState,

      // Actions
      setFeedback: (feedback) => set({ feedback }),

      setGenerationState: (generationState) => set({ generationState }),

      clearFeedback: () => set({ feedback: null }),

      resetGenerationState: () => set({ generationState: initialGenerationState })
    }),
    {
      name: 'vc-feedback-storage'
    }
  )
);
