// Pitch deck management API service
// CRUD operations for pitch deck management pages

import { httpClient } from '@/services/http/client';
import type {
  ListPitchDecksQuery,
  UploadPitchDeckWithMetadataRequest
} from '@/types/request/pitch-deck';
import type { ListPitchDecksResponse, PitchDeckDetailResponse } from '@/types/response/pitch-deck';
import { withRetry } from '@/utils/retry';

/**
 * Get paginated list of pitch decks with optional status filtering
 * @param query - Query parameters for filtering and pagination
 * @returns Array of pitch deck list items
 */
export const listPitchDecks = async (
  query: ListPitchDecksQuery
): Promise<ListPitchDecksResponse> => {
  const params = new URLSearchParams();

  if (query.status) {
    params.append('status', query.status);
  }
  if (query.limit !== undefined) {
    params.append('limit', query.limit.toString());
  }
  if (query.offset !== undefined) {
    params.append('offset', query.offset.toString());
  }

  return withRetry(async () => {
    const response = await httpClient.get<ListPitchDecksResponse>(
      `/pitchdeck${params.toString() ? `?${params.toString()}` : ''}`
    );

    return response.data;
  });
};

/**
 * Get detailed information for a single pitch deck by UUID
 * @param uuid - Unique identifier of the pitch deck
 * @returns Detailed pitch deck information
 */
export const getPitchDeckDetail = async (uuid: string): Promise<PitchDeckDetailResponse> => {
  return withRetry(async () => {
    const response = await httpClient.get<PitchDeckDetailResponse>(`/pitchdeck/${uuid}`);

    return response.data;
  });
};

/**
 * Upload a pitch deck file with associated metadata (title, description, tags)
 * @param request - Upload request containing file and metadata
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Created pitch deck detail response
 */
export const uploadPitchDeckWithMetadata = async (
  request: UploadPitchDeckWithMetadataRequest,
  onProgress?: (progress: number) => void
): Promise<PitchDeckDetailResponse> => {
  const formData = new FormData();
  formData.append('file', request.deck);

  const metadata = {
    title: request.title,
    description: request.description || '',
    tags: request.tags || []
  };
  formData.append('metadata', JSON.stringify(metadata));

  return withRetry(async () => {
    const response = await httpClient.post<PitchDeckDetailResponse>('/pitchdeck/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onProgress
        ? (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(progress);
            }
          }
        : undefined
    });

    return response.data;
  });
};

/**
 * Delete a pitch deck by UUID
 * @param uuid - Unique identifier of the pitch deck to delete
 */
export const deletePitchDeckByUuid = async (uuid: string): Promise<void> => {
  return withRetry(async () => {
    await httpClient.delete(`/pitchdeck/${uuid}`);
  });
};
