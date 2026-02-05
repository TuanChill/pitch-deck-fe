/**
 * Evaluation Form Store
 * Manages pitch deck evaluation criteria scoring state
 */

import { DEFAULT_CATEGORY_SCORES } from '@/constants/evaluation-criteria';
import type {
  DecisionType,
  EvaluationCategory,
  EvaluationType,
  RedFlag,
  StartupStage
} from '@/types/domain/evaluation.types';
import { create } from 'zustand';

interface EvaluationStore {
  // Form metadata
  evaluationType: EvaluationType;
  startupStage: StartupStage;
  lastUpdated: string | null;

  // Scores by category (11 categories)
  categoryScores: Record<EvaluationCategory, number>;

  // Sub-criteria scores (optional/admin mode)
  subCriteriaScores: Record<string, number>;

  // Final decision
  decision: DecisionType | null;
  confidence: number;
  decisionComment: string;

  // Red flags
  redFlags: RedFlag[];

  // Form state
  isDirty: boolean;
  isSubmitting: boolean;

  // Actions
  setEvaluationType: (type: EvaluationType) => void;
  setStartupStage: (stage: StartupStage) => void;
  setCategoryScore: (category: EvaluationCategory, score: number) => void;
  setSubCriteriaScore: (id: string, score: number) => void;
  setDecision: (decision: DecisionType | null) => void;
  setConfidence: (confidence: number) => void;
  setDecisionComment: (comment: string) => void;
  addRedFlag: (flag: Omit<RedFlag, 'id'>) => void;
  removeRedFlag: (id: string) => void;
  dismissRedFlag: (id: string) => void;
  saveEvaluation: (deckUuid: string) => Promise<void>;
  resetForm: () => void;
  calculateTotalScore: () => number;
}

export const useEvaluationStore = create<EvaluationStore>((set, get) => ({
  // Initial state
  evaluationType: 'standard',
  startupStage: 'traction',
  lastUpdated: null,
  categoryScores: { ...DEFAULT_CATEGORY_SCORES },
  subCriteriaScores: {},
  decision: null,
  confidence: 75,
  decisionComment: '',
  redFlags: [],
  isDirty: false,
  isSubmitting: false,

  // Actions
  setEvaluationType: (type) => set({ evaluationType: type, isDirty: true }),

  setStartupStage: (stage) => set({ startupStage: stage, isDirty: true }),

  setCategoryScore: (category, score) =>
    set((state) => ({
      categoryScores: { ...state.categoryScores, [category]: score },
      isDirty: true,
      lastUpdated: new Date().toISOString()
    })),

  setSubCriteriaScore: (id, score) =>
    set((state) => ({
      subCriteriaScores: { ...state.subCriteriaScores, [id]: score },
      isDirty: true
    })),

  setDecision: (decision) =>
    set({
      decision,
      isDirty: true,
      lastUpdated: new Date().toISOString()
    }),

  setConfidence: (confidence) => set({ confidence, isDirty: true }),

  setDecisionComment: (comment) => set({ decisionComment: comment, isDirty: true }),

  addRedFlag: (flag) =>
    set((state) => ({
      redFlags: [
        ...state.redFlags,
        { ...flag, id: `rf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
      ],
      isDirty: true
    })),

  removeRedFlag: (id) =>
    set((state) => ({
      redFlags: state.redFlags.filter((f) => f.id !== id),
      isDirty: true
    })),

  dismissRedFlag: (id) =>
    set((state) => ({
      redFlags: state.redFlags.map((f) => (f.id === id ? { ...f, dismissed: true } : f)),
      isDirty: true
    })),

  saveEvaluation: async (deckUuid) => {
    set({ isSubmitting: true });
    try {
      // Mock save - in production this would call the API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({
        isDirty: false,
        isSubmitting: false,
        lastUpdated: new Date().toISOString()
      });
      // eslint-disable-next-line no-console
      console.log('Evaluation saved for deck:', deckUuid, get().categoryScores);
    } catch (error) {
      set({ isSubmitting: false });
      throw error;
    }
  },

  resetForm: () =>
    set({
      evaluationType: 'standard',
      startupStage: 'traction',
      lastUpdated: null,
      categoryScores: { ...DEFAULT_CATEGORY_SCORES },
      subCriteriaScores: {},
      decision: null,
      confidence: 75,
      decisionComment: '',
      redFlags: [],
      isDirty: false,
      isSubmitting: false
    }),

  calculateTotalScore: () => {
    const scores = get().categoryScores;
    const weights = {
      problem: 10,
      solution: 10,
      market: 10,
      product: 10,
      businessModel: 10,
      competitiveAdvantage: 10,
      traction: 15,
      team: 15,
      goToMarket: 5,
      fundraising: 5,
      pitchQuality: 10
    } as const;

    const weightedScore = Object.entries(scores).reduce((sum, [category, score]) => {
      const weight = weights[category as EvaluationCategory] || 0;

      return sum + (score * weight) / weight;
    }, 0);

    const finalScore = Math.round(weightedScore);

    return finalScore;
  }
}));
