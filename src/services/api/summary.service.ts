/**
 * Summary API Service
 *
 * Fetches AI-generated pitch deck summaries.
 * Backend: http://localhost:8082
 * Auth: JWT handled by httpClient interceptor
 */

import { API_URL } from '@/constants/api-url';
import { httpClient } from '@/services/http/client';
import type { SummaryData, SummaryResponse } from '@/types/response/summary';

/**
 * Backend response wrapper with nested data
 */
type BackendSummaryResponse = {
  success: boolean;
  data: {
    uuid: string;
    deckUuid: string;
    status: string;
    data: SummaryData;
    errorMessage: string;
    createdAt: { low: number; high: number; unsigned: boolean };
    completedAt: { low: number; high: number; unsigned: boolean };
  };
  statusCode: number;
};

/**
 * Get pitch deck summary by deck UUID
 * GET /pitchdeck/:uuid/summary
 *
 * @param uuid - Unique identifier of the pitch deck
 * @returns Summary data with AI-generated insights
 */
export const getPitchDeckSummary = async (uuid: string): Promise<SummaryData> => {
  const response = await httpClient.get<SummaryResponse>(API_URL.PITCH_DECK.SUMMARY(uuid));

  // Backend wraps response with nested data: { success, data: { data: {...} }, statusCode }
  const backendResponse = response.data as unknown as BackendSummaryResponse;

  return backendResponse.data.data;
};
