'use client';

import {
  generateRecommendationAndWait,
  getRecommendationByDeck,
  VERDICT_COLORS
} from '@/services/api';
import type { RecommendationResponse } from '@/types/response/pitch-deck';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  TrendingUp,
  Users
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type RecommendationSectionProps = {
  deckUuid: string;
  className?: string;
};

export const RecommendationSection = ({ deckUuid, className }: RecommendationSectionProps) => {
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [strengthsExpanded, setStrengthsExpanded] = useState(false);
  const [concernsExpanded, setConcernsExpanded] = useState(false);

  const loadExistingRecommendation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const existing = await getRecommendationByDeck(deckUuid);
      setRecommendation(existing);
    } catch {
      // Ignore error if no recommendation exists
      setRecommendation(null);
    } finally {
      setIsLoading(false);
    }
  }, [deckUuid]);

  // Load existing recommendation on mount
  useEffect(() => {
    loadExistingRecommendation();
  }, [loadExistingRecommendation]);

  const handleGenerate = useCallback(async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgressStatus('Starting...');

      const result = await generateRecommendationAndWait(deckUuid, {
        onProgress: (status) => {
          setProgressStatus(status.charAt(0).toUpperCase() + status.slice(1));
        }
      });

      setRecommendation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recommendation');
    } finally {
      setIsGenerating(false);
      setProgressStatus('');
    }
  }, [deckUuid]);

  // Generating state
  if (isGenerating) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>AI Investment Recommendation</CardTitle>
          <CardDescription>Web-powered market and competitive analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="text-center">
              <p className="font-medium">Generating Recommendation</p>
              <p className="text-sm text-muted-foreground mt-1">{progressStatus}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn('border-destructive/50', className)}>
        <CardHeader>
          <CardTitle className="text-destructive">Recommendation Failed</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleGenerate}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Completed state
  if (recommendation?.status === 'completed' && recommendation.overallRecommendation) {
    const { overallRecommendation, marketResearch, competitorAnalysis, teamVerification, content } =
      recommendation;
    const verdictColors = VERDICT_COLORS[overallRecommendation.verdict] || VERDICT_COLORS.hold;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('space-y-6', className)}
      >
        {/* Overall Verdict Card */}
        <Card className={cn(verdictColors.border, 'border-2')}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    className={cn(
                      verdictColors.bg,
                      verdictColors.text,
                      'border-0 text-base px-4 py-1'
                    )}
                  >
                    {overallRecommendation.verdict
                      .split('_')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {overallRecommendation.confidence}% confidence
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="gap-1.5 h-8"
                  >
                    <RefreshCw className={cn('h-3.5 w-3.5', isGenerating && 'animate-spin')} />
                    Regenerate
                  </Button>
                </div>
                <h3 className="text-xl font-semibold">Investment Recommendation</h3>
                <p className="text-muted-foreground">{overallRecommendation.reasoning}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>

            <div className="h-px bg-border my-4" />

            <div className="grid md:grid-cols-2 gap-6">
              {/* Key Strengths - Expandable */}
              <Card className="border-green-200 dark:border-green-900">
                <button
                  type="button"
                  onClick={() => setStrengthsExpanded(!strengthsExpanded)}
                  className="w-full text-left"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Key Strengths
                      </h4>
                      {strengthsExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    {!strengthsExpanded && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {overallRecommendation.keyStrengths.length} strengths • Click to expand
                      </p>
                    )}
                  </CardContent>
                </button>
                {strengthsExpanded && (
                  <CardContent className="pt-0 px-4 pb-4">
                    <Separator className="mb-3" />
                    <ul className="space-y-2">
                      {overallRecommendation.keyStrengths.map((strength, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-sm text-muted-foreground p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900"
                        >
                          • {strength}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>

              {/* Key Concerns - Expandable */}
              <Card className="border-red-200 dark:border-red-900">
                <button
                  type="button"
                  onClick={() => setConcernsExpanded(!concernsExpanded)}
                  className="w-full text-left"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-red-700 dark:text-red-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Key Concerns
                      </h4>
                      {concernsExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    {!concernsExpanded && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {overallRecommendation.keyConcerns.length} concerns • Click to expand
                      </p>
                    )}
                  </CardContent>
                </button>
                {concernsExpanded && (
                  <CardContent className="pt-0 px-4 pb-4">
                    <Separator className="mb-3" />
                    <ul className="space-y-2">
                      {overallRecommendation.keyConcerns.map((concern, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-sm text-muted-foreground p-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900"
                        >
                          • {concern}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            </div>

            {overallRecommendation.nextSteps.length > 0 && (
              <>
                <div className="h-px bg-border my-4" />
                <div>
                  <h4 className="font-semibold mb-2">Recommended Next Steps</h4>
                  <ol className="space-y-1">
                    {overallRecommendation.nextSteps.map((step, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {i + 1}. {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Market Research */}
        {marketResearch && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Market Research
              </CardTitle>
              <CardDescription>Web-sourced market validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{marketResearch.summary}</p>

              {(marketResearch.tam || marketResearch.sam || marketResearch.som) && (
                <div className="grid grid-cols-3 gap-4">
                  {marketResearch.tam && (
                    <div>
                      <p className="text-xs text-muted-foreground">TAM</p>
                      <p className="font-semibold">{marketResearch.tam}</p>
                    </div>
                  )}
                  {marketResearch.sam && (
                    <div>
                      <p className="text-xs text-muted-foreground">SAM</p>
                      <p className="font-semibold">{marketResearch.sam}</p>
                    </div>
                  )}
                  {marketResearch.som && (
                    <div>
                      <p className="text-xs text-muted-foreground">SOM</p>
                      <p className="font-semibold">{marketResearch.som}</p>
                    </div>
                  )}
                </div>
              )}

              {marketResearch.growthRate && (
                <div>
                  <p className="text-xs text-muted-foreground">Growth Rate</p>
                  <p className="font-semibold">{marketResearch.growthRate}</p>
                </div>
              )}

              {marketResearch.trends.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Market Trends</p>
                  <ul className="space-y-1">
                    {marketResearch.trends.map((trend, i) => (
                      <li key={i} className="text-sm">
                        • {trend}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {marketResearch.sources.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Sources</p>
                  <div className="space-y-1">
                    {marketResearch.sources.slice(0, 3).map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Competitor Analysis */}
        {competitorAnalysis && competitorAnalysis.competitors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Competitor Analysis
              </CardTitle>
              <CardDescription>Web-sourced competitive intelligence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{competitorAnalysis.summary}</p>

              <div className="grid md:grid-cols-2 gap-4">
                {competitorAnalysis.competitors.map((competitor, i) => (
                  <Card key={i} className="p-4">
                    <h4 className="font-semibold mb-1">{competitor.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{competitor.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs">
                        <span className="font-medium text-green-700 dark:text-green-300">
                          Strengths:
                        </span>{' '}
                        {competitor.strengths.join(', ')}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium text-red-700 dark:text-red-300">
                          Weaknesses:
                        </span>{' '}
                        {competitor.weaknesses.join(', ')}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {competitorAnalysis.sources.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Sources</p>
                  <div className="space-y-1">
                    {competitorAnalysis.sources.slice(0, 3).map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Team Verification */}
        {teamVerification && teamVerification.teamMembers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Verification
              </CardTitle>
              <CardDescription>Background verification via web search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{teamVerification.summary}</p>

              <div className="space-y-3">
                {teamVerification.teamMembers.map((member, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        member.verified
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-gray-100 dark:bg-gray-800'
                      )}
                    >
                      {member.verified ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      {member.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{member.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {teamVerification.sources.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Sources</p>
                  <div className="space-y-1">
                    {teamVerification.sources.slice(0, 3).map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Full Report Content */}
        {content && (
          <Card>
            <CardHeader>
              <CardTitle>Full Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap text-sm">{content}</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    );
  }

  // Empty state - no recommendation yet
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI Investment Recommendation</CardTitle>
        <CardDescription>
          Get comprehensive investment analysis powered by web search
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Generate an investment recommendation with:
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• Market size & trend analysis</li>
              <li>• Competitor research</li>
              <li>• Team background verification</li>
              <li>• Overall investment verdict</li>
            </ul>
          </div>
          <Button onClick={handleGenerate} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Generate Recommendation
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Generate button component for use in analytics display
export const GenerateRecommendationButton = ({
  _deckUuid
}: {
  _deckUuid: string;
  onClick?: () => void;
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        // This would trigger opening the recommendation section
        // For now, it scrolls to the section
        const section = document.getElementById('recommendation-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      className="gap-2"
    >
      <TrendingUp className="w-4 h-4" />
      View Recommendation
    </Button>
  );
};
