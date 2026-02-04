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

  // Pitch deck endpoints (4 total)
  PITCH_DECK: {
    UPLOAD: '/pitchdeck/upload',
    LIST: '/pitchdeck',
    DETAIL: (uuid: string) => `/pitchdeck/${uuid}`,
    DELETE: (uuid: string) => `/pitchdeck/${uuid}`
  },

  // Analysis endpoints (5 total)
  ANALYSIS: {
    START: '/analysis/start',
    STATUS: (uuid: string) => `/analysis/${uuid}/status`,
    DETAIL: (uuid: string) => `/analysis/${uuid}`,
    LIST: '/analysis',
    DELETE: (uuid: string) => `/analysis/${uuid}`
  }
} as const;
