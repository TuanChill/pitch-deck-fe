/**
 * VC Feedback Service
 * API service for generating VC pitch deck feedback
 */

import { httpClient } from '@/services/http/client';
import type { VcFeedbackResponse, GenerateVcFeedbackRequest } from '@/types/domain/vc-feedback';

/**
 * VC Feedback API Service
 */
export const vcFeedbackService = {
  /**
   * Generate VC feedback for a pitch deck
   * Returns detailed feedback across 7 evaluation sections
   */
  generate: async (request: GenerateVcFeedbackRequest): Promise<VcFeedbackResponse> => {
    const { data } = await httpClient.post<VcFeedbackResponse>('/vc-feedback/generate', request);

    return data;
  },

  /**
   * Get existing VC feedback for a pitch deck
   */
  getByPitchDeckId: async (pitchDeckId: string): Promise<VcFeedbackResponse> => {
    const { data } = await httpClient.get<VcFeedbackResponse>(
      `/vc-feedback/pitch-deck/${pitchDeckId}`
    );

    return data;
  },

  /**
   * Check if feedback exists for a pitch deck
   */
  exists: async (pitchDeckId: string): Promise<boolean> => {
    try {
      await httpClient.get(`/vc-feedback/pitch-deck/${pitchDeckId}/check`);

      return true;
    } catch {
      return false;
    }
  }
};
