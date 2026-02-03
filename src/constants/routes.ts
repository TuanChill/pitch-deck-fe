export const APP_URL = {
  HOME: '/',
  LOGIN: '/auth/login',
  DASHBOARD: '/dashboard',
  PITCH_DECK: '/dashboard/pitch-deck',
  PITCH_DECKS: '/dashboard/pitch-decks',
  PITCH_DECK_UPLOAD: '/dashboard/pitch-decks/upload',
  PITCH_DECK_DETAIL: (uuid: string) => `/dashboard/pitch-decks/${uuid}`
} as const;
