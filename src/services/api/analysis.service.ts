/**
 * Analysis API Service
 *
 * Implements all analysis operations using real backend API.
 * Phase 03: New analysis service layer.
 *
 * Backend: http://localhost:8082
 * Auth: JWT handled by httpClient interceptor
 *
 * Analysis is an async operation:
 * 1. startAnalysis() - triggers analysis, returns analysis UUID
 * 2. getAnalysisStatus() - poll for status (pending/processing/completed/failed)
 * 3. getAnalysisResult() - get full VC framework analysis
 * 4. listAnalyses() - get all analyses
 * 5. deleteAnalysis() - delete analysis
 */

import { API_URL } from '@/constants/api-url';
import { httpClient } from '@/services/http/client';
import type { ListAnalysesQuery, StartAnalysisRequest } from '@/types/request/pitch-deck';
import type {
  AnalysisResponse,
  AnalysisStatusResponse,
  DeleteSuccessResponse,
  ListAnalysesResponse
} from '@/types/response/pitch-deck';
import Axios from 'axios';

// ==================== Constants ====================

/** Default polling configuration */
const DEFAULT_POLL_CONFIG = {
  maxAttempts: 30, // 30 attempts = ~5 minutes with exponential backoff
  initialDelay: 1000, // Start at 1 second
  maxDelay: 30000 // Max 30 seconds between polls
} as const;

/** Analysis status values that indicate completion */
const COMPLETED_STATUSES = ['completed', 'failed'] as const;
const TERMINAL_STATUSES = [...COMPLETED_STATUSES] as const;

// ==================== Public API ====================

/**
 * Start VC analysis for a pitch deck
 * POST /analysis/start
 *
 * @param pitchDeckUuid - UUID of the pitch deck to analyze
 * @returns Analysis response with UUID and initial status
 */
export const startAnalysis = async (pitchDeckUuid: string): Promise<AnalysisResponse> => {
  const request: StartAnalysisRequest = { deckId: pitchDeckUuid };

  const response = await httpClient.post<AnalysisResponse>(API_URL.ANALYSIS.START, request);

  return response.data;
};

/**
 * Get analysis status by UUID
 * GET /analysis/:uuid/status
 *
 * @param analysisUuid - UUID of the analysis
 * @returns Status response with progress percentage
 */
export const getAnalysisStatus = async (analysisUuid: string): Promise<AnalysisStatusResponse> => {
  const response = await httpClient.get<AnalysisStatusResponse>(
    API_URL.ANALYSIS.STATUS(analysisUuid)
  );

  return response.data;
};

/**
 * Get full analysis result by UUID
 * GET /analysis/:uuid
 *
 * Returns complete VC framework analysis with scores, strengths,
 * improvements, and competitive analysis.
 *
 * @param analysisUuid - UUID of the analysis
 * @returns Full analysis response with results if completed
 */
export const getAnalysisResult = async (analysisUuid: string): Promise<AnalysisResponse> => {
  const response = await httpClient.get<AnalysisResponse>(API_URL.ANALYSIS.DETAIL(analysisUuid));

  return response.data;
};

/**
 * Get analysis by pitch deck UUID
 * GET /analysis/by-deck/:deckUuid
 *
 * Returns the most recent analysis for a specific pitch deck.
 * Returns null if no analysis exists (404).
 *
 * @param deckUuid - UUID of the pitch deck
 * @returns Analysis response or null if not found
 */
