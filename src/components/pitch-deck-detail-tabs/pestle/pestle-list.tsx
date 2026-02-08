/**
 * PESTLE List
 * List view for PESTLE analysis
 */

import type { PESTLEData } from '@/types/mock-data/swot-pestle.types';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PESTLEListProps {
  data: PESTLEData;
}

interface PESTLESectionProps {
  title: string;
  items: PESTLEData[keyof PESTLEData];
  color: string;
  id: string;
}

function PESTLESection({ title, items, color, id }: PESTLESectionProps) {
  return (
    <Card id={id} className="scroll-mt-4">
      <CardHeader>
        <CardTitle className={`text-lg ${color}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border-l-2 border-muted pl-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm">{item.factor}</h4>
              <Badge
                variant="outline"
                className={
                  item.impact === 'High'
                    ? 'border-red-500 text-red-700'
                    : item.impact === 'Positive'
                      ? 'border-emerald-500 text-emerald-700'
                      : 'border-slate-500 text-slate-700'
                }
              >
                {item.impact}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{item.implications}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PESTLEList({ data }: PESTLEListProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <PESTLESection
        title="Political"
        items={data.political}
        color="text-blue-700 dark:text-blue-400"
        id="pestle-political"
      />
      <PESTLESection
        title="Economic"
        items={data.economic}
        color="text-emerald-700 dark:text-emerald-400"
        id="pestle-economic"
      />
      <PESTLESection
        title="Social"
        items={data.social}
        color="text-purple-700 dark:text-purple-400"
        id="pestle-social"
      />
      <PESTLESection
        title="Technological"
        items={data.technological}
        color="text-cyan-700 dark:text-cyan-400"
        id="pestle-technological"
      />
      <PESTLESection
        title="Legal"
        items={data.legal}
        color="text-red-700 dark:text-red-400"
        id="pestle-legal"
      />
      <PESTLESection
        title="Environmental"
        items={data.environmental}
        color="text-lime-700 dark:text-lime-400"
        id="pestle-environmental"
      />
    </div>
  );
}
