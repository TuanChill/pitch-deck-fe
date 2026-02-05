/**
 * Summary Mock Data Types
 */

import type { SummaryDecision } from '@/types/domain';

export interface SummaryData {
  oneLiner: string;
  problem: string;
  solution: string;
  market: string;
  product: string;
  traction: string;
  businessModel: string;
  moat: string;
  team: string;
  fundraising: string;
  overallScore: number;
  decision: SummaryDecision;
}

export const MOCK_SUMMARY_DATA: SummaryData = {
  oneLiner:
    'AI-powered platform helping SMBs automate customer support with 24/7 intelligent chatbots',
  problem:
    'Small businesses struggle to provide 24/7 customer support due to limited resources and high staffing costs',
  solution:
    'SaaS platform with AI chatbots that learn from business data and handle 80% of customer inquiries automatically',
  market: '$45B global customer service software market, 22% CAGR, 15M SMB target in US alone',
  product:
    'Cloud-based SaaS with NLP engine, integration hub, analytics dashboard, and multi-channel support',
  traction: '500 paying customers, $180K ARR, 35% MoM growth, 12% churn, enterprise pipeline $2M+',
  businessModel: 'SaaS subscription: $99-$499/mo tiered pricing, 85% gross margins, LTV:CAC 4.2:1',
  moat: 'Proprietary NLP trained on 10M+ conversations, network effects from customer data, switching costs',
  team: 'Ex-Google AI lead (CEO), 2x founder (CTO), scaled support ops at Stripe (COO), 15 engineers',
  fundraising:
    'Raising $3M Seed for 18-month runway to scale sales, expand AI capabilities, grow team to 30',
  overallScore: 78,
  decision: 'deep_dive'
};
