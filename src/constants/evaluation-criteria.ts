/**
 * Evaluation Criteria Constants
 * Defines 11 evaluation categories with weights and sub-criteria for pitch deck evaluation
 */

export type EvaluationCategory =
  | 'problem'
  | 'solution'
  | 'market'
  | 'product'
  | 'businessModel'
  | 'competitiveAdvantage'
  | 'traction'
  | 'team'
  | 'goToMarket'
  | 'fundraising'
  | 'pitchQuality';

export type EvaluationType = 'standard' | 'deep_dive' | 'quick_screen';
export type StartupStage = 'idea' | 'mvp' | 'traction' | 'growth' | 'scale';

export interface SubCriterion {
  id: string;
  label: string;
  maxScore: number;
}

export interface EvaluationCategoryConfig {
  label: string;
  weight: number;
  subCriteria: SubCriterion[];
}

export const EVALUATION_CATEGORIES: Record<EvaluationCategory, EvaluationCategoryConfig> = {
  problem: {
    label: 'Problem',
    weight: 10,
    subCriteria: [
      { id: 'problem_clarity', label: 'Clarity of Problem Statement', maxScore: 5 },
      { id: 'problem_urgency', label: 'Urgency & Pain Point Severity', maxScore: 5 }
    ]
  },
  solution: {
    label: 'Solution',
    weight: 10,
    subCriteria: [
      { id: 'solution_fit', label: 'Solution-Problem Fit', maxScore: 5 },
      { id: 'solution_uniqueness', label: 'Unique Value Proposition', maxScore: 5 }
    ]
  },
  market: {
    label: 'Market',
    weight: 10,
    subCriteria: [
      { id: 'market_size', label: 'Market Size (TAM/SAM/SOM)', maxScore: 5 },
      { id: 'market_growth', label: 'Market Growth Rate', maxScore: 5 }
    ]
  },
  product: {
    label: 'Product',
    weight: 10,
    subCriteria: [
      { id: 'product_readiness', label: 'Product Readiness & Maturity', maxScore: 5 },
      { id: 'product_scalability', label: 'Scalability & Tech Stack', maxScore: 5 }
    ]
  },
  businessModel: {
    label: 'Business Model',
    weight: 10,
    subCriteria: [
      { id: 'revenue_streams', label: 'Revenue Streams Clarity', maxScore: 5 },
      { id: 'unit_economics', label: 'Unit Economics (LTV/CAC)', maxScore: 5 }
    ]
  },
  competitiveAdvantage: {
    label: 'Competitive Advantage',
    weight: 10,
    subCriteria: [
      { id: 'differentiation', label: 'Differentiation & Moat', maxScore: 5 },
      { id: 'barriers_to_entry', label: 'Barriers to Entry', maxScore: 5 }
    ]
  },
  traction: {
    label: 'Traction',
    weight: 15,
    subCriteria: [
      { id: 'customer_adoption', label: 'Customer Adoption & Growth', maxScore: 8 },
      { id: 'partnerships', label: 'Partnerships & Distribution', maxScore: 7 }
    ]
  },
  team: {
    label: 'Team',
    weight: 15,
    subCriteria: [
      { id: 'founder_experience', label: 'Founder Experience & Expertise', maxScore: 8 },
      { id: 'team_completeness', label: 'Team Completeness & Culture', maxScore: 7 }
    ]
  },
  goToMarket: {
    label: 'Go-to-Market',
    weight: 5,
    subCriteria: [
      { id: 'gtm_strategy', label: 'GTM Strategy', maxScore: 3 },
      { id: 'sales_marketing', label: 'Sales & Marketing Plan', maxScore: 2 }
    ]
  },
  fundraising: {
    label: 'Fundraising & Financials',
    weight: 5,
    subCriteria: [
      { id: 'funding_ask', label: 'Funding Ask Clarity', maxScore: 3 },
      { id: 'financial_projections', label: 'Financial Projections', maxScore: 2 }
    ]
  },
  pitchQuality: {
    label: 'Pitch Quality',
    weight: 10,
    subCriteria: [
      { id: 'storytelling', label: 'Storytelling & Narrative', maxScore: 5 },
      { id: 'visual_design', label: 'Visual Design & Clarity', maxScore: 5 }
    ]
  }
};

export const DEFAULT_CATEGORY_SCORES: Record<EvaluationCategory, number> = {
  problem: 0,
  solution: 0,
  market: 0,
  product: 0,
  businessModel: 0,
  competitiveAdvantage: 0,
  traction: 0,
  team: 0,
  goToMarket: 0,
  fundraising: 0,
  pitchQuality: 0
};

export const DECISION_TYPES = {
  strong_pass: { label: 'Strong Pass', color: 'bg-emerald-500', textColor: 'text-emerald-700' },
  pass: { label: 'Pass', color: 'bg-green-500', textColor: 'text-green-700' },
  hold: { label: 'Hold', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  reject: { label: 'Reject', color: 'bg-red-500', textColor: 'text-red-700' }
} as const;

export type DecisionType = keyof typeof DECISION_TYPES;
