'use client';

import type { AnalysisResponse } from '@/types/response/pitch-deck';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

import { SlideUp, StaggerChildren } from '@/components/ui/animated';

import { CategoryGrid } from './category-grid';
import { CompetitiveAnalysisView } from './competitive-analysis';
import { GaugeChart } from './gauge-chart';
import { ImprovementList } from './improvement-list';
import { StrengthList } from './strength-list';

type AnalysisResultProps = {
  analysis: AnalysisResponse;
  className?: string;
};

export const AnalysisResult = ({ analysis, className }: AnalysisResultProps) => {
  // Extract results from AnalysisResponse (Phase 03 structure)
  const results = analysis.results;
  if (!results) {
    return null;
  }

  const timeAgo = formatDistanceToNow(new Date(results.analyzedAt), {
    addSuffix: true
  });

  return (
    <div className={className}>
      <StaggerChildren className="space-y-8">
        {/* Header */}
        <SlideUp>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{`Deck ${analysis.deckId}`}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Analyzed {timeAgo}
              </p>
            </div>
          </div>
        </SlideUp>

        {/* Overall Score Gauge */}
        <SlideUp delay={0.1}>
          <div className="flex justify-center">
            <GaugeChart score={results.overallScore} size={240} />
          </div>
        </SlideUp>

        {/* Category Scores */}
        <SlideUp delay={0.2}>
          <div>
            <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
            <CategoryGrid categoryScores={results.categoryScores} />
          </div>
        </SlideUp>

        {/* Strengths & Improvements */}
        <SlideUp delay={0.3}>
          <div className="grid md:grid-cols-2 gap-6">
            <StrengthList strengths={results.strengths} />
            <ImprovementList improvements={results.improvements} />
          </div>
        </SlideUp>

        {/* Competitive Analysis */}
        {results.competitiveAnalysis && (
          <SlideUp delay={0.4}>
            <CompetitiveAnalysisView analysis={results.competitiveAnalysis} />
          </SlideUp>
        )}
      </StaggerChildren>
    </div>
  );
};
