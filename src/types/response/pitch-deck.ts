// Response types for pitch deck API endpoints

import type { PitchDeckStatus } from '@/constants/pitch-deck-status';

export type UploadPitchDeckResponse = {
  uploadId: string;
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
  uploadId: string;
  filename: string;
  overallScore: number;
  categoryScores: VCCategoryScore;
  strengths: StrengthItem[];
  improvements: ImprovementItem[];
  competitiveAnalysis?: CompetitiveAnalysis;
  analyzedAt: string;
};

// ==================== Pitch Deck Management Response Types ====================

export type PitchDeckListItem = {
  id: string;
  uuid: string;
  title: string;
  description: string | null;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  status: PitchDeckStatus;
  chunkCount: number;
  errorMessage: string | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
};

export type ListPitchDecksResponse = PitchDeckListItem[];

export type PitchDeckDetailResponse = PitchDeckListItem;
