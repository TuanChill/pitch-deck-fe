import { VC_CATEGORIES } from '@/constants/vc-framework';
import type {
  PitchDeckAnalysisResponse,
  VCCategory,
  VCCategoryScore,
  StrengthItem,
  ImprovementItem,
  CompetitiveAnalysis,
  EvidenceQuote
} from '@/types/response/pitch-deck';
import { calculateWeightedScore } from '@/utils/score-calculator';

const STRENGTH_TEMPLATES: Record<VCCategory, string[]> = {
  teamAndFounders: [
    'Founders have previous successful exits in this space',
    'Strong technical background with relevant domain expertise',
    'Advisory board includes industry veterans',
    'Well-rounded team with complementary skill sets',
    'Clear leadership structure with defined roles'
  ],
  marketSize: [
    'Addressing a multi-billion dollar market opportunity',
    'Clear TAM/SAM/SOM breakdown with supporting data',
    'Market growing at 20%+ CAGR with favorable trends',
    'Underserved segment with clear whitespace opportunity',
    'Regulatory tailwinds supporting market expansion'
  ],
  productSolution: [
    'Clear value proposition with demonstrated product-market fit',
    'Unique technology with defensible IP positioning',
    'Solves urgent pain point for target customers',
    'Scalable solution with network effects potential',
    'Strong user feedback and validation data'
  ],
  traction: [
    'Impressive revenue growth with strong unit economics',
    'Significant user base with high engagement metrics',
    'Strategic partnerships with major industry players',
    'Strong customer retention with low churn rates',
    'Clear path to profitability demonstrated'
  ],
  businessModel: [
    'Clear revenue streams with diversified monetization',
    'Strong unit economics with positive LTV/CAC ratio',
    'Scalable model with low marginal costs',
    'Recurring revenue providing predictable cash flow',
    'Clear path to improving margins at scale'
  ],
  competition: [
    'Clear differentiation from existing market solutions',
    'Defensible moat through technology or network effects',
    'First-mover advantage in emerging category',
    'Strong brand positioning with customer loyalty',
    'Unique distribution channel advantage'
  ],
  financials: [
    'Realistic projections with sound underlying assumptions',
    'Clear path to profitability within 24 months',
    'Appropriate use of proceeds with defined milestones',
    'Conservative estimates with upside scenarios',
    'Strong cash flow management strategy'
  ]
};

const IMPROVEMENT_TEMPLATES: Record<VCCategory, string[]> = {
  teamAndFounders: [
    'Add more detail on key hires and recruiting plans',
    'Include relevant advisors and their contributions',
    'Clarify founder equity split and vesting schedule',
    'Add more detail on team structure and org chart',
    'Include team photos to build investor connection'
  ],
  marketSize: [
    'Strengthen market sizing with primary research data',
    'Include sources for market size claims',
    'Add more detail on target customer segments',
    'Break down go-to-market approach for each segment',
    'Include competitive positioning map'
  ],
  productSolution: [
    'Add more customer testimonials or case studies',
    'Include product screenshots or demo video',
    'Clarify technology differentiation with IP details',
    'Add roadmap with development timeline',
    'Include user metrics showing engagement'
  ],
  traction: [
    'Add growth charts showing key metrics over time',
    'Include customer logos and testimonials',
    'Add cohort analysis showing retention',
    'Include revenue run rate and growth trajectory',
    'Add more detail on customer acquisition channels'
  ],
  businessModel: [
    'Clarify unit economics with CAC/LTV breakdown',
    'Add more detail on revenue streams and pricing',
    'Include customer lifetime value calculation',
    'Add contribution margin analysis',
    'Include churn analysis and improvement strategies'
  ],
  competition: [
    'Include competitive matrix with feature comparison',
    'Add positioning map showing market differentiation',
    'Clarify competitive moat and sustainability',
    'Include response to competitive threats',
    'Add market share analysis'
  ],
  financials: [
    'Add sensitivity analysis for key assumptions',
    'Include monthly cash flow for first 18 months',
    'Add more detail on burn rate and runway',
    'Include scenario analysis (base/bear/bull)',
    'Clarify funding needs and use of proceeds'
  ]
};

const randomScore = (): number => Math.floor(Math.random() * 40) + 60;

const randomItem = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const randomItems = <T>(items: T[], count: number): T[] => {
  const shuffled = [...items].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count);
};

