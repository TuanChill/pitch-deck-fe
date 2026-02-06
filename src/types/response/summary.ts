/**
 * Summary Response Types
 */

import type { SummaryDecision } from '@/types/domain';

import type { ApiResponse } from './common';

/**
 * Pitch deck summary data returned from API
 */
export interface SummaryData {
  oneLiner: string;
  problem: string;
  solution: string;
  market: string;
  product: string;
  traction: string;
  businessModel: string;
  moat: string;
  team: string;
  fundraising: string;
  overallScore: number;
  decision: SummaryDecision;
}

/**
 * GET /pitchdeck/:uuid/summary response
 */
export type SummaryResponse = ApiResponse<SummaryData>;
