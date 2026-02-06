/**
 * SWOT API Service
 *
 * Fetches AI-generated pitch deck SWOT analysis.
 * Backend: http://localhost:8082 (via API Gateway)
 * Auth: JWT handled by httpClient interceptor
 */

import { API_URL } from '@/constants/api-url';
import { httpClient } from '@/services/http/client';
import type { SwotApiResponse, SwotGenerateResponse } from '@/types/response/swot-response.types';

/**
 * Backend response wrapper
 */
type BackendSwotResponse = {
  success: boolean;
  data: SwotApiResponse;
  statusCode: number;
};

type BackendSwotGenerateResponse = {
  success: boolean;
  data: SwotGenerateResponse;
  statusCode: number;
};

/**
 * Generate SWOT analysis for a pitch deck
 * POST /pitchdeck/:id/swot/generate
 *
 * @param id - Unique identifier of the pitch deck
 * @returns Job ID and status for tracking generation progress
 */
export const generateSwot = async (id: string): Promise<SwotGenerateResponse> => {
  const response = await httpClient.post<SwotGenerateResponse>(API_URL.SWOT.GENERATE(id), { id });

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as BackendSwotGenerateResponse;

  return backendResponse.data;
};

/**
 * Get SWOT analysis by deck ID
 * GET /pitchdeck/:id/swot
 *
 * @param id - Unique identifier of the pitch deck
 * @returns SWOT analysis data with all four quadrants
 */
export const getSwotByDeck = async (id: string): Promise<SwotApiResponse> => {
  const response = await httpClient.get<SwotApiResponse>(API_URL.SWOT.BY_DECK(id));

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as BackendSwotResponse;

  return backendResponse.data;
};

/**
 * Poll SWOT generation status by job ID
 * GET /swot/status/:jobId
 *
 * @param jobId - Job identifier from generateSwot response
 * @returns SWOT analysis with current status
 */
export const pollSwotStatus = async (jobId: string): Promise<SwotApiResponse> => {
  const response = await httpClient.get<SwotApiResponse>(API_URL.SWOT.STATUS(jobId));

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as BackendSwotResponse;

  return backendResponse.data;
};

// Export service object for consistency with other services
export const swotService = {
  generateSwot,
  getSwotByDeck,
  pollSwotStatus
};
