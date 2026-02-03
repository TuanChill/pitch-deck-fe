'use client';

import type { VCCategoryScore } from '@/types/response/pitch-deck';

import { CategoryGrid } from './category-grid';

type CategoryScoresProps = {
  scores: VCCategoryScore;
  className?: string;
};

/**
 * @deprecated Use CategoryGrid for full 7-category display
 * This component maintained for backward compatibility
 */
export const CategoryScoresDisplay = ({ scores, className }: CategoryScoresProps) => {
  return <CategoryGrid categoryScores={scores} className={className} />;
};
