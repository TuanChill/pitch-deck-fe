// Response types for pitch deck API endpoints

import type { PitchDeckStatus } from '@/constants/pitch-deck-status';

export type UploadPitchDeckResponse = {
  uuid: string;
  filename: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
};

// Legacy 4-category structure (deprecated, kept for transition)
export type CategoryScores = {
  narrative: number;
  design: number;
  business: number;
  market: number;
};

// ==================== VC Framework Types ====================

export type VCCategory =
  | 'teamAndFounders'
  | 'marketSize'
  | 'productSolution'
  | 'traction'
  | 'businessModel'
  | 'competition'
  | 'financials';

export type VCCategoryScore = {
  [K in VCCategory]: {
    score: number;
    weight: number;
    details?: string;
  };
};

export type EvidenceQuote = {
  text: string;
  slide?: number;
  category: VCCategory;
};

export type ImpactLevel = 'high' | 'medium' | 'low';

export type StrengthItem = {
  id: string;
  title: string;
  description: string;
  evidence: EvidenceQuote[];
  impact: ImpactLevel;
  category: VCCategory;
};

export type SeverityLevel = 'high' | 'medium' | 'low';

export type ImprovementItem = {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  severity: SeverityLevel;
  priority: number;
  category: VCCategory;
};

export type CompetitivePosition = {
  id: string;
  name: string;
  x: number;
  y: number;
  isUser: boolean;
};

export type Differentiator = {
  id: string;
  aspect: string;
  userScore: number;
  competitorAvg: number;
  description: string;
};

export type CompetitiveAnalysis = {
  positioning: CompetitivePosition[];
  differentiators: Differentiator[];
  marketOpportunity: {
    size: string;
    growth: string;
    trend: 'rising' | 'stable' | 'declining';
  };
};

// New VC framework response structure
export type PitchDeckAnalysisResponse = {
  deckId: string; // UUID of the pitch deck
  filename: string;
  overallScore: number;
  categoryScores: VCCategoryScore;
  strengths: StrengthItem[];
  improvements: ImprovementItem[];
  competitiveAnalysis?: CompetitiveAnalysis;
  analyzedAt: string;
};

// ==================== Pitch Deck File Response Type ====================

/**
 * Individual file response (for multi-file pitch decks)
 * Based on backend: src/api/pitchdeck/dto/pitch-deck-file-response.dto.ts
 */
export type PitchDeckFileResponse = {
  uuid: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  status: PitchDeckStatus;
  storagePath: string;
  createdAt: string;
  updatedAt: string;
};

// ==================== Pitch Deck Management Response Types ====================

/**
 * Pitch deck list item and detail response
 * Based on backend: src/api/pitchdeck/dto/pitch-deck-response.dto.ts
 *
 * BACKEND CHANGES:
 * - Uses `uuid` as primary identifier (not `uploadId` from mock)
 * - File metadata moved to `files` array (multi-file support)
 * - Added `fileCount` property for quick reference
 */
export type PitchDeckListItem = {
  id: string;
  uuid: string;
  title: string;
  description: string | null;
  status: PitchDeckStatus;
  chunkCount: number;
  fileCount: number;
  errorMessage: string | null;
  tags: string[] | null;
  files: PitchDeckFileResponse[];
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
};

export type ListPitchDecksResponse = PitchDeckListItem[];

export type PitchDeckDetailResponse = PitchDeckListItem;

// ==================== Analysis Response Types ====================

/**
 * Analysis status (from backend AnalysisStatus enum)
 */
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Analysis status response
 * GET /analysis/:uuid/status
 */
export type AnalysisStatusResponse = {
  id: string;
  uuid: string;
  status: AnalysisStatus;
  progress: number;
  message?: string;
  updatedAt: string;
};

/**
 * Full analysis response
 * GET /analysis/:uuid, POST /analysis/start
 * Based on backend: src/api/analysis/dto/analysis-response.dto.ts
 */
export type AnalysisResponse = {
  id: string;
  uuid: string;
  deckId: string;
  status: AnalysisStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  errorMessage?: string;
  results?: AnalysisResult;
};

/**
 * Analysis result (nested in AnalysisResponse when completed)
 */
export type AnalysisResult = {
  overallScore: number;
  categoryScores: VCCategoryScore;
  strengths: StrengthItem[];
  improvements: ImprovementItem[];
  competitiveAnalysis?: CompetitiveAnalysis;
  analyzedAt: string;
};

/**
 * List analyses response
 * GET /analysis
 */
export type ListAnalysesResponse = AnalysisResponse[];

/**
 * Success response for delete operations
 * DELETE /pitchdeck/:uuid, DELETE /analysis/:uuid
 */
export type DeleteSuccessResponse = {
  success: boolean;
};

// ==================== Recommendation Response Types ====================

/**
 * Recommendation status
 */
export type RecommendationStatus = 'pending' | 'searching' | 'analyzing' | 'completed' | 'failed';

/**
 * Market research findings
 */
export type MarketResearch = {
  summary: string;
  tam?: string;
  sam?: string;
  som?: string;
  growthRate?: string;
  trends: string[];
  sources: Array<{ title: string; url: string }>;
};

/**
 * Competitor information
 */
export type Competitor = {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
};

/**
 * Competitor analysis findings
 */
export type CompetitorAnalysis = {
  summary: string;
  competitors: Competitor[];
  sources: Array<{ title: string; url: string }>;
};

/**
 * Team member verification
 */
export type TeamMember = {
  name: string;
  role: string;
  verified: boolean;
  notes?: string;
};

/**
 * Team verification findings
 */
export type TeamVerification = {
  summary: string;
  teamMembers: TeamMember[];
  sources: Array<{ title: string; url: string }>;
};

/**
 * Overall recommendation verdict
 */
export type OverallRecommendation = {
  verdict: 'strong_buy' | 'buy' | 'hold' | 'pass';
  confidence: number;
  reasoning: string;
  keyStrengths: string[];
  keyConcerns: string[];
  nextSteps: string[];
};

/**
 * Recommendation response
 * POST /recommendations/generate, GET /recommendations/:uuid
 */
export type RecommendationResponse = {
  uuid: string;
  status: RecommendationStatus;
  content?: string;
  marketResearch?: MarketResearch;
  competitorAnalysis?: CompetitorAnalysis;
  teamVerification?: TeamVerification;
  overallRecommendation?: OverallRecommendation;
  generatedAt?: string;
  errorMessage?: string;
};
