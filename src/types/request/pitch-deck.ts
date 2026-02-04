/**
 * Request types for pitch deck API endpoints
 *
 * Based on backend DTOs:
 * - src/api/pitchdeck/dto/upload-deck.dto.ts
 * - src/api/analysis/dto/start-analysis.dto.ts
 */

// ==================== Pitch Deck Request Types ====================

/**
 * Upload pitch deck request
 * POST /pitchdeck/upload
 */
export type UploadPitchDeckRequest = {
  files: File[];
  title: string;
  description?: string;
  tags?: string[];
};

/**
 * Upload pitch deck with metadata request
 * Alternative format used by upload form
 */
export type UploadPitchDeckWithMetadataRequest = {
  deck: File;
  title: string;
  description?: string;
  tags?: string[];
};

/**
 * List pitch decks query parameters
 * GET /pitchdeck
 */
export type ListPitchDecksQuery = {
  status?: string;
  limit?: number;
  offset?: number;
};

// ==================== Analysis Request Types ====================

/**
 * Start analysis request
 * POST /analysis/start
 */
export type StartAnalysisRequest = {
  deckId: string; // UUID of the pitch deck to analyze
};

/**
 * List analyses query parameters
 * GET /analysis
 */
export type ListAnalysesQuery = {
  status?: string;
  limit?: number;
  offset?: number;
};
