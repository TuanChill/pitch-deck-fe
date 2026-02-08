/**
 * Summary Tab
 * Summary tab content with startup snapshot
 */

import { usePipelineStore } from '@/stores/pipeline.store';
import { MOCK_SUMMARY_DATA } from '@/types/mock-data/summary.types';

import { SummaryTable } from './summary-table';

export function SummaryTab() {
  const { summaryData, overallStatus, isPolling } = usePipelineStore();

  // Show loading state while polling or if status is not completed
  if (isPolling || overallStatus !== 'completed') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Generating AI summary...</p>
        </div>
      </div>
    );
  }

  // Use summary data from API if available, otherwise fallback to mock (for development)
  const data = summaryData || MOCK_SUMMARY_DATA;

  return <SummaryTable data={data} />;
}
