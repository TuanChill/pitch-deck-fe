# Codebase Summary

## Overview
This document provides a comprehensive summary of the TBX Pitch Deck Management System frontend codebase, including the newly added Pipeline Visualization Component from Phase 03.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Components**: React 19 RC with shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: Zustand with localStorage persistence
- **HTTP Client**: Axios with JWT interceptors
- **Flow Visualization**: ReactFlow v11.11.4

### Core Patterns
- **YANGI-KISS-DRY-SOLID** principles enforced throughout
- **200-line limit** per file - large components are split
- **Kebab-case** filenames for consistency
- **Barrel exports** for clean imports
- **Environment validation** via T3 Env with Zod schemas

## Key Components

### 1. Pipeline Visualization Component (Phase 03)
Newly implemented ReactFlow-based pipeline visualization system for tracking AI analysis progress.

**Files:**
- `src/components/pipeline-visualization/pipeline-flow.tsx` - Main flow component with ReactFlow integration
- `src/components/pipeline-visualization/pipeline-node.tsx` - Custom node component with status indicators
- `src/components/pipeline-visualization/index.ts` - Barrel exports

**Features:**
- Visual representation of 6 pipeline stages: Extract Content → Generate Summary → VC Framework Analysis → SWOT Analysis → PESTLE Analysis → Investment Recommendation
- Real-time status tracking (pending, running, completed, failed)
- Animated connections between stages
- Progress indicators for running stages
- Color-coded status visualization
- Responsive design with ReactFlow controls

**Dependencies:**
- ReactFlow v11.11.4 (newly added)
- Lucide React for icons
- Zustand for state management

### 2. State Management
**Pipeline Store (`src/stores/pipeline.store.ts`)**
- Manages AI pipeline workflow state
- Tracks individual stage progress and status
- Handles polling mechanisms for real-time updates
- Persists critical state to localStorage

**Key State Properties:**
```typescript
interface PipelineState {
  analysisUuid: string | null;
  overallStatus: 'pending' | 'processing' | 'completed' | 'failed' | null;
  overallProgress: number;
  stages: Record<string, PipelineStage>;
  currentStage: string | null;
  isPolling: boolean;
  pollCount: number;
  error: string | null;
}
```

### 3. Domain Types
**Pipeline Types (`src/types/domain/pipeline.ts`)**
- Defines type-safe contracts for pipeline operations
- Includes stage management, status tracking, and error handling
- Supports real-time progress updates

### 4. Constants and Configuration
**Pipeline Stages (`src/constants/pipeline-stages.ts`)**
- Defines stage order and labels
- Maps backend agents to frontend stages
- Provides initial stage configuration

## Integration Points

### 1. Backend Integration
- **API Layer**: Services in `src/services/api/` handle communication with NestJS backend
- **Auth**: JWT tokens automatically attached via HTTP interceptors
- **Real-time Updates**: Polling mechanism for pipeline progress

### 2. UI Integration
- **Dashboard**: Pipeline visualization integrated into pitch deck management interface
- **Status Indicators**: Visual feedback matches application-wide design system
- **Responsive Design**: Works across different screen sizes

## File Structure

```
src/
├── components/
│   ├── pipeline-visualization/     # Phase 03: New Pipeline Visualization
│   │   ├── pipeline-flow.tsx      # Main flow component
│   │   ├── pipeline-node.tsx      # Custom node component
│   │   └── index.ts              # Barrel exports
│   ├── pitch-deck-management/    # Existing pitch deck components
│   ├── ui/                       # shadcn/ui components
│   └── ...
├── stores/
│   ├── pipeline.store.ts         # New pipeline state management
│   └── ...
├── types/
│   ├── domain/
│   │   └── pipeline.ts          # Pipeline domain types
│   └── ...
├── constants/
│   └── pipeline-stages.ts       # Pipeline stage definitions
└── services/
    └── api/
        └── ...
```

## Key Features

### Pipeline Visualization
- **Visual Flow**: Linear representation of AI processing stages
- **Real-time Updates**: Live progress tracking with animated indicators
- **Status Management**: Clear visual feedback for each stage state
- **Error Handling**: Display of error messages when stages fail
- **Performance**: Optimized ReactFlow configuration for smooth rendering

### State Management
- **Persistence**: Critical pipeline state survives page refreshes
- **Atomic Updates**: Stage updates are handled atomically
- **Polling Control**: Efficient polling with count tracking
- **Error Recovery**: Graceful error handling and state reset

## Performance Considerations

- ReactFlow optimized with limited interaction controls
- Memoization used for expensive calculations
- Lazy loading of pipeline visualization when needed
- Efficient state updates with Zustand

## Security

- JWT tokens managed securely via HTTP interceptors
- No sensitive data persisted in localStorage
- Type-safe API contracts prevent injection attacks
- Environment variables validated at startup

## Future Enhancements

- Click interactions for stage details
- Parallel stage processing visualization
- Historical pipeline tracking
- Export pipeline visualization as image
- Custom themes for pipeline visualization

## Dependencies

### Core Dependencies
- next: 15.0.0
- react: 19.0.0
- react-dom: 19.0.0
- zustand: 4.4.7
- axios: 1.6.0
- reactflow: 11.11.4 (new)

### Development Dependencies
- typescript: 5.3.3
- @types/react: 18.2.79
- tailwindcss: 3.3.0
- eslint: 8.57.0

## Build and Deployment

- **Package Manager**: pnpm 9.1.1+
- **Build Command**: `pnpm build`
- **Dev Command**: `pnpm dev` (with Turbo mode)
- **Linting**: `pnpm lint` + `pnpm prettier:format`

## Documentation

- Comprehensive component documentation in `/docs`
- API documentation in `/docs/api-docs.md`
- Architecture documentation in `/docs/system-architecture.md`
- Code standards in `/docs/code-standards.md`
- Type definitions in `/docs/type-definitions.md`

This summary reflects the current state of the codebase as of Phase 03 Pipeline Visualization implementation.