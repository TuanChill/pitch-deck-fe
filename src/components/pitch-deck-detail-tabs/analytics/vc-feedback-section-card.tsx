/**
 * VC Feedback Section Card
 * Displays individual VC feedback section with score, strengths, concerns, recommendations
 */

import { VC_FEEDBACK_SECTIONS } from '@/constants/vc-evaluation';
import type { VcSectionFeedback } from '@/types/domain/vc-feedback';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { VcScoreDisplay } from './vc-score-display';

interface VcFeedbackSectionCardProps {
  section: VcSectionFeedback;
}

/**
 * Format reference badge text
 */
const formatReference = (reference: { page?: number; area?: string }): string => {
  const parts: string[] = [];
  if (reference.page !== undefined) parts.push(`P${reference.page}`);
  if (reference.area) parts.push(reference.area);

  return parts.join(' • ');
};

export function VcFeedbackSectionCard({ section }: VcFeedbackSectionCardProps) {
  const meta = VC_FEEDBACK_SECTIONS[section.section];

  // Safety check: if metadata not found, log and skip rendering
  if (!meta) {
    console.warn(`[VcFeedbackSectionCard] No metadata found for section: "${section.section}"`, section);
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{meta.label}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{meta.description}</p>
          </div>
          <VcScoreDisplay score={section.score} size="md" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Strengths */}
        {section.strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-emerald-700 mb-2">Strengths</h4>
            <ul className="space-y-2">
              {section.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                  <span className="flex-1">{item.text}</span>
                  {item.reference && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      {formatReference(item.reference)}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concerns */}
        {section.concerns.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-amber-700 mb-2">Concerns</h4>
              <ul className="space-y-2">
                {section.concerns.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                    <span className="flex-1">{item.text}</span>
                    {item.reference && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        {formatReference(item.reference)}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Recommendations */}
        {section.recommendations.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-blue-700 mb-2">Recommendations</h4>
              <ul className="space-y-2">
                {section.recommendations.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-0.5 shrink-0">→</span>
                    <span className="flex-1">{item.text}</span>
                    {item.reference && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        {formatReference(item.reference)}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
