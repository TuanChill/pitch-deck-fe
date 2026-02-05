/**
 * SWOT & PESTLE Mock Data Types
 */

export interface SWOTItem {
  id: string;
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low';
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
        'Custom NLP model trained on 10M+ customer service conversations with 94% accuracy',
      severity: 'high'
    },
    {
      id: 's2',
      title: 'Strong Unit Economics',
      description: 'LTV:CAC of 4.2:1, 85% gross margins, clear path to profitability',
      severity: 'high'
    },
    {
      id: 's3',
      title: 'Experienced Technical Team',
      description: 'Ex-Google AI lead with proven track record in building scalable ML systems',
      severity: 'medium'
    },
    {
      id: 's4',
      title: 'Product-Market Fit',
      description: 'Fast traction with 500 paying customers and 35% MoM growth',
      severity: 'high'
    }
  ],
  weaknesses: [
    {
      id: 'w1',
      title: 'Limited Marketing Budget',
      description: 'Bootstrapped growth so far, need capital to scale customer acquisition',
      severity: 'medium'
    },
    {
      id: 'w2',
      title: 'Small Team Size',
      description: '15-person team may struggle to support rapid growth and enterprise customers',
      severity: 'high'
    },
    {
      id: 'w3',
      title: 'Customer Concentration',
      description: 'Top 10 customers account for 45% of revenue, creating concentration risk',
      severity: 'medium'
    }
  ],
  opportunities: [
    {
      id: 'o1',
      title: 'Enterprise Market Expansion',
      description: '$2M+ pipeline indicates strong demand from enterprise segment with higher ACV',
      severity: 'high'
    },
    {
      id: 'o2',
      title: 'Platform Expansion',
      description:
        'Opportunity to expand beyond chatbots into full AI customer experience platform',
      severity: 'medium'
    },
    {
      id: 'o3',
      title: 'Strategic Partnerships',
      description:
        'Integration partnerships with CRM and communication platforms could accelerate distribution',
      severity: 'medium'
    },
    {
      id: 'o4',
      title: 'International Markets',
      description: 'Product supports 25+ languages, ready for European and APAC market expansion',
      severity: 'low'
    }
  ],
  threats: [
    {
      id: 't1',
      title: 'Competition from Big Tech',
      description: 'Google, Microsoft, and Salesforce launching competing AI support solutions',
      severity: 'high'
    },
    {
      id: 't2',
      title: 'AI Regulation',
      description: 'Emerging EU AI Act and US regulations could impact deployment requirements',
      severity: 'medium'
    },
    {
      id: 't3',
      title: 'Open Source Alternatives',
      description: 'Growing ecosystem of open-source LLMs that competitors could leverage',
      severity: 'medium'
    },
    {
      id: 't4',
      title: 'Economic Downturn',
      description: 'SMB churn could increase if economic conditions worsen',
      severity: 'low'
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
