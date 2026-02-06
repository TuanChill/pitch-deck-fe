/**
 * VC Evaluation Constants
 * Vietnamese labels, weights, and decision framework for VC feedback
 */

import type { VcFeedbackSection, VcDecision, VcSectionFeedback } from '@/types/domain/vc-feedback';

/**
 * VC feedback section metadata
 * Vietnamese labels, descriptions, weights, and icons
 */
export const VC_FEEDBACK_SECTIONS: Record<
  VcFeedbackSection,
  { label: string; description: string; weight: number; icon: string }
> = {
  content: {
    label: 'Content',
    description: 'Problem clarity, solution fit, logical flow, market sizing',
    weight: 0.15,
    icon: 'FileText'
  },
  product: {
    label: 'Product & Execution',
    description: 'Product maturity, traction quality, roadmap feasibility',
    weight: 0.15,
    icon: 'Package'
  },
  market: {
    label: 'Market & Business',
    description: 'Market size, GTM strategy, business model, scalability',
    weight: 0.2,
    icon: 'TrendingUp'
  },
  competitive: {
    label: 'Competitive Advantage',
    description: 'Differentiation, moat, sustainability',
    weight: 0.15,
    icon: 'Shield'
  },
  team: {
    label: 'Team',
    description: 'Founder-problem fit, skill balance, execution capability',
    weight: 0.25, // Highest weight
    icon: 'Users'
  },
  presentation: {
    label: 'Presentation',
    description: 'Slide structure, visual clarity, storytelling',
    weight: 0.1,
    icon: 'Presentation'
  },
  overall: {
    label: 'Overall Assessment',
    description: 'Overall impression, strengths, risks, recommendation',
    weight: 0,
    icon: 'Star'
  },
  overall_assessment: {
    label: 'Overall Assessment',
    description: 'Overall impression, strengths, risks, recommendation',
    weight: 0,
    icon: 'Star'
  }
};

/**
 * VC decision metadata
 * Vietnamese labels and decision thresholds
 */
export const VC_DECISIONS: Record<
  VcDecision,
  { label: string; description: string; color: string; minScore: number }
> = {
  invest: {
    label: 'Invest',
    description: 'Strong across all criteria',
    color: 'green',
    minScore: 8
  },
  deep_dive: {
    label: 'Deep Dive',
    description: 'Promising but needs more info',
    color: 'blue',
    minScore: 6
  },
  watchlist: {
    label: 'Watchlist',
    description: 'Interesting but timing not right',
    color: 'yellow',
    minScore: 4
  },
  pass: {
    label: 'Pass',
    description: 'Fundamental concerns',
    color: 'red',
    minScore: 0
  }
};

/**
 * Score range classifications
 * Vietnamese labels for score bands
 */
export const VC_SCORE_RANGES = {
  EXCELLENT: { min: 8, max: 10, label: 'Excellent', color: 'green' },
  GOOD: { min: 6, max: 8, label: 'Good', color: 'blue' },
  AVERAGE: { min: 4, max: 6, label: 'Average', color: 'yellow' },
  POOR: { min: 0, max: 4, label: 'Needs Improvement', color: 'red' }
} as const;

/**
 * Get score range label from numeric score
 */
export const getScoreRangeLabel = (score: number): string => {
  if (score >= 8) return VC_SCORE_RANGES.EXCELLENT.label;
  if (score >= 6) return VC_SCORE_RANGES.GOOD.label;
  if (score >= 4) return VC_SCORE_RANGES.AVERAGE.label;

  return VC_SCORE_RANGES.POOR.label;
};

/**
 * Get score range color from numeric score
 */
export const getScoreRangeColor = (score: number): string => {
  if (score >= 8) return VC_SCORE_RANGES.EXCELLENT.color;
  if (score >= 6) return VC_SCORE_RANGES.GOOD.color;
  if (score >= 4) return VC_SCORE_RANGES.AVERAGE.color;

  return VC_SCORE_RANGES.POOR.color;
};

/**
 * Calculate weighted overall score from section scores
 */
export const calculateOverallScore = (sections: VcSectionFeedback[]): number => {
  let totalWeight = 0;
  let weightedSum = 0;

  sections.forEach((section) => {
    const meta = VC_FEEDBACK_SECTIONS[section.section];
    if (meta.weight > 0) {
      weightedSum += section.score * meta.weight;
      totalWeight += meta.weight;
    }
  });

  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0;
};

/**
 * Determine decision from overall score
 */
export const getDecisionFromScore = (score: number): VcDecision => {
  if (score >= VC_DECISIONS.invest.minScore) return 'invest';
  if (score >= VC_DECISIONS.deep_dive.minScore) return 'deep_dive';
  if (score >= VC_DECISIONS.watchlist.minScore) return 'watchlist';

  return 'pass';
};
