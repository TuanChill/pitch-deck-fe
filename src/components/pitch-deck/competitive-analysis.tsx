'use client';

import { CompetitiveAnalysis } from '@/types/response/pitch-deck';
import { cn } from '@/utils';

import { DifferentiatorList } from './differentiator-list';
import { MarketOpportunity } from './market-opportunity';
import { PositioningMap } from './positioning-map';

type CompetitiveAnalysisViewProps = {
  analysis: CompetitiveAnalysis;
  className?: string;
};

export const CompetitiveAnalysisView = ({ analysis, className }: CompetitiveAnalysisViewProps) => {
  if (!analysis) return null;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Positioning Map */}
      <PositioningMap positions={analysis.positioning} />

      {/* Market Opportunity */}
      <MarketOpportunity
        size={analysis.marketOpportunity.size}
        growth={analysis.marketOpportunity.growth}
        trend={analysis.marketOpportunity.trend}
      />

      {/* Differentiators */}
      <DifferentiatorList differentiators={analysis.differentiators} />
    </div>
  );
};
