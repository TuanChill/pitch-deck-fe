/**
 * Recommendation API Service
 *
 * Implements recommendation operations using backend API.
 *
 * Backend: http://localhost:8082
 * Auth: JWT handled by httpClient interceptor
 *
 * Recommendation is an async operation with web search:
 * 1. generateRecommendation() - triggers recommendation, returns report UUID
 * 2. getRecommendationStatus() - poll for status (pending/searching/analyzing/completed/failed)
 * 3. getRecommendation() - get full recommendation report
 * 4. getRecommendationByDeck() - get recommendation by pitch deck UUID
 */

import { API_URL } from '@/constants/api-url';
import { httpClient } from '@/services/http/client';
import type { RecommendationResponse, RecommendationStatus } from '@/types/response/pitch-deck';
import Axios from 'axios';

// ==================== Constants ====================

/** Default polling configuration */
const DEFAULT_POLL_CONFIG = {
  maxAttempts: 60, // 60 attempts = ~5 minutes with exponential backoff
  initialDelay: 2000, // Start at 2 seconds
  maxDelay: 10000 // Max 10 seconds between polls
} as const;

/** Recommendation status values that indicate completion */
const COMPLETED_STATUSES = ['completed', 'failed'] as const;

/** Verdict colors for UI display */
export const VERDICT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  strong_buy: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800'
  },
  buy: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800'
  },
  hold: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800'
  },
  pass: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800'
  }
};

// ==================== Public API ====================

/**
 * Generate recommendation for a pitch deck
 * POST /recommendations/generate
 *
 * @param deckUuid - UUID of the pitch deck
 * @returns Recommendation response with UUID and initial status
 */
export const generateRecommendation = async (deckUuid: string): Promise<RecommendationResponse> => {
  const response = await httpClient.post<RecommendationResponse>(API_URL.RECOMMENDATION.GENERATE, {
    deckUuid
  });

  return response.data;
};

/**
 * Get recommendation status by UUID
 * GET /recommendations/:uuid/status
 *
 * @param uuid - UUID of the recommendation
 * @returns Status response
 */
export const getRecommendationStatus = async (uuid: string): Promise<RecommendationResponse> => {
  const response = await httpClient.get<RecommendationResponse>(
    API_URL.RECOMMENDATION.STATUS(uuid)
  );

  return response.data;
};

/**
 * Get full recommendation by UUID
 * GET /recommendations/:uuid
 *
 * @param uuid - UUID of the recommendation
 * @returns Full recommendation response
 */
export const getRecommendation = async (uuid: string): Promise<RecommendationResponse> => {
  const response = await httpClient.get<RecommendationResponse>(
    API_URL.RECOMMENDATION.DETAIL(uuid)
  );

  return response.data;
};

/**
 * Get recommendation by pitch deck UUID
 * GET /recommendations/by-deck/:deckUuid
 *
 * @param deckUuid - UUID of the pitch deck
 * @returns Recommendation response or null if not found
 */
export const getRecommendationByDeck = async (
  deckUuid: string
): Promise<RecommendationResponse | null> => {
  try {
    const response = await httpClient.get<RecommendationResponse>(
      API_URL.RECOMMENDATION.BY_DECK(deckUuid)
    );

    return response.data;
  } catch (error) {
    // Return null if recommendation not found (404)
    if (Axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// ==================== Polling Helpers ====================

/**
 * Calculate next delay with exponential backoff
 */
const calculateNextDelay = (currentDelay: number, maxDelay: number): number => {
  return Math.min(currentDelay * 1.5, maxDelay);
};

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Poll recommendation status until completion or failure
 *
 * Uses exponential backoff to avoid overwhelming the server.
 *
 * @param uuid - UUID of the recommendation to poll
 * @param options - Polling configuration
 * @returns Full recommendation response
 * @throws Error if max attempts exceeded
 */
export const pollRecommendationComplete = async (
  uuid: string,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    onProgress?: (status: RecommendationStatus) => void;
  } = {}
): Promise<RecommendationResponse> => {
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
    const statusResponse = await getRecommendationStatus(uuid);

    // Report progress if callback provided
    if (onProgress) {
      onProgress(statusResponse.status);
    }

    // Check if terminal status reached
    if (COMPLETED_STATUSES.includes(statusResponse.status as never)) {
      // Get full result
      const result = await getRecommendation(uuid);

      // If failed, throw error with message
      if (statusResponse.status === 'failed') {
        throw new Error(result.errorMessage || 'Recommendation generation failed');
      }

      return result;
    }

    // Wait before next poll with exponential backoff
    await sleep(currentDelay);
    currentDelay = calculateNextDelay(currentDelay, DEFAULT_POLL_CONFIG.maxDelay);
  }

  // Max attempts exceeded
  throw new Error(
    `Recommendation polling exceeded maximum attempts (${maxAttempts}). ` +
      `The recommendation may still be processing - check status manually.`
  );
};

/**
 * Generate recommendation and poll until complete (convenience wrapper)
 *
 * @param deckUuid - UUID of the pitch deck
 * @param options - Polling configuration
 * @returns Complete recommendation response
 */
export const generateRecommendationAndWait = async (
  deckUuid: string,
  options?: {
    maxAttempts?: number;
    initialDelay?: number;
    onProgress?: (status: RecommendationStatus) => void;
  }
): Promise<RecommendationResponse> => {
  // Start the recommendation
  const startResponse = await generateRecommendation(deckUuid);

  // Poll until complete
  return pollRecommendationComplete(startResponse.uuid, options);
};
