/**
 * UI State Domain Types
 * Types for UI component states, levels, and visual indicators
 */

// ==================== Level Types ====================

/**
 * Severity level for issues/risks
 * Used in SWOT and Recommendation tabs
 */
export type SeverityLevel = 'high' | 'medium' | 'low';

/**
 * Impact level with positive option
 * Used in SWOT and PESTLE tabs
 */
export type ImpactLevel = 'high' | 'medium' | 'low' | 'positive';

/**
 * Trend direction for indicators
 * Used in PESTLE and metrics tabs
 */
export type TrendDirection = 'up' | 'down' | 'stable';

// ==================== Decision Types ====================

/**
 * Investment verdict types for Recommendation tab
 */
export type VerdictType = 'strong_buy' | 'buy' | 'hold' | 'pass';

/**
 * Decision types for Summary tab
 * Renamed from DecisionType to avoid collision with evaluation-criteria.ts
 * Matches backend SummaryDecision type
 */
export type SummaryDecision = 'pass' | 'meeting' | 'deep_dive';

/**
 * Traffic light state for quick decision display
 * Used in Summary tab
 */
export interface TrafficLightState {
  decision: SummaryDecision;
  confidence: number; // 0-100
  reasoning: string;
}

// ==================== Enhanced Item Types ====================

/**
 * Enhanced SWOT item with severity and impact
 * Extends base SWOT item from mock-data types
 */
export interface EnhancedSWOTItem {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  impact: ImpactLevel;
  category?: string;
}

/**
 * Enhanced PESTLE item with trend and timeframe
 * Extends base PESTLE item from mock-data types
 */
export interface EnhancedPESTLEItem {
  id: string;
  factor: string;
  impact: ImpactLevel;
  trend: TrendDirection;
  implications: string;
  timeframe?: string; // e.g., "short-term", "medium-term", "long-term"
}

// ==================== UI Component State Types ====================

/**
 * Collapsible section state
 * Used for expandable/collapsible UI components
 */
export interface CollapsibleState {
  id: string;
  isExpanded: boolean;
}

/**
 * Tab state for multi-tab components
 */
export interface TabState {
  activeTab: string;
  history: string[];
}

/**
 * Filter state for list filtering
 */
export interface FilterState {
  category?: string;
  severity?: SeverityLevel;
  impact?: ImpactLevel;
  searchQuery?: string;
}

// ==================== Color/Style Types ====================

/**
 * Color variant for UI elements
 */
export type ColorVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/**
 * Size variant for UI elements
 */
export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';

// ==================== Action Item Types ====================

/**
 * Action item for next steps/checklists
 * Used in Recommendation tab
 */
export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  assignee?: string;
}

/**
 * Next steps for investment recommendation
 */
export interface NextSteps {
  title: string;
  items: ActionItem[];
  estimatedTimeline?: string;
}
