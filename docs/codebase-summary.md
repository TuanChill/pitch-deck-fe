# Codebase Summary

This document provides a comprehensive overview of the pitch deck management system codebase, including architecture, patterns, and key components.

## Project Overview

**Project:** Pitch Deck Management System
**Technology Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand
**Phase:** Foundation Layer (v0.1.0)

## Architecture Overview

### 1. Core Architecture Pattern

The application follows a clean architecture with clear separation of concerns:

```
src/
├── app/                    # Next.js App Router pages
├── components/            # UI components (organized by domain)
├── config/               # Configuration files
├── constants/            # Application constants and enums
├── hooks/                # Custom React hooks
├── lib/                  # External library configurations
├── providers/            # Context providers
├── services/             # API services and HTTP client
├── stores/               # State management (Zustand)
├── types/                # TypeScript type definitions
└── utils/                # Utility functions and helpers
```

### 2. Service Layer Pattern

Strict separation between API logic and UI components:

- **HTTP Client** (`src/services/http/client.ts`): Axios instance with JWT interceptors
- **API Services** (`src/services/api/`): Domain-specific service modules
- **Type Safety**: Comprehensive request/response type definitions

### 3. State Management

Zustand stores with localStorage persistence:

- User authentication store with JWT handling
- Pitch deck store for managing upload states and analysis results
- Automatic token attachment via HTTP interceptors

## Key Components

### Pitch Deck Management System

#### 1. Status Management (`src/constants/pitch-deck-status.ts`)

Four-state system for tracking pitch deck lifecycle:

```typescript
export type PitchDeckStatus = 'uploading' | 'processing' | 'ready' | 'error';
```

**Features:**

- Configurable labels and Tailwind CSS color classes
- Utility functions for status management
- Visual indicators (badges, progress rings)
- Dark/light mode support

#### 2. API Type Definitions

**Request Types:**

- `UploadPitchDeckRequest`: Basic file upload
- `UploadPitchDeckWithMetadataRequest`: Upload with title, description, tags
- `AnalyzePitchDeckRequest`: Trigger analysis by upload ID
- `ListPitchDecksQuery`: Filter and paginate pitch deck lists

**Response Types:**

- `PitchDeckListItem`: Basic pitch deck information
- `PitchDeckAnalysisResponse`: VC framework analysis results
- `VCCategoryScore`: Scores for 7 VC evaluation categories
- `StrengthItem[]` and `ImprovementItem[]`: Analysis insights

#### 3. Retry Utility (`src/utils/retry.ts`)

Exponential backoff with jitter for handling transient failures:

```typescript
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T>
```

**Features:**

- Configurable retry parameters (maxRetries, baseDelay, maxDelay)
- Prevents retry storms with random jitter
- Handles network timeouts and server overload
- Integration with pitch deck API services

### VC Framework Integration

#### 7 VC Categories:

1. **teamAndFounders**: Evaluation of founding team
2. **marketSize**: Market opportunity and sizing
3. **productSolution**: Product-market fit
4. **traction**: Growth metrics and validation
5. **businessModel**: Revenue and monetization
6. **competition**: Competitive landscape
7. **financials**: Financial projections and health

#### Analysis Output Structure:

```typescript
{
  overallScore: number,
  categoryScores: VCCategoryScore,
  strengths: StrengthItem[],
  improvements: ImprovementItem[],
  competitiveAnalysis?: CompetitiveAnalysis
}
```

## Component Architecture

### 1. Component Organization

```
components/
├── auth/           # Authentication components
├── common/         # Shared UI components
├── layout/         # Layout components (header, footer)
├── pitch-deck/     # Pitch deck specific components
└── ui/            # shadcn/ui base components
```

### 2. Pitch Deck Components

#### Wave 3: Pitch Deck Management Components (NEW)
- **pitch-deck-filter.tsx**: Status-based filtering with search integration
- **pitch-deck-list.tsx**: Paginated deck list with status indicators
- **pitch-deck-pagination.tsx**: Custom pagination with offset/limit
- **metadata-inputs.tsx**: Form for deck title, description, tags
- **delete-confirmation-dialog.tsx**: Safe deletion with confirmation
- **upload-progress-tracker.tsx**: Real-time upload progress visualization
- **pitch-deck-info.tsx**: Display of deck metadata and files
- **pitch-deck-actions.tsx**: Action buttons (delete, download, share)
- **pitch-deck-card.tsx**: Individual deck card with status badge
- **pitch-deck-detail-header.tsx**: Detail page header with title, status, dates
- **upload-form.tsx**: Complete upload interface with metadata

#### Wave 2: Pitch Deck Analysis Components
- **file-uploader.tsx**: Drag-and-drop file upload interface
- **upload-progress.tsx**: Real-time upload progress display
- **analysis-result.tsx**: VC framework analysis results
- **category-card.tsx**: Individual category score display
- **strength-card.tsx** & **improvement-card.tsx**: Actionable insights
- **competitive-analysis.tsx**: Market positioning visualization
- **gauge-chart.tsx**: Visual score representation

### 3. UI Components

- **Animated components**: Fade-in, scale-in, slide-up effects
- **Base components**: Button, input, with consistent styling
- **Sonner integration**: Toast notifications for user feedback

## API Integration

### 1. HTTP Client Configuration

```typescript
export const httpClient = Axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE,
  timeout: 60000 * 5,
  headers: { 'Content-Type': 'application/json' }
});
```

**Features:**

- Automatic JWT token attachment
- Global error handling (401 redirect to login)
- Request/response interceptors
- Timeout protection

