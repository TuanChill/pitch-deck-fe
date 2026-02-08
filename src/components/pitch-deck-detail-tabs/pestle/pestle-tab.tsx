/**
 * PESTLE Tab
 * PESTLE analysis tab with comprehensive data display
 */

import { usePestle } from '@/hooks';
import type { PESTLEData as MockPestleData } from '@/types/mock-data/swot-pestle.types';
import { MOCK_PESTLE_DATA } from '@/types/mock-data/swot-pestle.types';
import type { PestleData as ApiPestleData } from '@/types/response/pestle-response.types';

import { PestleIndexList } from './pestle-index-list';
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
  const { data, status, error, isPolling, refetch } = usePestle(deckId || null);

  // Use mock data if no deckId provided (development mode)
  const displayPestle: MockPestleData | null = deckId
    ? data
      ? convertApiToDisplay(data)
      : null
    : MOCK_PESTLE_DATA;

  // Loading state - render loading message
  if (status === 'loading' || isPolling) {
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
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">{error || 'Failed to load PESTLE analysis'}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
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
  const indexItems = [
    { id: 'pestle-political', label: 'Political' },
    { id: 'pestle-economic', label: 'Economic' },
    { id: 'pestle-social', label: 'Social' },
    { id: 'pestle-technological', label: 'Technological' },
    { id: 'pestle-legal', label: 'Legal' },
    { id: 'pestle-environmental', label: 'Environmental' }
  ];

  return (
    <>
      <PestleIndexList items={indexItems} />
      <PESTLEList data={displayPestle} />
    </>
  );
}
