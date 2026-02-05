/**
 * VC Feedback Mock Data
 * Mock generator for VC pitch deck feedback
 */

import {
  VC_FEEDBACK_SECTIONS,
  calculateOverallScore,
  getDecisionFromScore
} from '@/constants/vc-evaluation';
import type {
  VcFeedbackResponse,
  VcFeedbackSection,
  VcFeedbackItem
} from '@/types/domain/vc-feedback';

/**
 * Generate mock VC feedback for a pitch deck
 * Creates realistic feedback for testing UI
 */
export const generateMockVcFeedback = (pitchDeckId: string): VcFeedbackResponse => {
  // Generate section feedback with realistic scores
  const sections = (Object.keys(VC_FEEDBACK_SECTIONS) as VcFeedbackSection[])
    .filter((key) => key !== 'overall')
    .map((section) => {
      const score = Math.floor(Math.random() * 4) + 6; // 6-9 range for realistic feedback

      return {
        section,
        score,
        strengths: generateStrengths(section, score),
        concerns: generateConcerns(section, score),
        recommendations: generateRecommendations(section, score)
      };
    });

  // Calculate overall decision
  const overallScore = calculateOverallScore(sections);
  const decision = getDecisionFromScore(overallScore);

  return {
    pitchDeckId,
    sections,
    overall: {
      decision,
      summary: generateSummary(decision, overallScore),
      keyStrengths: generateKeyStrengths(sections),
      keyRisks: generateKeyRisks(sections),
      nextSteps: generateNextSteps(decision)
    },
    generatedAt: new Date().toISOString()
  };
};

/**
 * Helper to create feedback item with optional reference
 */
const createFeedbackItem = (text: string, page?: number, area?: string): VcFeedbackItem => {
  const item: VcFeedbackItem = { text };
  if (page !== undefined || area !== undefined) {
    item.reference = {};
    if (page !== undefined) item.reference.page = page;
    if (area !== undefined) item.reference.area = area;
  }

  return item;
};

/**
 * Generate section-specific strengths
 */
const generateStrengths = (section: VcFeedbackSection, score: number): VcFeedbackItem[] => {
  const strengthsMap: Record<
    VcFeedbackSection,
    Array<{ text: string; page?: number; area?: string }>
  > = {
    content: [
      { text: 'Problem statement is clearly defined', page: 2, area: 'Problem Statement' },
      { text: 'Solution fits market needs well', page: 3, area: 'Solution Overview' },
      { text: 'Logical flow is compelling', page: 4, area: 'Value Proposition' }
    ],
    product: [
      { text: 'Product has clear development roadmap', page: 7, area: 'Product Roadmap' },
      { text: 'Demo demonstrates core value proposition', page: 6, area: 'Product Demo' },
      { text: 'Technology has good scalability potential', page: 8, area: 'Technical Architecture' }
    ],
    market: [
      { text: 'Market size is substantial (TAM > $1B)', page: 9, area: 'Market Size' },
      { text: 'Market growth rate is favorable', page: 9, area: 'Market Trends' },
      { text: 'Go-to-Market strategy is well-suited', page: 11, area: 'GTM Strategy' }
    ],
    competitive: [
      { text: 'Clear differentiation from competitors', page: 12, area: 'Competitive Matrix' },
      { text: 'Sustainable technology advantage', page: 13, area: 'Moat Analysis' },
      { text: 'Strong brand positioning', page: 12, area: 'Market Positioning' }
    ],
    team: [
      { text: 'Founders have relevant industry experience', page: 14, area: 'Team Background' },
      { text: 'Technical and business skills are balanced', page: 15, area: 'Advisors' },
      { text: 'Previous startup experience demonstrated', page: 14, area: 'Founder Profiles' }
    ],
    presentation: [
      { text: 'Slide structure is clear and easy to follow', page: 1, area: 'Agenda' },
      { text: 'Design is professional and visually appealing', page: 1, area: 'Overall Design' },
      { text: 'Storytelling is engaging', page: 16, area: 'Closing' }
    ],
    overall: []
  };

  const baseStrengths = strengthsMap[section] || [];
  // Return fewer strengths for lower scores

  return score >= 7
    ? baseStrengths.map((s) => createFeedbackItem(s.text, s.page, s.area))
    : baseStrengths
        .slice(0, Math.max(1, baseStrengths.length - 1))
        .map((s) => createFeedbackItem(s.text, s.page, s.area));
};

/**
 * Generate section-specific concerns
 */
const generateConcerns = (section: VcFeedbackSection, score: number): VcFeedbackItem[] => {
  if (score >= 8) return []; // No concerns for excellent scores

  const concernsMap: Record<
    VcFeedbackSection,
    Array<{ text: string; page?: number; area?: string }>
  > = {
    content: [
      { text: 'Target customer definition needs more clarity', page: 2, area: 'Target Audience' },
      {
        text: 'Market size claims need more supporting evidence',
        page: 9,
        area: 'TAM Calculation'
      },
      { text: 'Solution differentiation not clearly articulated', page: 4, area: 'Unique Value' }
    ],
    product: [
      { text: 'Current product status is unclear', page: 6, area: 'Product Status' },
      { text: 'More real traction metrics needed', page: 7, area: 'Traction' },
      { text: 'Development roadmap appears unrealistic', page: 7, area: 'Timeline' }
    ],
    market: [
      { text: 'Competitive analysis lacks depth', page: 12, area: 'Competitor Analysis' },
      { text: 'Business model needs more detail', page: 10, area: 'Revenue Model' },
      { text: 'Scalability argument not fully convincing', page: 8, area: 'Unit Economics' }
    ],
    competitive: [
      { text: 'Competitive advantage may not be sustainable', page: 13, area: 'Barriers to Entry' },
      { text: 'Barriers to entry are not well-defined', page: 13, area: 'Moat' },
      { text: 'Competitors could easily replicate features', page: 12, area: 'Feature Comparison' }
    ],
    team: [
      { text: 'Team lacks experience in this industry', page: 14, area: 'Team Experience' },
      { text: 'Co-founder roles are unclear', page: 15, area: 'Organization Structure' },
      { text: 'Team size insufficient for execution', page: 14, area: 'Hiring Plan' }
    ],
    presentation: [
      { text: 'Slide content is too long and lacks focus', page: 3, area: 'Content Density' },
      { text: 'Design is not consistent throughout', page: 5, area: 'Visual Style' },
      { text: 'Key supporting data visuals are missing', page: 9, area: 'Charts & Graphs' }
    ],
    overall: []
  };

  const baseConcerns = concernsMap[section] || [];
  // Return fewer concerns for higher scores

  return score >= 6
    ? baseConcerns.slice(0, 1).map((s) => createFeedbackItem(s.text, s.page, s.area))
    : baseConcerns.slice(0, 2).map((s) => createFeedbackItem(s.text, s.page, s.area));
};

