/**
 * Startup Snapshot
 * Grid layout for summary tab startup snapshot
 */

import type { SummaryData } from '@/types/response/summary';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { SnapshotFieldPair } from './snapshot-field';

interface StartupSnapshotProps {
  data: SummaryData;
}

export function StartupSnapshot({ data }: StartupSnapshotProps) {
  // Format decision for display (convert underscore to space, capitalize)
  const decisionLabel = (data.decision || 'N/A')
    .replace('_', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

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
            <Badge>{decisionLabel}</Badge>
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
          rightValue={decisionLabel}
          rightVariant={data.decision === 'pass' ? 'danger' : 'success'}
        />
      </div>
    </div>
  );
}
