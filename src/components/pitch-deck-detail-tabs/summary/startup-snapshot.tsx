/**
 * Startup Snapshot
 * Grid layout for summary tab startup snapshot
 */

import type { SummaryData } from '@/types/mock-data/summary.types';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { SnapshotFieldPair } from './snapshot-field';

const DECISION_STYLES: Record<SummaryData['decision'], { label: string; className: string }> = {
  invest: { label: 'Invest', className: 'bg-emerald-500 hover:bg-emerald-600' },
  deep_dive: { label: 'Deep Dive', className: 'bg-blue-500 hover:bg-blue-600' },
  watchlist: { label: 'Watchlist', className: 'bg-amber-500 hover:bg-amber-600' },
  pass: { label: 'Pass', className: 'bg-red-500 hover:bg-red-600' }
};

interface StartupSnapshotProps {
  data: SummaryData;
}

export function StartupSnapshot({ data }: StartupSnapshotProps) {
  const decisionStyle = DECISION_STYLES[data.decision];

  return (
    <div className="space-y-6">
      {/* Header with One-liner */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Startup Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">One-Liner</div>
            <p className="text-sm font-medium">{data.oneLiner}</p>
          </div>

          {/* Score and Decision */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Overall Score</div>
              <div className="text-2xl font-bold">{data.overallScore}/100</div>
            </div>
            <Badge className={decisionStyle.className}>{decisionStyle.label}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Paired Fields */}
      <div className="space-y-4">
        <SnapshotFieldPair
          leftLabel="Problem"
          leftValue={data.problem}
          rightLabel="Solution"
          rightValue={data.solution}
        />

        <SnapshotFieldPair
          leftLabel="Market"
          leftValue={data.market}
          rightLabel="Product"
          rightValue={data.product}
        />

        <SnapshotFieldPair
          leftLabel="Traction"
          leftValue={data.traction}
          rightLabel="Business Model"
          rightValue={data.businessModel}
          leftVariant="success"
        />

        <SnapshotFieldPair
          leftLabel="Moat"
          leftValue={data.moat}
          rightLabel="Team"
          rightValue={data.team}
          rightVariant="success"
        />

        <SnapshotFieldPair
          leftLabel="Fundraising"
          leftValue={data.fundraising}
          rightLabel="Decision"
          rightValue={decisionStyle.label}
          rightVariant={data.decision === 'pass' ? 'danger' : 'success'}
        />
      </div>
    </div>
  );
}
