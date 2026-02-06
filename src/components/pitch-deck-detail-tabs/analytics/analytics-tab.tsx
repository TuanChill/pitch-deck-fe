/**
 * Analytics Tab
 * VC Feedback tab with comprehensive pitch deck evaluation
 */

import { calculateOverallScore } from '@/constants/vc-evaluation';
import { useAnalytics } from '@/hooks/use-analytics';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { AnalyticsError } from './analytics-error';
import { AnalyticsScoringGuideSidebar } from './analytics-scoring-guide-sidebar';
import { AnalyticsSkeleton } from './analytics-skeleton';
import { VcDecisionBadge } from './vc-decision-badge';
import { VcFeedbackSectionCard } from './vc-feedback-section-card';
import { VcScoreDisplay } from './vc-score-display';

interface AnalyticsTabProps {
  deckId: string;
}

export function AnalyticsTab({ deckId }: AnalyticsTabProps) {
  const { data, status, error, isPolling, refetch } = useAnalytics(deckId);

  // Early return if no deckId (defensive check)
  if (!deckId) {
    return <div className="text-center py-12 text-muted-foreground">Invalid pitch deck ID</div>;
  }

  // Loading state
  if (status === 'loading' || isPolling) {
    return <AnalyticsSkeleton />;
  }

  // Error state
  if (status === 'error') {
    return <AnalyticsError error={error} onRetry={refetch} isPolling={isPolling} />;
  }

  // No data
  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">No analytics data available</div>
    );
  }

  const overallScore = calculateOverallScore(data.sections);

  // DEBUG: Log data when rendering
  console.log('[AnalyticsTab] Rendering with data:', {
    sectionsCount: data.sections?.length,
    overall: data.overall,
    overallScore
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Overall Decision Card */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Investment Decision</div>
                <div className="flex items-center gap-3 mt-2">
                  <VcDecisionBadge decision={data.overall.decision} size="lg" />
                  <VcScoreDisplay score={overallScore} size="lg" showLabel={false} />
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{data.overall.summary}</p>
          </CardContent>
        </Card>

        {/* Key Strengths */}
        {data.overall.keyStrengths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.overall.keyStrengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Key Risks */}
        {data.overall.keyRisks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.overall.keyRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500 mt-0.5">⚠</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Section-by-Section Feedback */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Detailed Section Feedback</h3>
          {data.sections.map((section) => (
            <VcFeedbackSectionCard key={section.section} section={section} />
          ))}
        </div>

        {/* Next Steps */}
        {data.overall.nextSteps && data.overall.nextSteps.length > 0 && (
          <>
            <Separator />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.overall.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-500 mt-0.5">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Right Sidebar - Scoring Guide */}
      <aside className="lg:sticky lg:top-4 h-fit self-start">
        <AnalyticsScoringGuideSidebar />
      </aside>
    </div>
  );
}
