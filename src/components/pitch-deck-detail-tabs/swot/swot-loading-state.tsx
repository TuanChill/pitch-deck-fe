/**
 * SWOT Loading State
 * Skeleton loader for SWOT analysis
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const quadrants = [
  { name: 'Strengths', color: 'text-emerald-700 dark:text-emerald-400' },
  { name: 'Weaknesses', color: 'text-red-700 dark:text-red-400' },
  { name: 'Opportunities', color: 'text-blue-700 dark:text-blue-400' },
  { name: 'Threats', color: 'text-amber-700 dark:text-amber-400' },
];

export function SWOTLoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {quadrants.map((quadrant) => (
        <Card key={quadrant.name}>
          <CardHeader>
            <Skeleton className={`h-6 w-32 ${quadrant.color}`} />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-16 shrink-0" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3 mt-1" />
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
