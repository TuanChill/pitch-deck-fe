/**
 * SWOT Tab
 * SWOT analysis tab with store integration and comprehensive data display
 */

import { useSwotStore } from '@/stores';
import type { SWOTData } from '@/types/mock-data/swot-pestle.types';
import { MOCK_SWOT_DATA } from '@/types/mock-data/swot-pestle.types';
import type { SwotData as ApiSwotData } from '@/types/response/swot-response.types';
import { useEffect } from 'react';

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
  const { swotData, statuses, loading, errors, generateSwot, fetchSwot } = useSwotStore();

  // Use mock data if no deckId provided (development mode)
  const id = deckId || 'mock';
  const apiSwot = deckId ? swotData[id] : null;
  const status = deckId ? statuses[id] : 'completed';
  const isLoading = deckId ? loading[id] : false;
  const error = deckId ? errors[id] : null;

  // Convert API data to display format
  const displaySwot: SWOTData | null = apiSwot
    ? convertApiToDisplay(apiSwot)
    : deckId
      ? null
      : MOCK_SWOT_DATA;

  // Always fetch on mount (like analytics tab)
  useEffect(() => {
    if (deckId) {
      fetchSwot(deckId).catch(() => {
        // If fetch fails (404), trigger generation
        generateSwot(deckId);
      });
    }

    // Cleanup
    return () => {
      // Optional: clear polling/cleanup when unmounting
    };
  }, [deckId, fetchSwot, generateSwot]);

  // Loading state
  if (isLoading || status === 'processing') {
    return <SWOTLoadingState />;
  }

  // Error state
  if (error || status === 'failed') {
    return (
      <SWOTErrorState
        message={error || 'Failed to generate SWOT analysis'}
        onRetry={() => deckId && generateSwot(deckId)}
      />
    );
  }

  // No data yet (and not loading/error)
  if (!displaySwot) {
    return <SWOTLoadingState />;
  }

  // Display SWOT data
  return <SWOTGrid data={displaySwot} />;
}
