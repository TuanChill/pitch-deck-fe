// Pitch deck status constants matching API spec
// Status values: uploading | processing | ready | error

export type PitchDeckStatus = 'uploading' | 'processing' | 'ready' | 'error';

export const PITCH_DECK_STATUS: Record<PitchDeckStatus, { label: string; color: string }> = {
  uploading: {
    label: 'Uploading',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  },
  processing: {
    label: 'Processing',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
  },
  ready: {
    label: 'Ready',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  },
  error: {
    label: 'Error',
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  }
};

export const getStatusLabel = (status: PitchDeckStatus): string => PITCH_DECK_STATUS[status].label;

export const getStatusColor = (status: PitchDeckStatus): string => PITCH_DECK_STATUS[status].color;

// ==================== Deck Current Step (AI Pipeline) ====================

export type DeckCurrentStep =
  | 'extract'
  | 'summary'
  | 'analytics'
  | 'swot'
  | 'pestle'
  | 'recommendation'
  | 'done';
