/**
 * SWOT Grid
 * 2x2 grid layout for SWOT analysis with enhanced item cards
 */

import type { SWOTData } from '@/types/mock-data/swot-pestle.types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SWOTItemCard } from './swot-item-card';

interface SWOTGridProps {
  data: SWOTData;
}

export function SWOTGrid({ data }: SWOTGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
