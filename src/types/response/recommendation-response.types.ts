/**
 * Recommendation API Response Types
 * Types for investment recommendation API requests and responses
 */

export type RecommendationStatus = 'pending' | 'searching' | 'analyzing' | 'completed' | 'failed';

export type RecommendationVerdict = 'strong_buy' | 'buy' | 'hold' | 'pass';

export interface MarketResearchData {
  tam: string;
  sam: string;
  som: string;
  cagr: string;
  analysis: string;
}

export interface CompetitorData {
  name: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
}

export interface CompetitorAnalysisData {
  topCompetitors: CompetitorData[];
  positioning: string;
}

export interface FounderData {
  name: string;
  role: string;
  background: string;
  credentials: string;
}

export interface TeamVerificationData {
  founders: FounderData[];
  overallAssessment: string;
}

export interface RecommendationData {
  verdict: RecommendationVerdict;
  confidence: number;
  overallSummary: string;
  keyStrengths: string[];
  keyRisks: string[];
  marketResearch: MarketResearchData;
  competitorAnalysis: CompetitorAnalysisData;
  teamVerification: TeamVerificationData;
  investmentConsiderations: string[];
}

export interface RecommendationApiResponse {
  _id: string;
  uuid: string;
  id: string;
  deckUuid: string;
  status: RecommendationStatus;
  data?: RecommendationData;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
  jobId?: string;
}

export interface RecommendationGenerateRequest {
  id: string;
}

export interface RecommendationGenerateResponse {
  jobId: string;
  status: RecommendationStatus;
  recommendation?: RecommendationApiResponse;
}
