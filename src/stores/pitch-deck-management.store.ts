/**
 * Pitch Deck Management Store
 *
 * Manages pitch deck collection state (list, detail, delete operations).
 * Phase 04: Integrated real API services, removed dynamic imports.
 *
 * @module stores/pitch-deck-management
 */

import {
  deletePitchDeck,
  getPitchDeckDetail,
  listPitchDecks
} from '@/services/api/pitch-deck.service';
import type { ListPitchDecksQuery } from '@/types/request/pitch-deck';
import type { PitchDeckListItem, PitchDeckDetailResponse } from '@/types/response/pitch-deck';
import { create } from 'zustand';

/**
 * State for pitch deck collection management
 */
type ManagementState = {
  /** Collection of pitch decks (list view) */
  pitchDecks: PitchDeckListItem[];
  /** Current selected deck (detail view) */
  currentDeck: PitchDeckDetailResponse | null;
  /** Total number of decks */
  total: number;
  /** Items per page */
  limit: number;
  /** Current page offset */
  offset: number;
  /** Active filters */
  filters: {
    status?: 'uploading' | 'processing' | 'ready' | 'error';
  };
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
};

/**
 * Actions for pitch deck collection management
 */
type ManagementActions = {
  /** Fetch pitch decks with pagination/filter */
  fetchPitchDecks: (query?: ListPitchDecksQuery) => Promise<void>;
  /** Fetch single deck by UUID */
  fetchPitchDeckDetail: (uuid: string) => Promise<void>;
  /** Add deck to collection (optimistic) */
  addPitchDeck: (deck: PitchDeckListItem) => void;
  /** Update deck in collection (optimistic) */
  updatePitchDeck: (uuid: string, updates: Partial<PitchDeckListItem>) => void;
  /** Remove deck from collection (optimistic + API call) */
  removePitchDeck: (uuid: string) => Promise<void>;
  /** Set current deck */
  setCurrentDeck: (deck: PitchDeckDetailResponse | null) => void;
  /** Update filters */
  setFilters: (filters: Partial<ManagementState['filters']>) => void;
  /** Update pagination offset */
  setPagination: (offset: number) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Reset to initial state */
  reset: () => void;
};

/**
 * Initial state for pitch deck management
 */
const initialState: ManagementState = {
  pitchDecks: [],
  currentDeck: null,
  total: 0,
  limit: 10,
  offset: 0,
  filters: {},
  isLoading: false,
  error: null
};

/**
 * Zustand store for pitch deck collection management
 * No localStorage persistence - session-only state
 *
 * @example
 * ```ts
 * const {
 *   pitchDecks,
 *   total,
 *   isLoading,
 *   fetchPitchDecks,
 *   removePitchDeck
 * } = usePitchDeckManagementStore();
 *
 * useEffect(() => {
 *   fetchPitchDecks();
 * }, []);
 *
 * const handleDelete = async (uuid: string) => {
 *   await removePitchDeck(uuid); // Optimistic + API
 * };
 * ```
 */
export const usePitchDeckManagementStore = create<ManagementState & ManagementActions>(
  (set, get) => ({
    ...initialState,

    fetchPitchDecks: async (query) => {
      set({ isLoading: true, error: null });
      try {
        const response = await listPitchDecks({
          status: query?.status || get().filters.status,
          limit: query?.limit || get().limit,
          offset: query?.offset || get().offset
        });

        set({
          pitchDecks: response.pitchDecks,
          total: response.total,
          isLoading: false
        });
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Failed to fetch pitch decks',
          isLoading: false
        });
      }
    },

    fetchPitchDeckDetail: async (uuid) => {
      set({ isLoading: true, error: null });
      try {
        const deck = await getPitchDeckDetail(uuid);
        set({ currentDeck: deck, isLoading: false });
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Failed to fetch pitch deck',
          isLoading: false
        });
      }
    },

    addPitchDeck: (deck) => {
      set((state) => ({
        pitchDecks: [deck, ...state.pitchDecks],
        total: state.total + 1
      }));
    },

    updatePitchDeck: (uuid, updates) => {
      set((state) => ({
        pitchDecks: state.pitchDecks.map((d) => (d.id === uuid ? { ...d, ...updates } : d))
      }));
    },

    removePitchDeck: async (uuid) => {
      // Optimistic update - remove immediately
      const previousDecks = get().pitchDecks;
      const previousTotal = get().total;

      set((state) => ({
        pitchDecks: state.pitchDecks.filter((d) => d.id !== uuid),
        total: state.total - 1
      }));

      try {
        // Call real API
        await deletePitchDeck(uuid);
      } catch (err) {
        // Rollback on error
        set({
          pitchDecks: previousDecks,
          total: previousTotal,
          error: err instanceof Error ? err.message : 'Failed to delete pitch deck'
        });
        throw err;
      }
    },

    setCurrentDeck: (deck) => set({ currentDeck: deck }),

    setFilters: (filters) => {
      set({ filters: { ...get().filters, ...filters } });
    },

    setPagination: (offset) => set({ offset }),

    setError: (error) => set({ error }),

    reset: () => set(initialState)
  })
);

/**
 * Selectors for common state patterns
 */
export const selectPitchDecks = (state: ManagementState) => ({
  pitchDecks: state.pitchDecks,
  total: state.total,
  isLoading: state.isLoading,
  error: state.error
});

export const selectCurrentDeck = (state: ManagementState) => state.currentDeck;

export const selectPagination = (state: ManagementState) => ({
  total: state.total,
  limit: state.limit,
  offset: state.offset
});

export const selectFilters = (state: ManagementState) => state.filters;
