/**
 * Evaluation Domain Types
 * Core types for evaluation form state and logic
 */

import type {
  EvaluationCategory,
  EvaluationType,
  StartupStage,
  DecisionType
} from '@/constants/evaluation-criteria';

export type { EvaluationCategory, EvaluationType, StartupStage, DecisionType };

export interface RedFlag {
  id: string;
  category: EvaluationCategory;
  message: string;
  severity: 'high' | 'medium' | 'low';
  dismissed: boolean;
}

export interface EvaluationState {
  evaluationType: EvaluationType;
  startupStage: StartupStage;
  lastUpdated: string | null;
  categoryScores: Record<EvaluationCategory, number>;
  subCriteriaScores: Record<string, number>;
  decision: DecisionType | null;
  confidence: number;
  decisionComment: string;
  redFlags: RedFlag[];
  isDirty: boolean;
  isSubmitting: boolean;
}

export interface EvaluationActions {
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
}

// ==================== Enhanced Evaluation Types for Detail Tabs ====================

/**
 * Category score with detailed breakdown
 * Used for displaying evaluation results in the Evaluation tab
 */
export interface CategoryEvaluation {
  category: EvaluationCategory;
  score: number; // 0-100
  weight: number; // From EVALUATION_CATEGORIES
  subScores: SubCriterionScore[];
  evidence: EvidenceQuote[];
  strengths: string[];
  weaknesses: string[];
}

/**
 * Sub-criterion score with max value
 */
export interface SubCriterionScore {
  id: string;
  label: string;
  score: number; // 0 to maxScore
  maxScore: number;
}

/**
 * Evidence quote with slide reference
 * Provides source for evaluation scores
 */
export interface EvidenceQuote {
  text: string;
  slideNumber?: number;
  category: EvaluationCategory;
  relevanceScore: number;
}

/**
 * Overall evaluation result
 * Complete evaluation with all categories and summary
 */
export interface EvaluationResult {
  overallScore: number; // 0-100 weighted
  categories: CategoryEvaluation[];
  strengths: StrengthItem[];
  improvements: ImprovementItem[];
  benchmarkComparison?: BenchmarkComparison;
}

/**
 * Strength item with category reference
 */
export interface StrengthItem {
  id: string;
  title: string;
  description: string;
  category: EvaluationCategory;
  impact: 'high' | 'medium' | 'low';
}

/**
 * Improvement item with severity
 */
export interface ImprovementItem {
  id: string;
  title: string;
  description: string;
  category: EvaluationCategory;
  severity: 'high' | 'medium' | 'low';
  priority: number;
}

/**
 * Benchmark comparison data
 */
export interface BenchmarkComparison {
  industryAverage: number;
  percentile: number; // 0-100
  comparison: 'above' | 'at' | 'below';
}
