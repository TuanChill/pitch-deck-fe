/**
 * Recommendation Tab
 * Investment recommendation display with comprehensive data
 */

import { useRecommendation } from '@/hooks';
import { MOCK_RECOMMENDATION_DATA } from '@/types/mock-data/recommendation.types';
import type {
  RecommendationData as ApiRecommendationData,
  RecommendationVerdict
} from '@/types/response/recommendation-response.types';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const VERDICT_STYLES: Record<RecommendationVerdict, { label: string; className: string }> = {
  strong_buy: {
    label: 'Strong Buy',
    className: 'bg-emerald-500 hover:bg-emerald-600'
  },
  buy: { label: 'Buy', className: 'bg-green-500 hover:bg-green-600' },
  hold: { label: 'Hold', className: 'bg-amber-500 hover:bg-amber-600' },
  pass: { label: 'Pass', className: 'bg-red-500 hover:bg-red-600' }
};

interface RecommendationTabProps {
  deckId?: string;
}

/**
 * Render the recommendation data
 */
function RecommendationContent({ data }: { data: ApiRecommendationData }) {
  const verdictStyle = VERDICT_STYLES[data.verdict];

  return (
    <div className="space-y-6">
      {/* Verdict Card */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Recommendation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Verdict</div>
              <div className="text-2xl font-bold mt-1">{verdictStyle.label}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Confidence</div>
              <div className="text-2xl font-bold mt-1">{data.confidence}%</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{data.overallSummary}</p>
        </CardContent>
      </Card>

      {/* Key Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.keyStrengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Key Risks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.keyRisks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Separator />

      {/* Market Research */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Research</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">TAM</div>
              <div className="text-sm font-medium">{data.marketResearch.tam}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">SAM</div>
              <div className="text-sm font-medium">{data.marketResearch.sam}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">SOM</div>
              <div className="text-sm font-medium">{data.marketResearch.som}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">CAGR</div>
              <div className="text-sm font-medium">{data.marketResearch.cagr}</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{data.marketResearch.analysis}</p>
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Competitive Positioning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{data.competitorAnalysis.positioning}</p>
          <div className="space-y-2">
            {data.competitorAnalysis.topCompetitors.map((competitor) => (
              <div key={competitor.name} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{competitor.name}</span>
                  <Badge variant="outline">{competitor.marketShare}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Strengths: </span>
                    <span>{competitor.strengths.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weaknesses: </span>
                    <span>{competitor.weaknesses.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{data.teamVerification.overallAssessment}</p>
          <div className="space-y-2">
            {data.teamVerification.founders.map((founder) => (
              <div key={founder.name} className="border rounded-lg p-3">
                <div className="font-medium text-sm mb-1">{founder.name}</div>
                <div className="text-xs text-muted-foreground mb-1">{founder.role}</div>
                <div className="text-xs">{founder.background}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Considerations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Investment Considerations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.investmentConsiderations.map((consideration, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{consideration}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export function RecommendationTab({ deckId }: RecommendationTabProps) {
  const { data, status, error, isPolling, refetch } = useRecommendation(deckId || null);

  // Use mock data if no deckId provided (development mode)
  const displayRecommendation: ApiRecommendationData | null = deckId
    ? data || null
    : (MOCK_RECOMMENDATION_DATA as unknown as ApiRecommendationData);

  // Loading state - render loading message
  if (status === 'loading' || isPolling) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Generating recommendation...</p>
        </div>
      </div>
    );
  }

  // Error state - render error message with retry button
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">{error || 'Failed to load recommendation'}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  // No data yet (and not loading/error)
  if (!displayRecommendation) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No recommendation data available</p>
      </div>
    );
  }

  // Display recommendation data
  return <RecommendationContent data={displayRecommendation} />;
}
