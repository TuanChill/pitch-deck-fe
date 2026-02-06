/**
 * SWOT Item Card
 * Enhanced card with expandable details for comprehensive SWOT analysis
 */

import type { SWOTItem } from '@/types/mock-data/swot-pestle.types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SWOTItemCardProps {
  item: SWOTItem;
  variant: 'positive' | 'negative' | 'neutral';
}

const variantStyles = {
  positive: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20',
  negative: 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20',
  neutral: 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20'
};

const severityStyles: Record<string, string> = {
  critical: 'border-red-600 text-red-700 bg-red-50 dark:bg-red-950/30',
  high: 'border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-950/30',
  major: 'border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-950/30',
  medium: 'border-amber-500 text-amber-700 bg-amber-50 dark:bg-amber-950/30',
  minor: 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950/30',
  low: 'border-slate-500 text-slate-700 bg-slate-50 dark:bg-slate-950/30',
  info: 'border-slate-400 text-slate-600 bg-slate-50 dark:bg-slate-950/30'
};

function SeverityBadge({ severity }: { severity?: string }) {
  if (!severity) return null;

  const label = severity.charAt(0).toUpperCase() + severity.slice(1);

  return (
    <Badge variant="outline" className={severityStyles[severity] || severityStyles.medium}>
      {label}
    </Badge>
  );
}

export function SWOTItemCard({ item, variant }: SWOTItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDetails =
    item.strategicImplications ||
    item.evidence ||
    (item.recommendations && item.recommendations.length > 0);

  return (
    <Card className={variantStyles[variant]}>
      <CardContent className="p-4">
        {/* Header: title + severity */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className="font-semibold text-base flex-1 leading-tight">{item.title}</h4>
          {item.severity && <SeverityBadge severity={item.severity} />}
        </div>

        {/* Description */}
        <p className="text-sm text-foreground mb-3 leading-relaxed">{item.description}</p>

        {/* Expandable details */}
        {isExpanded && hasDetails && (
          <div className="space-y-3 mt-3 pt-3 border-t border-border/50">
            {/* Strategic implications */}
            {item.strategicImplications && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Strategic Implications
                </p>
                <p className="text-xs leading-relaxed">{item.strategicImplications}</p>
              </div>
            )}

            {/* Supporting evidence */}
            {item.evidence && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Supporting Evidence
                </p>
                {item.evidence.quote && (
                  <p className="text-xs italic mb-1 text-foreground/80">
                    &ldquo;{item.evidence.quote}&rdquo;
                  </p>
                )}
                {item.evidence.metric && (
                  <p className="text-xs font-medium text-primary mb-1">{item.evidence.metric}</p>
                )}
                {item.evidence.slideNumber && (
                  <p className="text-xs text-muted-foreground">Slide {item.evidence.slideNumber}</p>
                )}
              </div>
            )}

            {/* Recommendations */}
            {item.recommendations && item.recommendations.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Recommendations
                </p>
                <ul className="text-xs space-y-1.5">
                  {item.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      <span className="flex-1">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Expand/collapse button */}
        {hasDetails && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full h-8 text-xs"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="h-3 w-3 ml-1" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
