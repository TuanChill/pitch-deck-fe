/**
 * Pitch Deck API Service
 *
 * Implements all pitch deck CRUD operations using real backend API.
 * Phase 02: Replaces mock implementations with actual API calls.
 * Phase 03: Removed analyzePitchDeck - now in analysis.service.ts
 *
 * Backend: http://localhost:8082
 * Auth: JWT handled by httpClient interceptor
 */

import { API_URL } from '@/constants/api-url';
import { httpClient } from '@/services/http/client';
import type { VcFeedbackResponse } from '@/types/domain/vc-feedback';
import type { ListPitchDecksQuery, UploadPitchDeckRequest } from '@/types/request/pitch-deck';
import type {
  DeleteSuccessResponse,
  ListPitchDecksResponse,
  PitchDeckDetailResponse
} from '@/types/response/pitch-deck';

// ==================== Constants ====================

/** Maximum file size: 50MB (matches backend limit) */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/** Supported file types (MIME types) */
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// ==================== Validation Utilities ====================

/**
 * Validate file size against backend limit
 * @throws Error if file exceeds 50MB
 */
const validateFileSize = (file: File): void => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds 50MB limit. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    );
  }
};

/**
 * Validate file type against allowed types
 * @throws Error if file type is not supported
 */
const validateFileType = (file: File): void => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: PDF, PPT, PPTX, DOC, DOCX`);
  }
};

/**
 * Validate all files before upload
 */
const validateFiles = (files: File[]): void => {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  if (files.length > 10) {
    throw new Error('Maximum 10 files allowed per upload');
  }

  files.forEach((file, _index) => {
    validateFileSize(file);
    validateFileType(file);
  });
};

// ==================== Public API ====================

/**
 * Upload pitch deck with files and metadata
 * POST /pitchdeck/upload
 *
 * Overload 1: Legacy signature - single file (for backward compatibility)
 * Overload 2: New signature - full request with metadata
 *
 * @param fileOrRequest - Either a single File or UploadPitchDeckRequest
 * @param onProgress - Optional progress callback (0-100)
 * @returns Created pitch deck detail
 */
export const uploadPitchDeck = async (
  fileOrRequest: File | UploadPitchDeckRequest,
  onProgress?: (progress: number) => void
): Promise<PitchDeckDetailResponse> => {
  // Handle legacy single-file signature
  const request: UploadPitchDeckRequest =
    fileOrRequest instanceof File
      ? {
          files: [fileOrRequest],
          title: fileOrRequest.name,
          description: '',
          tags: []
        }
      : fileOrRequest;

  validateFiles(request.files);

  const formData = new FormData();

  // Add files (backend expects 'files' field)
  request.files.forEach((file) => {
    formData.append('files', file);
  });

  // Add metadata as JSON string
  formData.append('title', request.title);
  if (request.description) {
    formData.append('description', request.description);
  }
  if (request.tags && request.tags.length > 0) {
    formData.append('tags', JSON.stringify(request.tags));
  }

  const response = await httpClient.post<PitchDeckDetailResponse>(
    API_URL.PITCH_DECK.UPLOAD,
    formData,
    {
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
    }
  );

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as {
    success: boolean;
    data: PitchDeckDetailResponse;
    statusCode: number;
  };

  return backendResponse.data;
};

/**
 * List pitch decks with pagination and optional status filter
 * GET /pitchdeck
 *
 * @param query - Query parameters for filtering and pagination
 * @returns Array of pitch deck list items
 */
export const listPitchDecks = async (
  query?: ListPitchDecksQuery
): Promise<ListPitchDecksResponse> => {
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
  const url = queryString ? `${API_URL.PITCH_DECK.LIST}?${queryString}` : API_URL.PITCH_DECK.LIST;

  const response = await httpClient.get<ListPitchDecksResponse>(url);

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as {
    success: boolean;
    data: ListPitchDecksResponse;
    statusCode: number;
  };

  return backendResponse.data;
};

/**
 * Get detailed pitch deck information by UUID
 * GET /pitchdeck/:uuid
 *
 * @param uuid - Unique identifier of the pitch deck
 * @returns Detailed pitch deck information
 */
export const getPitchDeckDetail = async (uuid: string): Promise<PitchDeckDetailResponse> => {
  const response = await httpClient.get<PitchDeckDetailResponse>(API_URL.PITCH_DECK.DETAIL(uuid));

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as {
    success: boolean;
    data: PitchDeckDetailResponse;
    statusCode: number;
  };

  return backendResponse.data;
};

/**
 * Delete a pitch deck by UUID
 * DELETE /pitchdeck/:uuid
 *
 * @param uuid - Unique identifier of the pitch deck to delete
 * @returns Success confirmation
 */
export const deletePitchDeck = async (uuid: string): Promise<DeleteSuccessResponse> => {
  const response = await httpClient.delete<DeleteSuccessResponse>(API_URL.PITCH_DECK.DELETE(uuid));

  // Backend wraps response: { success, data, statusCode }
  const backendResponse = response.data as unknown as {
    success: boolean;
    data: DeleteSuccessResponse;
    statusCode: number;
  };

  return backendResponse.data;
};

/**
 * Get pitch deck analytics by UUID
 * GET /pitchdeck/:uuid/analytics
 *
 * @param uuid - Unique identifier of the pitch deck
 * @returns VC-style analytics feedback
 */
export const getAnalytics = async (uuid: string): Promise<VcFeedbackResponse> => {
  const response = await httpClient.get<VcFeedbackResponse>(API_URL.PITCH_DECK.ANALYTICS(uuid));

  // Backend returns data directly (no wrapper for analytics)
  return response.data;
};
