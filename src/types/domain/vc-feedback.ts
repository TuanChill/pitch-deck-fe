/**
 * VC Feedback Domain Types
 * Types for Vietnamese VC pitch deck feedback generation
 */

/**
 * VC feedback section identifiers
 * Maps to 7 evaluation sections with Vietnamese labels
 */
export type VcFeedbackSection =
  | 'content' // Nội dung
  | 'product' // Sản phẩm & Thực thi
  | 'market' // Thị trường & Kinh doanh
  | 'competitive' // Lợi thế cạnh tranh
  | 'team' // Đội ngũ
  | 'presentation' // Trình bày
  | 'overall'; // Đánh giá tổng thể

/**
 * Individual section feedback
 * Contains strengths, concerns, and recommendations for one section
 */
export interface VcSectionFeedback {
  section: VcFeedbackSection;
  score: number; // 1-10 scale
  strengths: VcFeedbackItem[];
  concerns: VcFeedbackItem[];
  recommendations: VcFeedbackItem[];
}

/**
 * Individual feedback item with optional page/area reference
 */
export interface VcFeedbackItem {
  text: string;
  reference?: {
    page?: number;
    area?: string;
  };
}

/**
 * VC investment decision
 * Maps to 4-tier decision framework
 */
export type VcDecision = 'invest' | 'deep_dive' | 'watchlist' | 'pass';

/**
 * Overall VC feedback response
 * Complete feedback structure with all sections and final decision
 */
export interface VcFeedbackResponse {
  pitchDeckId: string;
  sections: VcSectionFeedback[];
  overall: {
    decision: VcDecision;
    summary: string;
    keyStrengths: string[];
    keyRisks: string[];
    nextSteps?: string[];
  };
  generatedAt: string;
}

/**
 * Request to generate VC feedback
 */
export interface GenerateVcFeedbackRequest {
  pitchDeckId: string;
  options?: {
    includeMarketAnalysis?: boolean;
    includeCompetitorAnalysis?: boolean;
  };
}

/**
 * Feedback generation status
 */
export type FeedbackGenerationStatus = 'pending' | 'generating' | 'completed' | 'failed';

/**
 * Feedback generation state
 */
export interface FeedbackGenerationState {
  status: FeedbackGenerationStatus;
  progress: number; // 0-100
  error?: string;
}
