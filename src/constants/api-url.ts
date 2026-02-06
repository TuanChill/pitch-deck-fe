/**
 * API endpoint URL constants
 *
 * Backend: http://localhost:8082
 * All endpoints require JWT authentication via Authorization: Bearer <token>
 */

export const API_URL = {
  // Auth endpoints
  GET_ME: '/users/me',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  // Pitch deck endpoints (6 total)
  PITCH_DECK: {
    UPLOAD: '/pitchdeck/upload',
    LIST: '/pitchdeck',
    DETAIL: (uuid: string) => `/pitchdeck/${uuid}`,
    DELETE: (uuid: string) => `/pitchdeck/${uuid}`,
    SUMMARY: (uuid: string) => `/pitchdeck/${uuid}/summary`,
    ANALYTICS: (uuid: string) => `/pitchdeck/${uuid}/analytics`
  },

  // Analysis endpoints (6 total)
  ANALYSIS: {
    START: '/analysis/start',
    STATUS: (uuid: string) => `/analysis/${uuid}/status`,
    DETAIL: (uuid: string) => `/analysis/${uuid}`,
    LIST: '/analysis',
    DELETE: (uuid: string) => `/analysis/${uuid}`,
    BY_DECK: (deckUuid: string) => `/analysis/by-deck/${deckUuid}`
  },

  // Report endpoints
  REPORT: {
    GENERATE: (analysisUuid: string) => `/analysis/${analysisUuid}/reports`,
    LIST: (analysisUuid: string) => `/analysis/${analysisUuid}/reports`,
    DETAIL: (analysisUuid: string, reportUuid: string) =>
      `/analysis/${analysisUuid}/reports/${reportUuid}`
  },

  // Recommendation endpoints
  RECOMMENDATION: {
    GENERATE: '/recommendations/generate',
    STATUS: (uuid: string) => `/recommendations/${uuid}/status`,
    DETAIL: (uuid: string) => `/recommendations/${uuid}`,
    BY_DECK: (deckUuid: string) => `/recommendations/by-deck/${deckUuid}`
  },

  // SWOT endpoints (4 total)
  SWOT: {
    GENERATE: (id: string) => `/pitchdeck/${id}/swot/generate`,
    BY_DECK: (id: string) => `/pitchdeck/${id}/swot`,
    STATUS: (jobId: string) => `/swot/status/${jobId}`
  }
} as const;
