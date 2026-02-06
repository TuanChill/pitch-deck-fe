/**
 * PESTLE Tab
 * PESTLE analysis tab with store integration and comprehensive data display
 */

import { usePestleStore } from '@/stores';
import type { PESTLEData as MockPestleData } from '@/types/mock-data/swot-pestle.types';
import { MOCK_PESTLE_DATA } from '@/types/mock-data/swot-pestle.types';
import type { PestleData as ApiPestleData } from '@/types/response/pestle-response.types';
import { useEffect } from 'react';

import { PESTLEList } from './pestle-list';

interface PestleTabProps {
  deckId?: string;
}

/**
 * Convert API severity to display severity
 */
function mapSeverity(severity?: string): 'high' | 'medium' | 'low' | undefined {
  if (!severity) return undefined;
  if (severity === 'high') return 'high';
  if (severity === 'medium') return 'medium';

  return 'low';
}

/**
 * Convert API PestleData to display PESTLEData
 */
function convertApiToDisplay(apiData: ApiPestleData): MockPestleData {
  return {
    political: apiData.political.map((item) => ({
      id: item.id,
      factor: item.title,
      impact: mapSeverity(item.severity) || 'Low',
      implications: item.implications
    })),
    economic: apiData.economic.map((item) => ({
      id: item.id,
      factor: item.title,
      impact: mapSeverity(item.severity) || 'Low',
      implications: item.implications
    })),
    social: apiData.social.map((item) => ({
      id: item.id,
      factor: item.title,
      impact: mapSeverity(item.severity) || 'Low',
      implications: item.implications
    })),
    technological: apiData.technological.map((item) => ({
      id: item.id,
      factor: item.title,
      impact: mapSeverity(item.severity) || 'Low',
      implications: item.implications
    })),
    legal: apiData.legal.map((item) => ({
      id: item.id,
      factor: item.title,
      impact: mapSeverity(item.severity) || 'Low',
      implications: item.implications
    })),
    environmental: apiData.environmental.map((item) => ({
      id: item.id,
      factor: item.title,
      impact: mapSeverity(item.severity) || 'Low',
      implications: item.implications
    }))
  };
}

export function PestleTab({ deckId }: PestleTabProps) {
  const { pestleData, statuses, loading, errors, generatePestle, fetchPestle } = usePestleStore();

  // Use mock data if no deckId provided (development mode)
  const id = deckId || 'mock';
  const apiPestle = deckId ? pestleData[id] : null;
  const status = deckId ? statuses[id] : 'completed';
  const isLoading = deckId ? loading[id] : false;
  const error = deckId ? errors[id] : null;

  // Convert API data to display format
  const displayPestle: MockPestleData | null = apiPestle
    ? convertApiToDisplay(apiPestle)
    : deckId
      ? null
      : MOCK_PESTLE_DATA;

  // Always fetch on mount (like analytics tab)
  useEffect(() => {
    if (deckId) {
      fetchPestle(deckId).catch(() => {
        // If fetch fails (404), trigger generation
        generatePestle(deckId);
      });
    }

    // Cleanup
    return () => {
      // Optional: clear polling/cleanup when unmounting
    };
  }, [deckId, fetchPestle, generatePestle]);

  // Loading state - render loading message
  if (isLoading || status === 'processing') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Generating PESTLE analysis...</p>
        </div>
      </div>
    );
  }

  // Error state - render error message with retry button
  if (error || status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">{error || 'Failed to generate PESTLE analysis'}</p>
        {deckId && (
          <button
            onClick={() => generatePestle(deckId)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  // No data yet (and not loading/error)
  if (!displayPestle) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No PESTLE data available</p>
      </div>
    );
  }

  // Display PESTLE data
  return <PESTLEList data={displayPestle} />;
}
