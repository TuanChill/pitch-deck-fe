/**
 * Recommendation Mock Data Types
 */

export type RecommendationVerdict = 'strong_buy' | 'buy' | 'hold' | 'pass';

export interface RecommendationData {
  verdict: RecommendationVerdict;
  confidence: number;
  overallSummary: string;
  keyStrengths: string[];
  keyRisks: string[];
  marketResearch: {
    tam: string;
    sam: string;
    som: string;
    cagr: string;
    analysis: string;
  };
  competitorAnalysis: {
    topCompetitors: Array<{
      name: string;
      marketShare: string;
      strengths: string[];
      weaknesses: string[];
    }>;
    positioning: string;
  };
  teamVerification: {
    founders: Array<{
      name: string;
      role: string;
      background: string;
      credentials: string;
    }>;
    overallAssessment: string;
  };
  investmentConsiderations: string[];
}

export const MOCK_RECOMMENDATION_DATA: RecommendationData = {
  verdict: 'buy',
  confidence: 82,
  overallSummary:
    'This opportunity presents a compelling investment case with strong product-market fit, excellent unit economics, and a capable technical team. The company has achieved impressive early traction with 500 paying customers and $180K ARR growing at 35% MoM. Key risks include competitive threats from big tech and the need to scale the team quickly. Overall, we recommend moving forward with strong confidence.',
  keyStrengths: [
    'Proprietary AI technology with 94% accuracy trained on 10M+ conversations',
    'Strong unit economics: 4.2:1 LTV:CAC ratio, 85% gross margins',
    'Product-market fit evidenced by rapid customer adoption and low churn (12%)',
    'Experienced technical team with relevant AI/ML background from Google',
    'Clear monetization strategy with tiered SaaS pricing ($99-$499/mo)'
  ],
  keyRisks: [
    'Competition from well-funded tech giants (Google, Microsoft, Salesforce)',
    'Small team (15 people) may struggle to scale operations for enterprise customers',
    'Customer concentration risk with top 10 customers accounting for 45% of revenue',
    'Emerging AI regulations could increase compliance costs and affect deployment',
    'Open-source LLM advancement may erode technology differentiation'
  ],
  marketResearch: {
    tam: '$45B - Global customer service software market',
    sam: '$12B - SMB-focused customer support automation market',
    som: '$600M - AI-powered chatbot for SMBs segment (5-year target)',
    cagr: '22% - Market CAGR through 2030',
    analysis:
      'The customer service software market is experiencing rapid growth driven by AI adoption and digital transformation. SMBs represent an underserved segment with significant potential as they seek cost-effective solutions to provide 24/7 support. The shift from traditional call centers to AI-powered automation creates a substantial opportunity.'
  },
  competitorAnalysis: {
    topCompetitors: [
      {
        name: 'Intercom',
        marketShare: '18%',
        strengths: ['Established brand', 'Large customer base', 'Broad platform'],
        weaknesses: ['Higher pricing', 'Less AI-focused', 'Complex onboarding']
      },
      {
        name: 'Drift',
        marketShare: '12%',
        strengths: ['Conversational marketing', 'Enterprise features', 'Strong sales'],
        weaknesses: ['Expensive for SMBs', 'Steep learning curve']
      },
      {
        name: 'Tidio',
        marketShare: '8%',
        strengths: ['Affordable pricing', 'Easy setup', 'SMB focus'],
        weaknesses: ['Basic AI capabilities', 'Limited integrations']
      },
      {
        name: 'Zendesk (AI)',
        marketShare: '15%',
        strengths: ['Market leader', 'Comprehensive suite', 'Enterprise trust'],
        weaknesses: ['Legacy architecture', 'Expensive', 'Complex pricing']
      }
    ],
    positioning:
      'Positioned as an AI-native, SMB-focused solution with superior accuracy at disruptive price points. Differentiated through proprietary NLP model trained specifically on customer service conversations, versus general-purpose competitors.'
  },
  teamVerification: {
    founders: [
      {
        name: 'Dr. Sarah Chen',
        role: 'CEO & Co-founder',
        background:
          'Former Staff ML Engineer at Google (8 years). Led NLP research team. PhD in Computer Science from Stanford. Published 15+ papers on conversational AI.',
        credentials: 'Verified: LinkedIn, Stanford alumni database, Google employment verified'
      },
      {
        name: 'Marcus Rodriguez',
        role: 'CTO & Co-founder',
        background:
          'Two-time founder (exited previous company for $40M). Former Principal Engineer at Meta. 15 years experience building scalable platforms.',
        credentials: 'Verified: LinkedIn, Crunchbase, prior company exit records'
      },
      {
        name: 'Jennifer Walsh',
        role: 'COO',
        background:
          'Head of Customer Support Operations at Stripe (scaled team from 5 to 200). Previously led support at Shopify. 12 years in customer experience leadership.',
        credentials: 'Verified: LinkedIn, Stripe employment verified, reference checks completed'
      }
    ],
    overallAssessment:
      'Strong technical founding team with relevant AI/ML expertise and proven track record. CEO has deep domain knowledge in NLP. CTO brings prior founder experience and scalability expertise. COO adds crucial customer operations background. Team composition is well-balanced with clear areas of responsibility. Reference checks were positive.'
  },
  investmentConsiderations: [
    'Pre-money valuation should consider ARR multiple of 15-20x given growth stage',
    'Use of funds: 40% sales/marketing, 30% engineering, 20% operations, 10% reserve',
    'Governance: Board seat with observer rights, protective provisions for future rounds',
    'Pro-rata rights recommended given strong early traction',
    'Consider milestone-based tranche release to de-risk execution',
    'ESOP pool expansion from 10% to 15% recommended for talent retention'
  ]
};
