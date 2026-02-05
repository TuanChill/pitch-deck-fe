/**
 * VC Score Display
 * Displays score with color coding and label
 */

import { getScoreRangeLabel, getScoreRangeColor } from '@/constants/vc-evaluation';

import { cn } from '@/lib/utils';

interface VcScoreDisplayProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SIZE_STYLES = {
  sm: { score: 'text-2xl', label: 'text-xs' },
  md: { score: 'text-3xl', label: 'text-sm' },
  lg: { score: 'text-4xl', label: 'text-base' }
} as const;

const COLOR_STYLES: Record<string, string> = {
  green: 'text-emerald-600',
  blue: 'text-blue-600',
  yellow: 'text-amber-600',
  red: 'text-red-600'
};

export function VcScoreDisplay({ score, size = 'md', showLabel = true }: VcScoreDisplayProps) {
  const sizeStyle = SIZE_STYLES[size];
  const label = getScoreRangeLabel(score);
  const colorKey = getScoreRangeColor(score);
  const colorClass = COLOR_STYLES[colorKey];

  return (
    <div className="flex flex-col">
      <span className={cn('font-bold', sizeStyle.score, colorClass)}>{score.toFixed(1)}</span>
      {showLabel && <span className={cn('text-muted-foreground', sizeStyle.label)}>{label}</span>}
    </div>
  );
}
