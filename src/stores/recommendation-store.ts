/**
 * Recommendation Store
 * Zustand store for investment recommendation state management with localStorage persistence
 */

import { generateRecommendation, getRecommendationByDeck } from '@/services/api';
import type {
  RecommendationData,
  RecommendationStatus
} from '@/types/response/recommendation-response.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecommendationState {
  // State - keyed by pitch deck id
  recommendationData: Record<string, RecommendationData>;
  statuses: Record<string, RecommendationStatus>;
  errors: Record<string, string | null>;
  loading: Record<string, boolean>;
}

interface RecommendationActions {
  // Actions
  generateRecommendation: (id: string) => Promise<void>;
  fetchRecommendation: (id: string) => Promise<void>;
  resetRecommendation: (id: string) => void;
  setError: (id: string, error: string | null) => void;
  clearAll: () => void;
}

type RecommendationStore = RecommendationState & RecommendationActions;

/**
 * Initial empty state
 */
const initialState: RecommendationState = {
  recommendationData: {},
  statuses: {},
  errors: {},
  loading: {}
};

/**
 * Recommendation Store
 * Manages investment recommendation data by pitch deck ID with auto-persistence
 */
export const useRecommendationStore = create<RecommendationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Generate recommendation for a pitch deck
      generateRecommendation: async (id: string) => {
        set((state) => ({
          loading: { ...state.loading, [id]: true },
          statuses: { ...state.statuses, [id]: 'pending' },
          errors: { ...state.errors, [id]: null }
        }));

        try {
          const response = await generateRecommendation(id);

          set((state) => ({
            loading: { ...state.loading, [id]: false },
            statuses: { ...state.statuses, [id]: response.status }
          }));

          // Start polling for completion
          if (
            response.status === 'pending' ||
            response.status === 'searching' ||
            response.status === 'analyzing'
          ) {
            get().fetchRecommendation(id); // Fetch to get the actual status
          }
        } catch (error) {
          set((state) => ({
            loading: { ...state.loading, [id]: false },
            statuses: { ...state.statuses, [id]: 'failed' },
            errors: {
              ...state.errors,
              [id]: error instanceof Error ? error.message : 'Generation failed'
            }
          }));
        }
      },

      // Fetch recommendation data for a pitch deck
      fetchRecommendation: async (id: string) => {
        set((state) => ({
          loading: { ...state.loading, [id]: true }
        }));

        try {
          const response = await getRecommendationByDeck(id);

          set((state) => ({
            loading: { ...state.loading, [id]: false },
            recommendationData: response.data
              ? { ...state.recommendationData, [id]: response.data }
              : state.recommendationData,
            statuses: { ...state.statuses, [id]: response.status },
            errors: { ...state.errors, [id]: response.errorMessage || null }
          }));
        } catch (error) {
          set((state) => ({
            loading: { ...state.loading, [id]: false },
            errors: {
              ...state.errors,
              [id]: error instanceof Error ? error.message : 'Fetch failed'
            }
          }));
        }
      },

      // Reset recommendation data for a specific pitch deck
      resetRecommendation: (id: string) => {
        set((state) => {
          const newData = { ...state.recommendationData };
          const newStatuses = { ...state.statuses };
          const newErrors = { ...state.errors };
          const newLoading = { ...state.loading };

          delete newData[id];
          delete newStatuses[id];
          delete newErrors[id];
          delete newLoading[id];

          return {
            recommendationData: newData,
            statuses: newStatuses,
            errors: newErrors,
            loading: newLoading
          };
        });
      },

      // Set error for a specific pitch deck
      setError: (id: string, error: string | null) => {
        set((state) => ({
          errors: { ...state.errors, [id]: error }
        }));
      },

      // Clear all recommendation data (useful for logout)
      clearAll: () => {
        set(initialState);
      }
    }),
    {
      name: 'recommendation-storage',
      // Partialize - only persist data, statuses, errors (exclude loading)
      partialize: (state) => ({
        recommendationData: state.recommendationData,
        statuses: state.statuses,
        errors: state.errors
      })
    }
  )
);