### 2. Service Layer

```typescript
export class PitchDeckService {
  async uploadPitchDeck(request: UploadPitchDeckRequest);
  async uploadPitchDeckWithMetadata(request: UploadPitchDeckWithMetadataRequest);
  async analyzePitchDeck(request: AnalyzePitchDeckRequest);
  async listPitchDecks(query?: ListPitchDecksQuery);
  async getPitchDeckDetail(id: string);
}
```

### 3. Error Handling Patterns

- Retry utility for transient failures
- Type-safe error handling
- User-friendly error messages
- Network error recovery

## Type Safety

### 1. Strict TypeScript Configuration

- All rules enabled in strict mode
- No implicit any or null checks
- Explicit return types for functions
- Comprehensive interface definitions

### 2. API Contract Types

- Separate request/response type definitions
- Union types for status values
- Generic types for reusable functions
- Optional chaining and nullish coalescing

### 3. Path Aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Development Standards

### 1. Code Organization

- **Kebab-case** for filenames
- **Barrel exports** for clean imports
- **200-line limit** per file
- **Clear separation** of concerns

### 2. Import Organization

1. Next.js imports
2. Third-party imports
3. Internal imports (styles, components, utilities)
4. Relative imports

### 3. Testing Strategy

- Jest with React Testing Library
- 70% coverage threshold
- Component testing patterns
- API service mocking

## Security Considerations

### 1. Authentication

- JWT-based authentication
- Token auto-refresh handling
- Protected route guards
- Secure storage of tokens

### 2. Environment Variables

- T3 Env with Zod validation
- All sensitive data in .env files
- No hardcoded credentials

### 3. API Security

- Request/response validation
- Error handling without information leakage
- HTTPS enforcement in production

## Performance Optimizations

### 1. Next.js Optimizations

- App Router for efficient routing
- Code splitting and lazy loading
- Optimized image handling
- Fast refresh for development

### 2. Bundle Management

- Tree-shaking for unused code
- Dynamic imports for heavy components
- Optimized dependencies with pnpm

### 3. State Management

- Zustand for reactive updates
- LocalStorage persistence
- Selectors for derived state

## Key Files and Directories

### Core Configuration

- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `next.config.mjs`: Next.js configuration
- `eslint.config.mjs`: ESLint configuration

### Application Entry Points

- `src/app/layout.tsx`: Root layout with providers
- `src/app/page.tsx`: Landing page
- `src/components/ui/`: shadcn/ui component library
- `src/stores/index.ts`: State management entry point

### Wave 3: Pitch Deck Management Pages
- `src/app/dashboard/pitch-decks/page.tsx`: Pitch deck list page
- `src/app/dashboard/pitch-decks/upload/page.tsx`: Upload interface page
- `src/app/dashboard/pitch-decks/[uuid]/page.tsx`: Detail view page
- `src/components/pitch-deck-management/`: 11 new UI components
- `src/stores/pitch-deck-management.store.ts`: Pitch deck state management
- `src/services/api/pitch-deck-management.service.ts`: Management API service

### API Layer

- `src/services/http/client.ts`: HTTP client configuration
- `src/services/api/pitch-deck.service.ts`: Pitch deck API service
- `src/services/api/pitch-deck-management.service.ts`: Management service (NEW)
- `src/types/request/pitch-deck.ts`: Request type definitions
- `src/types/response/pitch-deck.ts`: Response type definitions

### Constants and Utilities

- `src/constants/pitch-deck-status.ts`: Status management
- `src/utils/retry.ts`: Retry mechanism
- `src/utils/mock-analysis.ts`: Mock data generation (NEW)
- `src/utils/index.ts`: Utility exports

## Development Workflow

### 1. Git Workflow

- Pre-commit hooks (Prettier + ESLint)
- Conventional commits
- Pre-push test suite
- Feature branch development

### 2. Code Quality

- ESLint rule enforcement
- Prettier formatting
- TypeScript strict mode
- Regular code reviews

### 3. Deployment

- Vercel deployment configuration
- Environment-specific builds
- Optimized production builds

## Future Enhancements

### Phase 1 (Foundation Layer - v0.2.0 Complete)

#### Core Infrastructure ✅
- ✅ Pitch deck status system
- ✅ API type definitions
- ✅ Retry utility
- ✅ Service architecture

#### Wave 3: Pitch Deck Management Pages ✅
- ✅ 11 UI components for pitch deck management
- ✅ List page with filtering and pagination
- ✅ Upload page with metadata forms
- ✅ Detail page with UUID validation
- ✅ Zustand store for state management
- ✅ Optimistic updates and error handling
- ✅ Responsive design with dark mode support

### Phase 2 (v0.3.0 - Planned)

- 🚧 Actual API integration (replacing mock data)
- 🚧 File upload progress tracking
- 🚧 VC framework analysis visualization
- 🚧 Bulk operations for pitch deck management
- 🚧 Search functionality with full-text search
- 🚧 Export capabilities for analysis results

### Phase 3 (v1.0.0)

- Advanced analytics dashboard
- Multi-user support with permissions
- Advanced filtering and search
- Real-time collaboration features
- Mobile app implementation

## Maintenance

### Documentation

- Comprehensive API documentation
- Component usage examples
- Code standards and patterns
- Migration guides

### Monitoring

- Error tracking integration
- Performance metrics
- User behavior analytics
- API health monitoring

---

_Last Updated: 2026-02-03_
_Version: 0.2.0_
_Status: Wave 3 Complete - Ready for API Integration_
