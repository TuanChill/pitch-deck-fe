/**
 * Domain Types Barrel Export
 * Centralized exports for all domain type definitions
 */

// Evaluation types
export type {
  RedFlag,
  EvaluationState,
  EvaluationActions,
  CategoryEvaluation,
  SubCriterionScore,
  EvidenceQuote,
  EvaluationResult,
  StrengthItem,
  ImprovementItem,
  BenchmarkComparison,
  EvaluationCategory,
  EvaluationType,
  StartupStage,
  DecisionType
} from './evaluation.types';

// Metrics types
export type {
  StartupMetrics,
  MarketSize,
  ScoreBand,
  ConfidenceLevel,
  GrowthTrend,
  CompetitorPosition,
  TeamMemberProfile
} from './metrics.types';

// UI State types
export type {
  SeverityLevel,
  ImpactLevel,
  TrendDirection,
  VerdictType,
  SummaryDecision,
  TrafficLightState,
  EnhancedSWOTItem,
  EnhancedPESTLEItem,
  CollapsibleState,
  TabState,
  FilterState,
  ColorVariant,
  SizeVariant,
  ActionItem,
  NextSteps
} from './ui-state.types';

// VC Feedback types
export type {
  VcFeedbackSection,
  VcSectionFeedback,
  VcDecision,
  VcFeedbackResponse,
  GenerateVcFeedbackRequest,
  FeedbackGenerationStatus,
  FeedbackGenerationState
} from './vc-feedback';
