/**
 * PESTLE API Service
 *
 * Fetches AI-generated pitch deck PESTLE analysis.
 * Backend: http://localhost:8080 (via API Gateway)
 * Auth: JWT handled by httpClient interceptor
 */

import { httpClient } from '@/services/http/client';
import type {
  PestleApiResponse,
  PestleGenerateResponse
} from '@/types/response/pestle-response.types';

/**
 * Backend response wrapper
 */
type BackendPestleResponse = {
  success: boolean;
  data: PestleApiResponse;
  statusCode: number;
};

type BackendPestleGenerateResponse = {
  success: boolean;
  data: PestleGenerateResponse;
  statusCode: number;
};

/**
 * Generate PESTLE analysis for a pitch deck
 * POST /pitchdeck/:id/pestle
 *
 * @param id - Unique identifier of the pitch deck
 * @returns Job ID and status for tracking generation progress
 */
export const generatePestle = async (id: string): Promise<PestleGenerateResponse> => {
  const response = await httpClient.post<PestleGenerateResponse>(`/pitchdeck/${id}/pestle`);

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as BackendPestleGenerateResponse;

  return backendResponse.data;
};

/**
 * Get PESTLE analysis by deck ID
 * GET /pitchdeck/:id/pestle
 *
 * @param id - Unique identifier of the pitch deck
 * @returns PESTLE analysis data with all six categories
 */
export const getPestleByDeck = async (id: string): Promise<PestleApiResponse> => {
  const response = await httpClient.get<PestleApiResponse>(`/pitchdeck/${id}/pestle`);

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as BackendPestleResponse;

  return backendResponse.data;
};

/**
 * Poll PESTLE generation status by job ID
 * GET /pestle/status/:jobId
 *
 * @param jobId - Job identifier from generatePestle response
 * @returns PESTLE analysis with current status
 */
export const pollPestleStatus = async (jobId: string): Promise<PestleApiResponse> => {
  const response = await httpClient.get<PestleApiResponse>(`/pestle/status/${jobId}`);

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as BackendPestleResponse;

  return backendResponse.data;
};

// Export service object for consistency with other services
export const pestleService = {
  generatePestle,
  getPestleByDeck,
  pollPestleStatus
};
