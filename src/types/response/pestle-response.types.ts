/**
 * PESTLE API Response Types
 * Types for PESTLE analysis API requests and responses
 */

export type PestleStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PestleEvidence {
  quote?: string;
  slideNumber?: number;
  metric?: string;
}

export interface PestleItem {
  id: string;
  category: 'political' | 'economic' | 'social' | 'technological' | 'legal' | 'environmental';
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low';
  recommendations?: string[];
  evidence?: PestleEvidence;
  implications: string;
}

export interface PestleData {
  political: PestleItem[];
  economic: PestleItem[];
  social: PestleItem[];
  technological: PestleItem[];
  legal: PestleItem[];
  environmental: PestleItem[];
  summary?: string;
  overallAssessment?: string;
}

export interface PestleApiResponse {
  _id: string;
  uuid: string;
  id: string;
  deckUuid: string;
  status: PestleStatus;
  data?: PestleData;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PestleGenerateRequest {
  id: string;
}

export interface PestleGenerateResponse {
  jobId: string;
  status: PestleStatus;
  pestle?: PestleApiResponse;
}
