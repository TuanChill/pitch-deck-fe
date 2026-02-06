# Type Definitions Documentation

This document provides comprehensive documentation for the TypeScript type definitions used throughout the pitch deck management system.

## Table of Contents

1. [Response Types](#response-types)
2. [Domain Types](#domain-types)
3. [Request Types](#request-types)
4. [Pipeline Types](#pipeline-types)
5. [Integration Patterns](#integration-patterns)
6. [Migration Guide](#migration-guide)

---

## Response Types

### Pitch Deck Response Types

#### UploadPitchDeckResponse

```typescript
export type UploadPitchDeckResponse = {
  uuid: string; // Unique identifier for the upload
  filename: string; // Original filename
  fileSize: number; // File size in bytes
  fileType: string; // MIME type
  uploadedAt: string; // ISO timestamp
};
```

#### PitchDeckListItem

```typescript
export type PitchDeckListItem = {
  id: string; // Database primary key
  title: string; // Deck title
  description: string | null; // Deck description
  status: PitchDeckStatus; // Current status
  chunkCount: number; // Number of text chunks
  astraCollection?: string; // AstraDB collection name
  errorMessage: string | null; // Error details
  fileCount: number; // Number of files
  tags?: string[] | null; // User tags
  files?: PitchDeckFileResponse[]; // File details
  lastAccessedAt: string | Long; // Last access timestamp
  createdAt: string | Long; // Creation timestamp
  updatedAt: string | Long; // Last update timestamp
};
```

#### PitchDeckFileResponse

```typescript
export type PitchDeckFileResponse = {
  uuid: string; // File UUID
  originalFileName: string; // Original filename
  mimeType: string; // MIME type (PDF, PPTX, etc.)
  fileSize: number; // File size in bytes
  status: PitchDeckStatus; // File processing status
  storagePath: string; // File system path
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
};
```

### Analysis Response Types

#### AnalysisStatus

```typescript
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';
```

#### AgentStatus

```typescript
export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed';
```

#### AgentInfo

```typescript
export type AgentInfo = {
  agentName: string; // Backend agent identifier
  status: AgentStatus; // Current execution status
  executionOrder: number; // Sequence number
  errorMessage?: string; // Error details if failed
};
```

#### AnalysisStatusResponse

```typescript
export type AnalysisStatusResponse = {
  id: string; // Database ID
  uuid: string; // Analysis UUID
  status: AnalysisStatus; // Overall status
  progress: number; // Progress percentage (0-100)
  message?: string; // Status message
  currentStep?: string; // Currently executing step
  agents?: AgentInfo[]; // Individual agent status
  updatedAt: string; // Last update timestamp
};
```

#### AnalysisResponse

```typescript
export type AnalysisResponse = {
  id: string; // Database ID
  uuid: string; // Analysis UUID
  deckId: string; // Associated pitch deck UUID
  status: AnalysisStatus; // Current status
  progress: number; // Progress percentage
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
  completedAt?: string; // Completion timestamp
  errorMessage?: string; // Error details
  results?: AnalysisResult; // Analysis results if completed
};
```

#### AnalysisResult

```typescript
export type AnalysisResult = {
  overallScore: number; // Overall score (0-100)
  categoryScores: VCCategoryScore; // Scores by category
  strengths: StrengthItem[]; // Identified strengths
  improvements: ImprovementItem[]; // Suggested improvements
  competitiveAnalysis?: CompetitiveAnalysis; // Competitive positioning
  analyzedAt: string; // Analysis timestamp
};
```

### VC Framework Types

#### VCCategory

```typescript
export type VCCategory =
  | 'teamAndFounders'
  | 'marketSize'
  | 'productSolution'
  | 'traction'
  | 'businessModel'
  | 'competition'
  | 'financials';
```

#### VCCategoryScore

```typescript
export type VCCategoryScore = {
  [K in VCCategory]: {
    score: number; // Score (0-100)
    weight: number; // Category weight
    details?: string; // Detailed explanation
  };
};
```

#### StrengthItem

```typescript
export type StrengthItem = {
  id: string; // Unique identifier
  title: string; // Strength title
  description: string; // Detailed description
  evidence: EvidenceQuote[]; // Supporting evidence
  impact: ImpactLevel; // Impact assessment
  category: VCCategory; // VC category
};
```

#### ImprovementItem

```typescript
export type ImprovementItem = {
  id: string; // Unique identifier
  title: string; // Improvement title
  description: string; // Detailed description
  recommendation: string; // Recommendation text
  severity: SeverityLevel; // Severity level
  priority: number; // Priority order
  category: VCCategory; // VC category
};
```

#### CompetitiveAnalysis

```typescript
export type CompetitiveAnalysis = {
  positioning: CompetitivePosition[]; // Market positioning map
  differentiators: Differentiator[]; // Key differentiators
  marketOpportunity: {
    // Market analysis
    size: string; // TAM
    growth: string; // Growth rate
    trend: 'rising' | 'stable' | 'declining'; // Market trend
  };
};
```

---

## Domain Types

### Evaluation Types

#### CategoryEvaluation

```typescript
export type CategoryEvaluation = {
  category: VCCategory; // VC category
  score: number; // Current score (0-100)
  maxScore: number; // Maximum possible score
  weight: number; // Category weight
  details: string; // Detailed evaluation
  evidence: EvidenceQuote[]; // Supporting evidence
  recommendations: string[]; // Improvement recommendations
  lastUpdated: string; // Evaluation timestamp
};
```

#### EvidenceQuote

```typescript
export type EvidenceQuote = {
  text: string; // Evidence text
  slide?: number; // Source slide number
  category: VCCategory; // Related category
  confidence: number; // Confidence level (0-100)
};
```

#### ImpactLevel

```typescript
export type ImpactLevel = 'high' | 'medium' | 'low';
```

#### SeverityLevel

```typescript
export type SeverityLevel = 'high' | 'medium' | 'low';
```

### Metrics Types

#### StartupMetrics

```typescript
export type StartupMetrics = {
  marketCap?: number; // Market capitalization
  revenue?: number; // Annual revenue
  growthRate?: number; // Year-over-year growth
  employeeCount: number; // Number of employees
  fundingStage: string; // Current funding stage
  valuation?: number; // Company valuation
  foundedAt: string; // Company founding date
};
```

#### MarketData

```typescript
export type MarketData = {
  tam: string; // Total Addressable Market
  sam: string; // Serviceable Addressable Market
  som: string; // Serviceable Obtainable Market
  growthRate: string; // Market growth rate
  marketTrend: 'rising' | 'stable' | 'declining'; // Market trend
  competitorCount: number; // Number of competitors
  marketShare?: number; // Current market share
};
```

### UI State Types

#### PipelineStage

```typescript
export type PipelineStage = {
  id: string; // Stage identifier
  name: string; // Display name
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // Progress percentage (0-100)
  startTime?: string; // Start timestamp
  endTime?: string; // End timestamp
  error?: string; // Error message if failed
};
```

#### PipelineStore

```typescript
export type PipelineStore = {
  analysisUuid: string | null; // Current analysis UUID
  overallStatus: string | null; // Overall analysis status
  overallProgress: number; // Overall progress percentage
  stages: Record<string, PipelineStage>; // Individual stages
  currentStage: string | null; // Currently executing stage
  isPolling: boolean; // Whether polling is active
  pollCount: number; // Number of poll attempts
  error: string | null; // Error message
};
```

#### EnhancedSWOTItem

```typescript
export type EnhancedSWOTItem = {
  id: string; // Unique identifier
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string; // Item title
  description: string; // Detailed description
  impact: ImpactLevel; // Impact level
  confidence: number; // Confidence level (0-100)
  priority: number; // Priority order
  source: string; // Evidence source
  relatedCategory?: VCCategory; // Related VC category
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
};
```

---

## Request Types

### Pitch Deck Request Types

#### UploadPitchDeckRequest

```typescript
export type UploadPitchDeckRequest = {
  files: File[]; // Files to upload
  title?: string; // Deck title
  description?: string; // Deck description
  tags?: string[]; // User tags
};
```

#### ListPitchDecksQuery

```typescript
export type ListPitchDecksQuery = {
  page?: number; // Page number (default: 1)
  limit?: number; // Items per page (default: 10)
  status?: PitchDeckStatus; // Filter by status
  tags?: string[]; // Filter by tags
};
```

#### StartAnalysisRequest

```typescript
export type StartAnalysisRequest = {
  deckId: string; // Pitch deck UUID
  options?: {
    includeCompetitive?: boolean; // Include competitive analysis
    includeRecommendation?: boolean; // Include investment recommendation
  };
};
```

### Recommendation Request Types

#### GenerateRecommendationRequest

```typescript
export type GenerateRecommendationRequest = {
  deckId: string; // Pitch deck UUID
  analysisUuid?: string; // Optional analysis UUID
  includeMarket: boolean; // Include market research
  includeCompetitors: boolean; // Include competitor analysis
  includeTeam: boolean; // Include team verification
};
```

---

## Pipeline Types

### Pipeline Stage Types

#### PipelineStageOrder

```typescript
export const PIPELINE_STAGE_ORDER = [
  'extract',
  'summary',
  'analytics',
  'swot',
  'pestle',
  'recommendation'
] as const;
```

#### PipelineStageLabels

```typescript
export const PIPELINE_STAGE_LABELS: Record<string, string> = {
  extract: 'Extract Content',
  summary: 'Generate Summary',
  analytics: 'VC Framework Analysis',
  swot: 'SWOT Analysis',
  pestle: 'PESTLE Analysis',
  recommendation: 'Investment Recommendation'
};
```

#### AgentToStageMapping

```typescript
export const AGENT_TO_STAGE_MAP: Record<string, string> = {
  'Sector Match Agent': 'analytics',
  'Stage Match Agent': 'analytics',
  'Thesis Overlap Agent': 'analytics',
  'History Behavior Agent': 'analytics',
  'Strengths Agent': 'swot',
  'Weaknesses Agent': 'swot',
  'Competitive Agent': 'swot',
  'Overall Assessment Agent': 'analytics',
  'Market Opportunity Agent': 'analytics',
  'Business Model Agent': 'analytics',
  'Team Execution Agent': 'analytics',
  'Financial Projections Agent': 'analytics',
  'Competitive Landscape Agent': 'analytics'
};
```

### Analysis State Types

#### AnalysisPollingConfig

```typescript
export const DEFAULT_POLL_CONFIG = {
  maxAttempts: 30, // Maximum polling attempts
  initialDelay: 1000, // Initial delay (1 second)
  maxDelay: 30000, // Maximum delay (30 seconds)
  jitterFactor: 0.5 // Random jitter factor
} as const;
```

#### AnalysisStatusConfig

```typescript
export const COMPLETED_STATUSES = ['completed', 'failed'] as const;
export const TERMINAL_STATUSES = [...COMPLETED_STATUSES] as const;
```

---

## Integration Patterns

### API Integration

#### Service Layer Types

```typescript
// Base service configuration
export interface ServiceConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}
```

#### Error Handling Types

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### State Management Types

#### Zustand Store Pattern

```typescript
// Generic store interface
export interface Store<T extends object, A extends object> {
  state: T;
  actions: A;
}

// Example: User store
export interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface UserActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export type UserStore = Store<UserState, UserActions>;
```

### Component Props Types

#### Base Component Props

```typescript
interface BaseComponentProps {
  className?: string; // CSS classes
  children?: React.ReactNode; // Child components
  id?: string; // Component ID
  'data-testid'?: string; // Test ID
}

interface LoadingProps extends BaseComponentProps {
  isLoading: boolean; // Loading state
  loadingText?: string; // Loading message
}

interface ErrorProps extends BaseComponentProps {
  error: string | Error; // Error message
  onRetry?: () => void; // Retry handler
}
```

---

## Migration Guide

### Upgrading from v0.1.0 to v0.2.0

#### Breaking Changes

1. **Response Type Changes**

```typescript
// Before (v0.1.0)
export type PitchDeckResponse = {
  id: string;
  filename: string;
  originalFileName: string;
  // ... other fields
};

// After (v0.2.0)
export type PitchDeckListItem = {
  id: string;
  title: string;
  description: string | null;
  // ... split into files array
  files?: PitchDeckFileResponse[];
};
```

2. **New Agent Types**

```typescript
// New in v0.2.0
export type AgentInfo = {
  agentName: string;
  status: AgentStatus;
  executionOrder: number;
  errorMessage?: string;
};

export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed';
```

#### Deprecations

- `PitchDeckResponse` → Use `PitchDeckListItem`
- `AnalysisResultResponse` → Use `AnalysisResponse`

### Upgrading from v0.2.0 to v0.3.0

#### New Features

1. **Enhanced Domain Types**

```typescript
// New evaluation types
export type CategoryEvaluation = {
  category: VCCategory;
  score: number;
  maxScore: number;
  weight: number;
  details: string;
  evidence: EvidenceQuote[];
  recommendations: string[];
  lastUpdated: string;
};
```

2. **Pipeline Stage Types**

```typescript
// New pipeline types
export type PipelineStage = {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime?: string;
  endTime?: string;
  error?: string;
};
```

#### Type Safety Improvements

```typescript
// Before (loose typing)
export type AnalysisStatus = string;

// After (strict typing)
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';
```

### Migration Checklist

#### For Response Types

- [ ] Replace `PitchDeckResponse` with `PitchDeckListItem`
- [ ] Update file access to use `files[]` array
- [ ] Add error handling for new error types

#### For Analysis Types

- [ ] Use new `AgentInfo` type for agent status
- [ ] Update polling logic to use `AnalysisStatusResponse`
- [ ] Implement agent-stage mapping

#### For Domain Types

- [ ] Update to use new evaluation types
- [ ] Add support for enhanced SWOT items
- [ ] Implement new metrics types

---

## Best Practices

### 1. Type Safety

#### Use Strict Types

```typescript
// Good: Specific types
type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Bad: Any type
type AnalysisStatus = any;
```

#### Interface Extends

```typescript
// Extend base interfaces
export interface EnhancedAnalysisResponse extends AnalysisResponse {
  enhancedMetrics: EnhancedMetrics[];
  aiInsights: AIInsight[];
}
```

### 2. Naming Conventions

#### PascalCase for Types

```typescript
// Good
interface ApiResponse {}
type AnalysisStatus = 'pending' | 'processing';

// Bad
interface apiResponse {}
type analysisStatus = string;
```

#### KebabCase for Files

```typescript
// Good
src / types / response / pitch - deck.ts;
src / hooks / use - pipeline - auto - start.ts;

// Bad
src / types / response / PitchDeck.ts;
src / hooks / usePipelineAutoStart.ts;
```

### 3. Organization

#### Logical Grouping

```typescript
// Group related types
export type {
  // Response types
  PitchDeckResponse,
  AnalysisResponse,

  // Domain types
  CategoryEvaluation,
  VCCategoryScore,

  // Request types
  UploadRequest,
  StartAnalysisRequest
} from './pitch-deck-types';
```

#### Index Files

```typescript
// Clean imports
export * from './response-types';
export * from './domain-types';
export * from './request-types';
```

### 4. Documentation

#### JSDoc Comments

```typescript
/**
 * Represents the analysis status response from the backend
 * @property id - Database ID of the analysis
 * @property uuid - Unique identifier for the analysis
 * @property status - Current analysis status
 * @property progress - Progress percentage (0-100)
 * @property agents - Array of agent execution information
 */
export type AnalysisStatusResponse = {
  id: string;
  uuid: string;
  status: AnalysisStatus;
  progress: number;
  agents?: AgentInfo[];
  updatedAt: string;
};
```

### 5. Testing

#### Mock Data Types

```typescript
// Test fixtures
const mockAnalysisResponse: AnalysisResponse = {
  id: '1',
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  deckId: '550e8400-e29b-41d4-a716-446655440001',
  status: 'completed',
  progress: 100,
  createdAt: '2026-02-06T00:00:00Z',
  updatedAt: '2026-02-06T00:05:00Z',
  results: mockAnalysisResult
};
```

---

## Troubleshooting

### Common Type Issues

#### Type Mismatches

```typescript
// Problem: Type mismatch in API response
// Solution: Use proper typing
const handleResponse = (response: unknown) => {
  if (!isApiResponse(response)) {
    throw new Error('Invalid response format');
  }
  return response.data;
};
```

#### Missing Properties

```typescript
// Problem: Missing optional properties
// Solution: Use null checks
const handleAnalysis = (analysis: AnalysisResponse) => {
  if (analysis.results?.competitiveAnalysis) {
    // Safe to access
  }
};
```

#### Generic Type Constraints

```typescript
// Problem: Generic type without constraints
// Solution: Add proper constraints
function useApiData<T extends ApiResponse>(url: string) {
  // Implementation
}
```

---

_**Last Updated**: 2026-02-06_
_**Version**: v0.3.0_
_**Maintainer**: TBX/Capylabs Development Team_