const generateId = (): string => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const generateCategoryScores = (): VCCategoryScore => {
  return {
    teamAndFounders: { score: randomScore(), weight: 0.25 },
    marketSize: { score: randomScore(), weight: 0.2 },
    productSolution: { score: randomScore(), weight: 0.15 },
    traction: { score: randomScore(), weight: 0.15 },
    businessModel: { score: randomScore(), weight: 0.15 },
    competition: { score: randomScore(), weight: 0.1 },
    financials: { score: randomScore(), weight: 0.05 }
  };
};

const generateStrengths = (categories: VCCategory[]): StrengthItem[] => {
  const items: StrengthItem[] = [];
  const impactLevels: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];

  categories.forEach((category) => {
    const count = Math.floor(Math.random() * 2) + 1;
    const templates = randomItems(STRENGTH_TEMPLATES[category], count);

    templates.forEach((template) => {
      const evidence: EvidenceQuote[] = [
        {
          text: `${template} (Slide ${Math.floor(Math.random() * 12) + 1})`,
          slide: Math.floor(Math.random() * 12) + 1,
          category
        }
      ];

      items.push({
        id: generateId(),
        title: template.split(' ').slice(0, 5).join(' ') + '...',
        description: template,
        evidence,
        impact: randomItem(impactLevels),
        category
      });
    });
  });

  return items.sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };

    return impactOrder[a.impact] - impactOrder[b.impact];
  });
};

const generateImprovements = (categories: VCCategory[]): ImprovementItem[] => {
  const items: ImprovementItem[] = [];
  const severityLevels: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];

  categories.forEach((category) => {
    const count = Math.floor(Math.random() * 2) + 1;
    const templates = randomItems(IMPROVEMENT_TEMPLATES[category], count);

    templates.forEach((template) => {
      items.push({
        id: generateId(),
        title: template.split(' ').slice(0, 5).join(' ') + '...',
        description: template,
        recommendation: `Consider ${template.toLowerCase()}`,
        severity: randomItem(severityLevels),
        priority: Math.floor(Math.random() * 10) + 1,
        category
      });
    });
  });

  return items.sort((a, b) => a.priority - b.priority);
};

const generateCompetitiveAnalysis = (): CompetitiveAnalysis => {
  return {
    positioning: [
      { id: generateId(), name: 'Your Startup', x: 75, y: 80, isUser: true },
      { id: generateId(), name: 'Competitor A', x: 60, y: 65, isUser: false },
      { id: generateId(), name: 'Competitor B', x: 80, y: 55, isUser: false },
      { id: generateId(), name: 'Competitor C', x: 50, y: 70, isUser: false },
      { id: generateId(), name: 'Competitor D', x: 70, y: 45, isUser: false }
    ],
    differentiators: [
      {
        id: generateId(),
        aspect: 'Technology',
        userScore: 85,
        competitorAvg: 65,
        description: 'Superior technology stack with unique IP'
      },
      {
        id: generateId(),
        aspect: 'Customer Experience',
        userScore: 78,
        competitorAvg: 70,
        description: 'Best-in-class user experience'
      },
      {
        id: generateId(),
        aspect: 'Pricing',
        userScore: 72,
        competitorAvg: 68,
        description: 'Competitive pricing with better value'
      },
      {
        id: generateId(),
        aspect: 'Speed to Market',
        userScore: 80,
        competitorAvg: 60,
        description: 'Faster deployment and onboarding'
      }
    ],
    marketOpportunity: {
      size: '$4.2B TAM / $850M SAM / $120M SOM',
      growth: '22% CAGR',
      trend: 'rising'
    }
  };
};

export const generateMockAnalysis = (
  uploadId: string,
  filename: string
): PitchDeckAnalysisResponse => {
  const categoryScores = generateCategoryScores();
  const overallScore = calculateWeightedScore(categoryScores);
  const categories = VC_CATEGORIES as VCCategory[];

  return {
    uploadId,
    filename,
    overallScore,
    categoryScores,
    strengths: generateStrengths(categories),
    improvements: generateImprovements(categories),
    competitiveAnalysis: generateCompetitiveAnalysis(),
    analyzedAt: new Date().toISOString()
  };
};

// Letter grade conversion (A-F scale)
export const getScoreGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';

  return 'F';
};
