/**
 * SWOT Store
 * Zustand store for SWOT analysis state management with localStorage persistence
 */

import type { SwotData, SwotStatus } from '@/types/response/swot-response.types';
import { generateSwot, getSwotByDeck } from '@/services/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SwotState {
  // State - keyed by pitch deck id
  swotData: Record<string, SwotData>;
  statuses: Record<string, SwotStatus>;
  errors: Record<string, string | null>;
  loading: Record<string, boolean>;
}

interface SwotActions {
  // Actions
  generateSwot: (id: string) => Promise<void>;
  fetchSwot: (id: string) => Promise<void>;
  resetSwot: (id: string) => void;
  setError: (id: string, error: string | null) => void;
  clearAll: () => void;
}

type SwotStore = SwotState & SwotActions;

/**
 * Initial empty state
 */
const initialState: SwotState = {
  swotData: {},
  statuses: {},
  errors: {},
  loading: {},
};

/**
 * SWOT Store
 * Manages SWOT analysis data by pitch deck ID with auto-persistence
 */
export const useSwotStore = create<SwotStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Generate SWOT analysis for a pitch deck
      generateSwot: async (id: string) => {
        set((state) => ({
          loading: { ...state.loading, [id]: true },
          statuses: { ...state.statuses, [id]: 'pending' },
          errors: { ...state.errors, [id]: null },
        }));

        try {
          const response = await generateSwot(id);

          set((state) => ({
            loading: { ...state.loading, [id]: false },
            statuses: { ...state.statuses, [id]: response.status },
          }));

          // Start polling for completion
          if (response.status === 'pending' || response.status === 'processing') {
            get().fetchSwot(id); // Fetch to get the actual status
          }
        } catch (error) {
          set((state) => ({
            loading: { ...state.loading, [id]: false },
            statuses: { ...state.statuses, [id]: 'failed' },
            errors: { ...state.errors, [id]: error instanceof Error ? error.message : 'Generation failed' },
          }));
        }
      },

      // Fetch SWOT data for a pitch deck
      fetchSwot: async (id: string) => {
        set((state) => ({
          loading: { ...state.loading, [id]: true },
        }));

        try {
          const response = await getSwotByDeck(id);

          set((state) => ({
            loading: { ...state.loading, [id]: false },
            swotData: response.data
              ? { ...state.swotData, [id]: response.data }
              : state.swotData,
            statuses: { ...state.statuses, [id]: response.status },
            errors: { ...state.errors, [id]: response.errorMessage || null },
          }));
        } catch (error) {
          set((state) => ({
            loading: { ...state.loading, [id]: false },
            errors: { ...state.errors, [id]: error instanceof Error ? error.message : 'Fetch failed' },
          }));
        }
      },

      // Reset SWOT data for a specific pitch deck
      resetSwot: (id: string) => {
        set((state) => {
          const newData = { ...state.swotData };
          const newStatuses = { ...state.statuses };
          const newErrors = { ...state.errors };
          const newLoading = { ...state.loading };

          delete newData[id];
          delete newStatuses[id];
          delete newErrors[id];
          delete newLoading[id];

          return {
            swotData: newData,
            statuses: newStatuses,
            errors: newErrors,
            loading: newLoading,
          };
        });
      },

      // Set error for a specific pitch deck
      setError: (id: string, error: string | null) => {
        set((state) => ({
          errors: { ...state.errors, [id]: error },
        }));
      },

      // Clear all SWOT data (useful for logout)
      clearAll: () => {
        set(initialState);
      },
    }),
    {
      name: 'swot-storage',
      // Partialize - only persist data, statuses, errors (exclude loading)
      partialize: (state) => ({
        swotData: state.swotData,
        statuses: state.statuses,
        errors: state.errors,
      }),
    }
  )
);
