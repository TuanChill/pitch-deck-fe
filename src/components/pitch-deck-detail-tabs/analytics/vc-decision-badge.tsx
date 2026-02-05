/**
 * VC Decision Badge
 * Displays investment decision with color coding
 */

import { VC_DECISIONS } from '@/constants/vc-evaluation';
import type { VcDecision } from '@/types/domain/vc-feedback';

import { Badge } from '@/components/ui/badge';

interface VcDecisionBadgeProps {
  decision: VcDecision;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_STYLES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5'
} as const;

const COLOR_STYLES: Record<VcDecision, string> = {
  invest: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  deep_dive: 'bg-blue-500 hover:bg-blue-600 text-white',
  watchlist: 'bg-amber-500 hover:bg-amber-600 text-white',
  pass: 'bg-red-500 hover:bg-red-600 text-white'
};

export function VcDecisionBadge({ decision, size = 'md' }: VcDecisionBadgeProps) {
  const meta = VC_DECISIONS[decision];

  return <Badge className={`${COLOR_STYLES[decision]} ${SIZE_STYLES[size]}`}>{meta.label}</Badge>;
}
