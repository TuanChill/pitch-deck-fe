/**
 * Pitch Deck Management API Service
 *
 * Convenience wrapper for pitch deck CRUD operations used by management pages.
 * Uses Phase 02 pitch-deck.service under the hood.
 *
 * This file maintains backward compatibility with existing management components.
 */

import { deletePitchDeck, uploadPitchDeck } from '@/services/api/pitch-deck.service';
import type { UploadPitchDeckWithMetadataRequest } from '@/types/request/pitch-deck';
import type { PitchDeckDetailResponse } from '@/types/response/pitch-deck';

// Re-export core functions from pitch-deck.service
// These are now implemented with real API calls
export {
  uploadPitchDeck,
  listPitchDecks,
  getPitchDeckDetail,
  deletePitchDeck
} from '@/services/api/pitch-deck.service';

/**
 * Upload pitch deck with metadata (alias for upload form compatibility)
 * Wraps uploadPitchDeck with the legacy UploadPitchDeckWithMetadataRequest format
 *
 * @param request - Upload request with single file and metadata
 * @param onProgress - Optional progress callback
 * @returns Created pitch deck detail
 */
export const uploadPitchDeckWithMetadata = async (
  request: UploadPitchDeckWithMetadataRequest,
  onProgress?: (progress: number) => void
): Promise<PitchDeckDetailResponse> => {
  // Convert legacy format to new format
  return uploadPitchDeck(
    {
      files: [request.deck],
      title: request.title,
      description: request.description,
      tags: request.tags
    },
    onProgress
  );
};

/**
 * Delete pitch deck by UUID (alias for consistency)
 *
 * @param uuid - Unique identifier of the pitch deck
 * @returns Success confirmation
 */
export const deletePitchDeckByUuid = async (uuid: string): Promise<void> => {
  // Re-use the main delete function
  await deletePitchDeck(uuid);
};
