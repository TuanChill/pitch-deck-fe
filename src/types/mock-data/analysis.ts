import type { AnalysisResponse } from '@/types/response/pitch-deck';

/**
 * Mock analysis data for development/demo
 */
export const MOCK_ANALYSIS: AnalysisResponse = {
  id: 'mock-analysis-id',
  uuid: 'mock-uuid',
  deckId: 'mock-deck-id',
  status: 'completed',
  progress: 100,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
  results: {
    overallScore: 78,
    categoryScores: {
      teamAndFounders: { score: 75, weight: 0.2 },
      marketSize: { score: 80, weight: 0.15 },
      productSolution: { score: 82, weight: 0.2 },
      traction: { score: 70, weight: 0.15 },
      businessModel: { score: 76, weight: 0.15 },
      competition: { score: 78, weight: 0.1 },
      financials: { score: 72, weight: 0.05 }
    },
    strengths: [
      {
        id: 's1',
        title: 'Strong Value Proposition',
        description: 'Clear problem-solution fit with AI-powered automation',
        evidence: [
          {
            text: '24/7 intelligent chatbots for customer support',
            category: 'productSolution'
          }
        ],
        impact: 'high',
        category: 'productSolution'
      },
      {
        id: 's2',
        title: 'Large Target Market',
        description: 'SMBs represent a significant underserved market',
        evidence: [
          {
            text: 'Helping SMBs automate customer support',
            category: 'marketSize'
          }
        ],
        impact: 'high',
        category: 'marketSize'
      }
    ],
    improvements: [
      {
        id: 'i1',
        title: 'Add Traction Metrics',
        description: 'Include key metrics like customer count, retention, revenue',
        recommendation: 'Add a slide with traction metrics to demonstrate market validation',
        severity: 'high',
        priority: 1,
        category: 'traction'
      },
      {
        id: 'i2',
        title: 'Strengthen Team Section',
        description: 'Highlight relevant experience and technical expertise',
        recommendation: 'Add team backgrounds and previous exits if applicable',
        severity: 'medium',
        priority: 2,
        category: 'teamAndFounders'
      }
    ],
    competitiveAnalysis: {
      positioning: [
        { id: 'p1', name: 'You', x: 7, y: 8, isUser: true },
        { id: 'p2', name: 'Competitor A', x: 5, y: 6, isUser: false },
        { id: 'p3', name: 'Competitor B', x: 8, y: 5, isUser: false }
      ],
      differentiators: [
        {
          id: 'd1',
          aspect: 'AI Technology',
          userScore: 85,
          competitorAvg: 65,
          description: 'Advanced NLP capabilities for better understanding'
        }
      ],
      marketOpportunity: {
        size: '$50B',
        growth: '15% CAGR',
        trend: 'rising'
      }
    },
    analyzedAt: new Date().toISOString()
  }
};
