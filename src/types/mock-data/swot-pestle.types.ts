/**
 * SWOT & PESTLE Mock Data Types
 */

export interface SwotEvidence {
  quote?: string;
  slideNumber?: number;
  metric?: string;
}

export interface SWOTItem {
  id: string;
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low';
  recommendations?: string[];
  evidence?: SwotEvidence;
  strategicImplications?: string;
}

export interface SWOTData {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

export interface PESTLEItem {
  id: string;
  factor: string;
  impact: string;
  implications: string;
}

export interface PESTLEData {
  political: PESTLEItem[];
  economic: PESTLEItem[];
  social: PESTLEItem[];
  technological: PESTLEItem[];
  legal: PESTLEItem[];
  environmental: PESTLEItem[];
}

export const MOCK_SWOT_DATA: SWOTData = {
  strengths: [
    {
      id: 's1',
      title: 'Proprietary AI Technology',
      description:
        'Custom NLP model trained on 10M+ customer service conversations with 94% accuracy. The model has been validated across multiple industry verticals and continues to improve with each deployment.',
      severity: 'high',
      recommendations: [
        'Highlight accuracy metrics in investor meetings',
        'Prepare technical whitepaper for due diligence',
        'Showcase customer case studies with ROI metrics'
      ],
      evidence: {
        quote: '94% accuracy on customer service conversations',
        slideNumber: 8,
        metric: '10M+ training conversations'
      },
      strategicImplications: 'This technology moat creates defensibility against competitors and supports premium pricing. The continued improvement trajectory suggests expanding advantage over time.'
    },
    {
      id: 's2',
      title: 'Strong Unit Economics',
      description: 'LTV:CAC of 4.2:1, 85% gross margins, clear path to profitability. The business model demonstrates efficient capital deployment and scalable growth mechanics.',
      severity: 'high',
      recommendations: [
        'Emphasize payback period in pitch materials',
        'Show cohort retention charts',
        'Detail the growth reinvestment strategy'
      ],
      evidence: {
        quote: 'LTV:CAC of 4.2:1 with 85% gross margins',
        slideNumber: 12,
        metric: '18-month payback period'
      },
      strategicImplications: 'Exceptional unit economics provide capital efficiency and reduce dilution requirements. The metrics support aggressive growth investment while maintaining healthy margins.'
    },
    {
      id: 's3',
      title: 'Experienced Technical Team',
      description: 'Ex-Google AI lead with proven track record in building scalable ML systems. The technical founding team combines deep expertise in NLP, infrastructure, and enterprise software.',
      severity: 'medium',
      recommendations: [
        'Highlight team credentials and past exits',
        'Showcase technical advisors from leading AI labs',
        'Detail the technical hiring roadmap'
      ],
      evidence: {
        quote: 'Ex-Google AI lead with proven track record',
        slideNumber: 14,
        metric: '3 PhDs in ML/NLP'
      },
      strategicImplications: 'Strong technical team reduces execution risk and enables rapid product iteration. The combination of research and engineering talent supports sustained innovation.'
    },
    {
      id: 's4',
      title: 'Product-Market Fit',
      description: 'Fast traction with 500 paying customers and 35% MoM growth. Customer feedback indicates strong retention and expansion revenue potential.',
      severity: 'high',
      recommendations: [
        'Present net revenue retention metrics',
        'Include customer testimonials and logos',
        'Map out the expansion revenue opportunities'
      ],
      evidence: {
        quote: '500 paying customers with 35% MoM growth',
        slideNumber: 10,
        metric: '92% gross retention rate'
      },
      strategicImplications: 'Strong product-market fit de-risks the investment thesis and suggests efficient customer acquisition. The growth momentum indicates market validation and expansion potential.'
    }
  ],
  weaknesses: [
    {
      id: 'w1',
      title: 'Limited Marketing Budget',
      description: 'Bootstrapped growth so far, need capital to scale customer acquisition. Current reliance on organic and word-of-mouth limits growth velocity.',
      severity: 'medium',
      recommendations: [
        'Present capital-efficient growth strategies',
        'Outline planned marketing spend allocation',
        'Demonstrate scalable customer acquisition channels'
      ],
      evidence: {
        quote: 'Bootstrapped growth with limited paid acquisition',
        slideNumber: 16,
        metric: '$5k monthly marketing spend'
      },
      strategicImplications: 'Limited marketing budget constrains growth acceleration and requires careful capital allocation. The round should include sufficient marketing runway for scaled growth.'
    },
    {
      id: 'w2',
      title: 'Small Team Size',
      description: '15-person team may struggle to support rapid growth and enterprise customers. Scaling challenges include hiring, onboarding, and maintaining quality.',
      severity: 'high',
      recommendations: [
        'Present detailed hiring plan with roles and timeline',
        'Showcase advisors and pending key hires',
        'Outline the outsourcing vs in-house strategy'
      ],
      evidence: {
        quote: '15-person team supporting rapid growth',
        slideNumber: 14,
        metric: '3 open engineering positions'
      },
      strategicImplications: 'Small team creates execution risk and limits support capacity. Rapid hiring is essential but introduces quality and culture challenges. Consider fractional executives for gaps.'
    },
    {
      id: 'w3',
      title: 'Customer Concentration',
      description: 'Top 10 customers account for 45% of revenue, creating concentration risk. Loss of key customers would significantly impact revenue trajectory.',
      severity: 'medium',
      recommendations: [
        'Present customer diversification roadmap',
        'Show enterprise vs SMB customer mix',
        'Detail mitigation strategies and contracts'
      ],
      evidence: {
        quote: 'Top 10 customers account for 45% of revenue',
        slideNumber: 11,
        metric: '3 customers >$100k ARR'
      },
      strategicImplications: 'Customer concentration creates revenue volatility risk. Diversification strategy should prioritize reducing dependency on largest accounts while maintaining growth momentum.'
    }
  ],
  opportunities: [
    {
      id: 'o1',
      title: 'Enterprise Market Expansion',
      description: '$2M+ pipeline indicates strong demand from enterprise segment with higher ACV. Enterprise customers provide revenue stability and expansion revenue potential.',
      severity: 'high',
      recommendations: [
        'Detail enterprise feature requirements and timeline',
        'Showcase pipeline quality and conversion probability',
        'Present enterprise-specific case studies'
      ],
      evidence: {
        quote: '$2M+ pipeline from enterprise segment',
        slideNumber: 18,
        metric: '$75k average enterprise ACV'
      },
      strategicImplications: 'Enterprise expansion represents significant revenue multiple expansion. The higher ACV and retention characteristics improve overall unit economics and business stability.'
    },
    {
      id: 'o2',
      title: 'Platform Expansion',
      description: 'Opportunity to expand beyond chatbots into full AI customer experience platform. Platform approach increases customer lifetime value and switching costs.',
      severity: 'medium',
      recommendations: [
        'Present platform vision and phased rollout',
        'Detail adjacent product opportunities',
        'Showcase customer demand signals'
      ],
      evidence: {
        quote: 'Expansion beyond chatbots into full AI CX platform',
        slideNumber: 20,
        metric: '3 products in development roadmap'
      },
      strategicImplications: 'Platform expansion creates moat through increased switching costs and cross-selling potential. The vision should be validated with customer research before significant investment.'
    },
    {
      id: 'o3',
      title: 'Strategic Partnerships',
      description: 'Integration partnerships with CRM and communication platforms could accelerate distribution. Partnerships provide access to established customer bases.',
      severity: 'medium',
      recommendations: [
        'Detail partnership strategy and target platforms',
        'Present pipeline of partnership discussions',
        'Showcase integration case studies'
      ],
      evidence: {
        quote: 'Integration partnerships with CRM platforms',
        slideNumber: 19,
        metric: '5 active partnership discussions'
      },
      strategicImplications: 'Strategic partnerships provide distribution leverage without proportional customer acquisition cost. Integration depth and partner economics require careful negotiation.'
    },
    {
      id: 'o4',
      title: 'International Markets',
      description: 'Product supports 25+ languages, ready for European and APAC market expansion. International markets represent 3x total addressable market expansion.',
      severity: 'low',
      recommendations: [
        'Prioritize markets by size and fit',
        'Detail localization requirements',
        'Present international go-to-market plan'
      ],
      evidence: {
        quote: 'Product supports 25+ languages',
        slideNumber: 22,
        metric: '60% of TAM outside US'
      },
      strategicImplications: 'International expansion offers significant market opportunity but increases operational complexity. Phased approach with strategic market selection is recommended.'
    }
  ],
  threats: [
    {
      id: 't1',
      title: 'Competition from Big Tech',
      description: 'Google, Microsoft, and Salesforce launching competing AI support solutions. Big tech entry could compress margins and reset customer expectations.',
      severity: 'high',
      recommendations: [
        'Differentiate through vertical specialization',
        'Emphasize speed and customer focus advantages',
        'Detail competitive moats and switching costs'
      ],
      evidence: {
        quote: 'Big tech companies launching competing AI solutions',
        slideNumber: 24,
        metric: '3 major competitors announced'
      },
      strategicImplications: 'Big tech competition represents existential threat if they prioritize this market. Defensibility requires deep vertical integration, customer lock-in, and continuous innovation.'
    },
    {
      id: 't2',
      title: 'AI Regulation',
      description: 'Emerging EU AI Act and US regulations could impact deployment requirements. Regulatory compliance adds cost and may limit use cases.',
      severity: 'medium',
      recommendations: [
        'Detail current compliance posture',
        'Present regulatory monitoring process',
        'Budget for compliance adaptations'
      ],
      evidence: {
        quote: 'EU AI Act and US regulations impacting AI deployment',
        slideNumber: 26,
        metric: '2 compliance reviews scheduled'
      },
      strategicImplications: 'AI regulation creates uncertainty and potential constraints on use cases. Proactive compliance and engagement with regulators can mitigate risk and create advantage.'
    },
    {
      id: 't3',
      title: 'Open Source Alternatives',
      description: 'Growing ecosystem of open-source LLMs that competitors could leverage. Open source advancement narrows technology differentiation.',
      severity: 'medium',
      recommendations: [
        'Emphasize proprietary data advantages',
        'Detail integration and service differentiation',
        'Present technology roadmap beyond base models'
      ],
      evidence: {
        quote: 'Open-source LLMs reducing technology moat',
        slideNumber: 25,
        metric: '15% model cost reduction YoY'
      },
      strategicImplications: 'Open source alternatives commoditize base AI capabilities. Value must shift to proprietary data, workflow integration, and customer outcomes beyond raw model performance.'
    },
    {
      id: 't4',
      title: 'Economic Downturn',
      description: 'SMB churn could increase if economic conditions worsen. Economic sensitivity impacts revenue growth and customer acquisition.',
      severity: 'low',
      recommendations: [
        'Present recession scenario modeling',
        'Detail customer base quality metrics',
        'Showcase cost-saving value proposition'
      ],
      evidence: {
        quote: 'Economic sensitivity of SMB customer base',
        slideNumber: 27,
        metric: '12% current churn rate'
      },
      strategicImplications: 'Economic downturn could impact growth rate and increase churn. Emphasizing ROI and cost-saving value proposition provides resilience. Diversification into enterprise adds stability.'
    }
  ]
};

export const MOCK_PESTLE_DATA: PESTLEData = {
  political: [
    {
      id: 'p1',
      factor: 'EU AI Act Classification',
      impact: 'Medium',
      implications:
        'Product may be classified as "high-risk" AI requiring compliance with strict documentation, transparency, and human oversight requirements. Additional development and legal costs expected.'
    },
    {
      id: 'p2',
      factor: 'US AI Executive Orders',
      impact: 'Low',
      implications:
        'Federal guidelines for AI safety and security could impact product development roadmap. Need to monitor for state-level AI regulations.'
    }
  ],
  economic: [
    {
      id: 'e1',
      factor: 'SMB Spending Patterns',
      impact: 'High',
      implications:
        'Economic uncertainty could reduce SMB software spend. Churn may increase from current 12% if cost-cutting measures intensify.'
    },
    {
      id: 'e2',
      factor: 'Interest Rate Environment',
      impact: 'Medium',
      implications:
        'Higher rates increase cost of capital for next fundraising round. Valuation pressure may impact investor appetite for SaaS multiples.'
    },
    {
      id: 'e3',
      factor: 'Labor Market Dynamics',
      impact: 'Positive',
      implications:
        'Tight labor market and rising support staff costs strengthen value proposition for automation solutions. ROI for customers increases.'
    }
  ],
  social: [
    {
      id: 's1',
      factor: 'Customer Expectations',
      impact: 'Positive',
      implications:
        'Growing consumer expectation for 24/7 instant support. 73% of customers prefer instant messaging over phone. Trend favors product.'
    },
    {
      id: 's2',
      factor: 'AI Adoption Acceptance',
      impact: 'Medium',
      implications:
        'Business acceptance of AI solutions increasing but trust concerns remain. Need transparency about AI capabilities and limitations.'
    },
    {
      id: 's3',
      factor: 'Remote Work Trends',
      impact: 'Positive',
      implications:
        'Distributed teams increase need for automated customer support. Remote-first businesses key target segment.'
    }
  ],
  technological: [
    {
      id: 't1',
      factor: 'LLM Advancement',
      impact: 'High',
      implications:
        'Rapid improvement in open-source LLMs could reduce technology moat. Must maintain innovation edge through proprietary training data.'
    },
    {
      id: 't2',
      factor: 'Integration Ecosystem',
      impact: 'Positive',
      implications:
        'Growing API-first approach in SaaS enables easier integrations with CRM, helpdesk, and communication platforms.'
    },
    {
      id: 't3',
      factor: 'Compute Costs',
      impact: 'Medium',
      implications:
        'GPU costs for inference remain significant. Need to optimize model efficiency and consider edge computing options.'
    }
  ],
  legal: [
    {
      id: 'l1',
      factor: 'Data Privacy Regulations',
      impact: 'High',
      implications:
        'GDPR, CCPA, and similar regulations require strict data handling. SOC 2 Type II certification essential for enterprise sales.'
    },
    {
      id: 'l2',
      factor: 'AI Liability Frameworks',
      impact: 'Medium',
      implications:
        'Evolving legal frameworks around AI-generated content liability. Clear terms of service and indemnification provisions required.'
    }
  ],
  environmental: [
    {
      id: 'en1',
      factor: 'AI Energy Consumption',
      impact: 'Low',
      implications:
        'Growing scrutiny on AI environmental impact. Carbon footprint disclosure may become requirement. Opportunity to market efficient AI.'
    },
    {
      id: 'en2',
      factor: 'ESG Considerations',
      impact: 'Low',
      implications:
        'Enterprise customers increasingly require ESG disclosures. AI governance and ethical AI practices becoming procurement criteria.'
    }
  ]
};
