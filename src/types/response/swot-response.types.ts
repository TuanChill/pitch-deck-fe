/**
 * SWOT API Response Types
 * Types for SWOT analysis API requests and responses
 */

export type SwotStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface SwotEvidence {
  quote?: string;
  slideNumber?: number;
  metric?: string;
}

export interface SwotItem {
  id: string;
  title: string;
  description: string;
  severity?: 'critical' | 'major' | 'minor' | 'info';
  recommendations?: string[];
  evidence?: SwotEvidence;
  strategicImplications?: string;
}

export interface SwotData {
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
  summary?: string;
}

export interface SwotApiResponse {
  uuid: string;
  id: string;
  status: SwotStatus;
  data?: SwotData;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface SwotGenerateRequest {
  id: string;
}

export interface SwotGenerateResponse {
  jobId: string;
  status: SwotStatus;
  swot?: SwotApiResponse;
}

/**
 * Severity mapping from backend to frontend
 * Backend uses: critical, major, minor, info
 * Frontend displays: high, medium, low
 */
export const SEVERITY_MAP: Record<string, 'high' | 'medium' | 'low'> = {
  critical: 'high',
  major: 'high',
  minor: 'medium',
  info: 'low'
};
