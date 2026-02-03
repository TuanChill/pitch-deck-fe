import { VC_CATEGORY_WEIGHTS } from '@/constants/vc-framework';
import type { VCCategory, VCCategoryScore } from '@/types/response/pitch-deck';

export const calculateWeightedScore = (categoryScores: VCCategoryScore): number => {
  let totalWeightedScore = 0;

  Object.entries(VC_CATEGORY_WEIGHTS).forEach(([category, weight]) => {
    const score = categoryScores[category as VCCategory]?.score || 0;
    totalWeightedScore += score * weight;
  });

  return Math.round(totalWeightedScore);
};

export const normalizeScore = (value: number, _min = 0, _max = 100): number => {
  return Math.max(0, Math.min(100, value));
};

export const calculatePercentage = (score: number): number => {
  return normalizeScore(score);
};
