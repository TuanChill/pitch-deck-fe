import { PipelineStage } from '@/types/domain/pipeline';

export const PIPELINE_STAGE_ORDER = [
  'extract',
  'summary',
  'analytics',
  'swot',
  'pestle',
  'recommendation'
] as const;

export const PIPELINE_STAGE_LABELS: Record<string, string> = {
  extract: 'Extract Content',
  summary: 'Generate Summary',
  analytics: 'VC Framework Analysis',
  swot: 'SWOT Analysis',
  pestle: 'PESTLE Analysis',
  recommendation: 'Investment Recommendation'
};

export const INITIAL_STAGES: Record<string, PipelineStage> = Object.fromEntries(
  PIPELINE_STAGE_ORDER.map((id) => [
    id,
    {
      id,
      name: PIPELINE_STAGE_LABELS[id],
      status: 'pending',
      progress: 0
    }
  ])
);

// Backend agent to frontend stage mapping
export const AGENT_TO_STAGE_MAP: Record<string, string> = {
  'Sector Match Agent': 'analytics',
  'Stage Match Agent': 'analytics',
  'Thesis Overlap Agent': 'analytics',
  'History Behavior Agent': 'analytics',
  'Strengths Agent': 'swot',
  'Weaknesses Agent': 'swot',
  'Competitive Agent': 'swot',
  // Phase 01: New category-based agents
  OverallAssessmentAgent: 'analytics',
  MarketOpportunityAgent: 'analytics',
  BusinessModelAgent: 'analytics',
  TeamExecutionAgent: 'analytics',
  FinancialProjectionsAgent: 'analytics',
  CompetitiveLandscapeAgent: 'analytics',
  ContentAgent: 'summary',
  PresentationAgent: 'analytics'
};
