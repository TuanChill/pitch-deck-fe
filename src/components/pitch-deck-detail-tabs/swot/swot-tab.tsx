/**
 * SWOT Tab
 * SWOT analysis tab with mock data
 */

import type { SWOTData } from '@/types/mock-data/swot-pestle.types';

import { SWOTGrid } from './swot-grid';

// This will be replaced with real data from the store in the future
const MOCK_SWOT_DATA: SWOTData = {
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
    }
  ]
};

export function SwotTab() {
  return <SWOTGrid data={MOCK_SWOT_DATA} />;
}