/**
 * Generate section-specific recommendations
 */
const generateRecommendations = (section: VcFeedbackSection, score: number): VcFeedbackItem[] => {
  if (score >= 9) return [createFeedbackItem('Continue on current trajectory')];

  const recommendationsMap: Record<
    VcFeedbackSection,
    Array<{ text: string; page?: number; area?: string }>
  > = {
    content: [
      { text: 'Add market size and demand data', page: 9, area: 'Market Size' },
      { text: 'Clarify target customer profile', page: 2, area: 'Persona Definition' },
      { text: 'Strengthen problem statement with evidence', page: 2, area: 'Problem Validation' }
    ],
    product: [
      { text: 'Update with latest traction metrics', page: 7, area: 'Traction Slide' },
      { text: 'Add detailed roadmap for next 6-12 months', page: 7, area: 'Milestones' },
      { text: 'Clarify MVP and key features', page: 6, area: 'Feature Set' }
    ],
    market: [
      {
        text: 'Provide deeper analysis of 3-5 key competitors',
        page: 12,
        area: 'Competitive Landscape'
      },
      { text: 'Detail Go-to-Market strategy by channel', page: 11, area: 'Channel Strategy' },
      { text: 'Add unit economics analysis', page: 10, area: 'Unit Economics' }
    ],
    competitive: [
      { text: 'Clarify barriers to entry (patents, network effects)', page: 13, area: 'IP & Moat' },
      {
        text: 'Include visual comparison with existing solutions',
        page: 12,
        area: 'Competitive Matrix'
      },
      { text: 'Emphasize unique technology advantages', page: 8, area: 'Tech Differentiation' }
    ],
    team: [
      { text: 'Add more founder-relevant experience information', page: 14, area: 'Team Slide' },
      { text: 'Clarify organizational structure and hiring plans', page: 15, area: 'Org Chart' },
      { text: 'Demonstrate founder-problem fit', page: 14, area: 'Founder Story' }
    ],
    presentation: [
      { text: 'Simplify content, focus on 3 key points', page: 3, area: 'Content' },
      { text: 'Add charts/data for main arguments', page: 9, area: 'Data Visualization' },
      { text: 'Improve design consistency', page: 1, area: 'Visual Design' }
    ],
    overall: []
  };

  return recommendationsMap[section]?.map((s) => createFeedbackItem(s.text, s.page, s.area)) || [];
};

/**
 * Generate overall summary
 */
const generateSummary = (decision: string, score: number): string => {
  const summaries: Record<string, string> = {
    invest: `Strong investment potential. Strong team, clear product, large market. Score: ${score}/10.`,
    deep_dive: `Promising but needs more information for full assessment. Deeper market and traction analysis needed. Score: ${score}/10.`,
    watchlist: `Interesting project but timing is not ideal. Monitor and reassess when more traction is available. Score: ${score}/10.`,
    pass: `Too many fundamental risks. Significant improvements needed before investment consideration. Score: ${score}/10.`
  };

  return summaries[decision] || summaries.deep_dive;
};

/**
 * Generate key strengths from all sections
 */
const generateKeyStrengths = (sections: VcFeedbackResponse['sections']): string[] => {
  const allStrengths = sections.flatMap((s) => s.strengths.map((item) => item.text));
  // Return top 3

  return allStrengths.slice(0, 3);
};

/**
 * Generate key risks from all sections
 */
const generateKeyRisks = (sections: VcFeedbackResponse['sections']): string[] => {
  const concerns = sections.flatMap((s) => s.concerns.map((item) => item.text));
  // Return top 3

  return concerns.slice(0, 3);
};

/**
 * Generate next steps based on decision
 */
const generateNextSteps = (decision: string): string[] | undefined => {
  if (decision === 'pass') return undefined;

  const nextStepsMap: Record<string, string[]> = {
    invest: [
      'Schedule meeting with founding team',
      'Detailed financial and metrics due diligence',
      'Reference checks and background verification'
    ],
    deep_dive: [
      'Provide additional market data',
      'Clarify growth roadmap and unit economics',
      'Meeting to better understand product'
    ],
    watchlist: [
      'Update when new traction is available',
      'Monitor market developments',
      'Stay in touch for future funding rounds'
    ],
    pass: []
  };

  return nextStepsMap[decision];
};

/**
 * Pre-generated mock feedback for quick testing
 */
export const MOCK_VC_FEEDBACK: VcFeedbackResponse = generateMockVcFeedback('mock-deck-001');
