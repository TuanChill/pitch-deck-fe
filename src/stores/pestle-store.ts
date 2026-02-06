/**
 * PESTLE Store
 * Zustand store for PESTLE analysis state management with localStorage persistence
 */

import { generatePestle, getPestleByDeck } from '@/services/api';
import type { PestleData, PestleStatus } from '@/types/response/pestle-response.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PestleState {
  // State - keyed by pitch deck id
  pestleData: Record<string, PestleData>;
  statuses: Record<string, PestleStatus>;
  errors: Record<string, string | null>;
  loading: Record<string, boolean>;
}

interface PestleActions {
  // Actions
  generatePestle: (id: string) => Promise<void>;
  fetchPestle: (id: string) => Promise<void>;
  resetPestle: (id: string) => void;
  setError: (id: string, error: string | null) => void;
  clearAll: () => void;
}

type PestleStore = PestleState & PestleActions;

/**
 * Initial empty state
 */
const initialState: PestleState = {
  pestleData: {},
  statuses: {},
  errors: {},
  loading: {}
};

/**
 * PESTLE Store
 * Manages PESTLE analysis data by pitch deck ID with auto-persistence
 */
export const usePestleStore = create<PestleStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Generate PESTLE analysis for a pitch deck
      generatePestle: async (id: string) => {
        set((state) => ({
          loading: { ...state.loading, [id]: true },
          statuses: { ...state.statuses, [id]: 'pending' },
          errors: { ...state.errors, [id]: null }
        }));

        try {
          const response = await generatePestle(id);

          set((state) => ({
            loading: { ...state.loading, [id]: false },
            statuses: { ...state.statuses, [id]: response.status }
          }));

          // Start polling for completion
          if (response.status === 'pending' || response.status === 'processing') {
            get().fetchPestle(id); // Fetch to get the actual status
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

      // Fetch PESTLE data for a pitch deck
      fetchPestle: async (id: string) => {
        set((state) => ({
          loading: { ...state.loading, [id]: true }
        }));

        try {
          const response = await getPestleByDeck(id);

          set((state) => ({
            loading: { ...state.loading, [id]: false },
            pestleData: response.data
              ? { ...state.pestleData, [id]: response.data }
              : state.pestleData,
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

      // Reset PESTLE data for a specific pitch deck
      resetPestle: (id: string) => {
        set((state) => {
          const newData = { ...state.pestleData };
          const newStatuses = { ...state.statuses };
          const newErrors = { ...state.errors };
          const newLoading = { ...state.loading };

          delete newData[id];
          delete newStatuses[id];
          delete newErrors[id];
          delete newLoading[id];

          return {
            pestleData: newData,
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

      // Clear all PESTLE data (useful for logout)
      clearAll: () => {
        set(initialState);
      }
    }),
    {
      name: 'pestle-storage',
      // Partialize - only persist data, statuses, errors (exclude loading)
      partialize: (state) => ({
        pestleData: state.pestleData,
        statuses: state.statuses,
        errors: state.errors
      })
    }
  )
);
