/**
 * SWOT Tab
 * SWOT analysis tab with comprehensive data display
 */

import { useSwot } from '@/hooks';
import type { SWOTData } from '@/types/mock-data/swot-pestle.types';
import { MOCK_SWOT_DATA } from '@/types/mock-data/swot-pestle.types';
import type { SwotData as ApiSwotData } from '@/types/response/swot-response.types';

import { SWOTErrorState } from './swot-error-state';
import { SWOTGrid } from './swot-grid';
import { SWOTLoadingState } from './swot-loading-state';

interface SwotTabProps {
  deckId?: string;
}

/**
 * Convert API severity to display severity
 */
function mapSeverity(severity?: string): 'high' | 'medium' | 'low' | undefined {
  if (!severity) return undefined;
  if (severity === 'critical' || severity === 'major') return 'high';
  if (severity === 'minor') return 'medium';

  return 'low';
}

/**
 * Convert API SwotData to display SWOTData
 */
function convertApiToDisplay(apiData: ApiSwotData): SWOTData {
  return {
    strengths: apiData.strengths.map((item) => ({
      ...item,
      severity: mapSeverity(item.severity)
    })),
    weaknesses: apiData.weaknesses.map((item) => ({
      ...item,
      severity: mapSeverity(item.severity)
    })),
    opportunities: apiData.opportunities.map((item) => ({
      ...item,
      severity: mapSeverity(item.severity)
    })),
    threats: apiData.threats.map((item) => ({
      ...item,
      severity: mapSeverity(item.severity)
    }))
  };
}

export function SwotTab({ deckId }: SwotTabProps) {
  const { data, status, error, isPolling, refetch } = useSwot(deckId || null);

  // Use mock data if no deckId provided (development mode)
  const displaySwot: SWOTData | null = deckId
    ? data
      ? convertApiToDisplay(data)
      : null
    : MOCK_SWOT_DATA;

  // Loading state
  if (status === 'loading' || isPolling) {
    return <SWOTLoadingState />;
  }

  // Error state
  if (status === 'error') {
    return <SWOTErrorState message={error || 'Failed to load SWOT analysis'} onRetry={refetch} />;
  }

  // No data yet (and not loading/error)
  if (!displaySwot) {
    return <SWOTLoadingState />;
  }

  // Display SWOT data
  return <SWOTGrid data={displaySwot} />;
}
