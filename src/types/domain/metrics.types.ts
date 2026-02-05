/**
 * Metrics Domain Types
 * Types for startup metrics and market sizing used across detail tabs
 */

/**
 * Key startup metrics for Summary tab
 * Standard SaaS metrics investors evaluate
 */
export interface StartupMetrics {
  arr: number; // Annual Recurring Revenue
  customers: number; // Total customer count
  growthRate: number; // Month-over-month growth percentage
  runway: number; // Months of runway remaining
  ltv: number; // Lifetime Value
  cac: number; // Customer Acquisition Cost
  ltvCacRatio: number; // LTV:CAC ratio
  grossMargin: number; // Gross margin percentage
  churn: number; // Monthly churn rate
}

/**
 * Market size breakdown for TAM/SAM/SOM display
 * Used in Summary and Recommendation tabs
 */
export interface MarketSize {
  tam: string; // Total Addressable Market (e.g., "$45B")
  sam: string; // Serviceable Addressable Market (e.g., "$12B")
  som: string; // Serviceable Obtainable Market (e.g., "$500M")
  cagr?: string; // Compound Annual Growth Rate (e.g., "22%")
}

/**
 * Score band for categorizing performance
 * Used for color-coded indicators
 */
export type ScoreBand = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * Confidence level with band and factors
 * Used in Recommendation tab for verdict confidence
 */
export interface ConfidenceLevel {
  score: number; // 0-100
  band: 'high' | 'medium' | 'low';
  factors: string[]; // Reasons for confidence level
}

/**
 * Growth trend data point
 */
export interface GrowthTrend {
  month: string; // YYYY-MM format
  value: number; // Metric value
  changePercent?: number; // Month-over-month change
}

/**
 * Competitor positioning data
 */
export interface CompetitorPosition {
  name: string;
  marketShare: number; // Percentage
  strengths: string[];
  weaknesses: string[];
}

/**
 * Team member profile for Summary tab
 * Extended from response/pitch-deck.ts TeamMember with additional fields
 */
export interface TeamMemberProfile {
  name: string;
  role: string;
  background: string;
  verified: boolean;
  linkedInUrl?: string;
}
