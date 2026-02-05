/**
 * SWOT Grid
 * 2x2 grid layout for SWOT analysis
 */

import type { SWOTData, SWOTItem } from '@/types/mock-data/swot-pestle.types';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SWOTGridProps {
  data: SWOTData;
}

function SWOTItemCard({
  item,
  variant
}: {
  item: SWOTItem;
  variant: 'positive' | 'negative' | 'neutral';
}) {
  const variantStyles = {
    positive: 'border-emerald-200 dark:border-emerald-800',
    negative: 'border-red-200 dark:border-red-800',
    neutral: 'border-slate-200 dark:border-slate-800'
  };

  return (
    <Card className={variantStyles[variant]}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm flex-1">{item.title}</h4>
          {item.severity && (
            <Badge
              variant="outline"
              className={
                item.severity === 'high'
                  ? 'border-red-500 text-red-700'
                  : item.severity === 'medium'
                    ? 'border-amber-500 text-amber-700'
                    : 'border-slate-500 text-slate-700'
              }
            >
              {item.severity}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  );
}

export function SWOTGrid({ data }: SWOTGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.strengths.map((item) => (
            <SWOTItemCard key={item.id} item={item} variant="positive" />
          ))}
        </CardContent>
      </Card>

      {/* Weaknesses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-red-700 dark:text-red-400">Weaknesses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.weaknesses.map((item) => (
            <SWOTItemCard key={item.id} item={item} variant="negative" />
          ))}
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700 dark:text-blue-400">Opportunities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.opportunities.map((item) => (
            <SWOTItemCard key={item.id} item={item} variant="positive" />
          ))}
        </CardContent>
      </Card>

      {/* Threats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-amber-700 dark:text-amber-400">Threats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.threats.map((item) => (
            <SWOTItemCard key={item.id} item={item} variant="negative" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
