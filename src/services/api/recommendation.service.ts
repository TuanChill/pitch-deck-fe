/**
 * Recommendation API Service
 *
 * Fetches AI-generated investment recommendation for pitch decks.
 * Backend: http://localhost:8080 (via API Gateway)
 * Auth: JWT handled by httpClient interceptor
 */

import { httpClient } from '@/services/http/client';
import type {
  RecommendationApiResponse,
  RecommendationGenerateResponse
} from '@/types/response/recommendation-response.types';

/**
 * Backend response wrapper
 */
type BackendRecommendationResponse = {
  success: boolean;
  data: RecommendationApiResponse;
  statusCode: number;
};

type BackendRecommendationGenerateResponse = {
  success: boolean;
  data: RecommendationGenerateResponse;
  statusCode: number;
};

/**
 * Generate investment recommendation for a pitch deck
 * POST /pitchdeck/:id/recommendation
 *
 * @param id - Unique identifier of the pitch deck
 * @returns Job ID and status for tracking generation progress
 */
export const generateRecommendation = async (
  id: string
): Promise<RecommendationGenerateResponse> => {
  const response = await httpClient.post<RecommendationGenerateResponse>(
    `/pitchdeck/${id}/recommendation`
  );

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as BackendRecommendationGenerateResponse;

  return backendResponse.data;
};

/**
 * Get recommendation by deck ID
 * GET /pitchdeck/:id/recommendation
 *
 * @param id - Unique identifier of the pitch deck
 * @returns Recommendation data with verdict, confidence, and analysis
 */
export const getRecommendationByDeck = async (id: string): Promise<RecommendationApiResponse> => {
  const response = await httpClient.get<RecommendationApiResponse>(
    `/pitchdeck/${id}/recommendation`
  );

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as BackendRecommendationResponse;

  return backendResponse.data;
};

/**
 * Poll recommendation generation status by job ID
 * GET /recommendation/status/:jobId
 *
 * @param jobId - Job identifier from generateRecommendation response
 * @returns Recommendation analysis with current status
 */
export const pollRecommendationStatus = async (
  jobId: string
): Promise<RecommendationApiResponse> => {
  const response = await httpClient.get<RecommendationApiResponse>(
    `/recommendation/status/${jobId}`
  );

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as BackendRecommendationResponse;

  return backendResponse.data;
};

// Export service object for consistency with other services
export const recommendationService = {
  generateRecommendation,
  getRecommendationByDeck,
  pollRecommendationStatus
};