export const getAnalysisByDeck = async (deckUuid: string): Promise<AnalysisResponse | null> => {
  try {
    const response = await httpClient.get<AnalysisResponse>(API_URL.ANALYSIS.BY_DECK(deckUuid));

    return response.data;
  } catch (error) {
    // Return null if analysis not found (404)
    if (Axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * List all analyses with optional filtering
 * GET /analysis
 *
 * @param query - Query parameters for filtering and pagination
 * @returns Array of analysis responses
 */
export const listAnalyses = async (query?: ListAnalysesQuery): Promise<ListAnalysesResponse> => {
  const params = new URLSearchParams();

  if (query?.status) {
    params.append('status', query.status);
  }
  if (query?.limit !== undefined) {
    params.append('limit', query.limit.toString());
  }
  if (query?.offset !== undefined) {
    params.append('offset', query.offset.toString());
  }

  const queryString = params.toString();
  const url = queryString ? `${API_URL.ANALYSIS.LIST}?${queryString}` : API_URL.ANALYSIS.LIST;

  const response = await httpClient.get<ListAnalysesResponse>(url);

  return response.data;
};

/**
 * Delete an analysis by UUID
 * DELETE /analysis/:uuid
 *
 * @param analysisUuid - UUID of the analysis to delete
 * @returns Success confirmation
 */
export const deleteAnalysis = async (analysisUuid: string): Promise<DeleteSuccessResponse> => {
  const response = await httpClient.delete<DeleteSuccessResponse>(
    API_URL.ANALYSIS.DELETE(analysisUuid)
  );

  return response.data;
};

// ==================== Polling Helpers ====================

/**
 * Calculate next delay with exponential backoff
 *
 * @param currentDelay - Current delay in milliseconds
 * @param maxDelay - Maximum delay allowed
 * @returns Next delay (doubled, capped at maxDelay)
 */
const calculateNextDelay = (currentDelay: number, maxDelay: number): number => {
  return Math.min(currentDelay * 2, maxDelay);
};

/**
 * Sleep for specified milliseconds
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Poll analysis status until completion or failure
 *
 * Uses exponential backoff to avoid overwhelming the server:
 * - Starts at 1 second
 * - Doubles each poll (1s → 2s → 4s → 8s...)
 * - Caps at 30 seconds max delay
 * - Maximum 30 attempts (~5 minutes total)
 *
 * @param analysisUuid - UUID of the analysis to poll
 * @param options - Polling configuration
 * @returns Full analysis response with results
 * @throws Error if max attempts exceeded
 */
export const pollAnalysisComplete = async (
  analysisUuid: string,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<AnalysisResponse> => {
  const {
    maxAttempts = DEFAULT_POLL_CONFIG.maxAttempts,
    initialDelay = DEFAULT_POLL_CONFIG.initialDelay,
    onProgress
  } = options;

  let attempts = 0;
  let currentDelay = initialDelay;

  while (attempts < maxAttempts) {
    attempts++;

    // Get current status
    const statusResponse = await getAnalysisStatus(analysisUuid);

    // Report progress if callback provided
    if (onProgress) {
      onProgress(statusResponse.progress);
    }

    // Check if terminal status reached
    if (TERMINAL_STATUSES.includes(statusResponse.status as never)) {
      // Get full result
      const result = await getAnalysisResult(analysisUuid);

      // If failed, throw error with message
      if (statusResponse.status === 'failed') {
        throw new Error(result.errorMessage || statusResponse.message || 'Analysis failed');
      }

      return result;
    }

    // Wait before next poll with exponential backoff
    await sleep(currentDelay);
    currentDelay = calculateNextDelay(currentDelay, DEFAULT_POLL_CONFIG.maxDelay);
  }

  // Max attempts exceeded
  throw new Error(
    `Analysis polling exceeded maximum attempts (${maxAttempts}). ` +
      `The analysis may still be running - check status manually.`
  );
};

/**
 * Start analysis and poll until complete (convenience wrapper)
 *
 * Combines startAnalysis() + pollAnalysisComplete() for common use case.
 *
 * @param pitchDeckUuid - UUID of the pitch deck to analyze
 * @param options - Polling configuration
 * @returns Complete analysis response with VC framework results
 */
export const startAnalysisAndWait = async (
  pitchDeckUuid: string,
  options?: {
    maxAttempts?: number;
    initialDelay?: number;
    onProgress?: (progress: number) => void;
  }
): Promise<AnalysisResponse> => {
  // Start the analysis
  const startResponse = await startAnalysis(pitchDeckUuid);

  // Poll until complete
  return pollAnalysisComplete(startResponse.uuid, options);
};
