/**
 * Analytics Scoring Guide Sidebar
 * Explains VC evaluation framework: sections, weights, scores, decisions
 */

import { VC_FEEDBACK_SECTIONS, VC_DECISIONS, VC_SCORE_RANGES } from '@/constants/vc-evaluation';
import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  Package,
  TrendingUp,
  Shield,
  Users,
  Presentation,
  Star,
  Calculator
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Icon mapping for sections
const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Package,
  TrendingUp,
  Shield,
  Users,
  Presentation,
  Star
};

interface AnalyticsScoringGuideSidebarProps {
  className?: string;
}

export function AnalyticsScoringGuideSidebar({ className }: AnalyticsScoringGuideSidebarProps) {
  // Get sections with weights (exclude overall/overall_assessment with weight=0)
  const weightedSections = Object.entries(VC_FEEDBACK_SECTIONS)
    .filter(([_, meta]) => meta.weight > 0)
    .sort(([, a], [, b]) => b.weight - a.weight);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          How Scoring Works
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section Weights */}
        <section>
          <h4 className="text-sm font-semibold mb-3">Evaluation Sections</h4>
          <div className="space-y-3">
            {weightedSections.map(([key, meta]) => {
              const Icon = ICON_MAP[meta.icon] || Star;
              const weightPercent = Math.round(meta.weight * 100);

              return (
                <div key={key} className="flex items-start gap-2 text-sm">
                  <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{meta.label}</span>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {weightPercent}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Separator />

        {/* Score Ranges */}
        <section>
          <h4 className="text-sm font-semibold mb-3">Score Ranges</h4>
          <div className="space-y-2">
            {Object.entries(VC_SCORE_RANGES).map(([key, range]) => {
              const colorClass = {
                green: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
                blue: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
                yellow: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
                red: 'bg-red-500/10 text-red-700 border-red-500/20'
              }[range.color];

              return (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {range.min} - {range.max}
                  </span>
                  <Badge className={colorClass} variant="outline">
                    {range.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </section>

        <Separator />

        {/* Decision Thresholds */}
        <section>
          <h4 className="text-sm font-semibold mb-3">Investment Decisions</h4>
          <div className="space-y-2">
            {Object.entries(VC_DECISIONS).map(([key, decision]) => {
              const colorClass = {
                green: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
                blue: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
                yellow: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
                red: 'bg-red-500/10 text-red-700 border-red-500/20'
              }[decision.color];

              return (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{decision.minScore}+ points</span>
                  <Badge className={colorClass} variant="outline">
                    {decision.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </section>

        <Separator />

        {/* Calculation Formula */}
        <section>
          <h4 className="text-sm font-semibold mb-2">How We Calculate</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your overall score is a <strong>weighted average</strong> of all section scores.
            Sections with higher weights (like Team at 25%) have more impact on your final score.
          </p>
          <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono text-center">
            Σ(section_score × weight) / Σ(weights)
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
