# Pipeline Visualization Component

## Overview

The Pipeline Visualization Component is a ReactFlow-based visualization system that displays the AI analysis pipeline progress in a clear, interactive interface. It was implemented in Phase 03 as part of the TBX Pitch Deck Management System.

## Component Architecture

### Main Components

#### 1. `PipelineFlow`
The core component that manages the ReactFlow instance and renders the pipeline.

**File:** `src/components/pipeline-visualization/pipeline-flow.tsx`

**Key Features:**
- Renders nodes based on pipeline stages
- Creates animated edges between stages
- Handles node positioning and layout
- Provides SSR compatibility wrapper

**Props:**
```typescript
interface PipelineFlowProps {
  className?: string;
}
```

**Usage:**
```typescript
import { PipelineFlow } from '@/components/pipeline-visualization';

<PipelineFlow className="w-full h-64" />
```

#### 2. `PipelineNode`
Custom ReactFlow node component that displays individual pipeline stages.

**File:** `src/components/pipeline-visualization/pipeline-node.tsx`

**Features:**
- Status-based visual styling (pending, running, completed, failed)
- Animated progress indicator for running stages
- Icon representation for each status
- Input/output connection handles

**Props:** (Inherited from ReactFlow NodeProps)
```typescript
interface NodeProps<PipelineNodeData> {
  data: PipelineStage;
  selected?: boolean;
}
```

#### 3. `PipelineVisualization`
SSR-compatible wrapper component.

**File:** `src/components/pipeline-visualization/pipeline-flow.tsx`

**Usage:**
```typescript
import { PipelineVisualization } from '@/components/pipeline-visualization';

<PipelineVisualization className="w-full h-64" />
```

## Pipeline Stages

### Stage Order
The pipeline follows a sequential flow through 6 stages:

1. **Extract Content** - Extracts text content from pitch deck
2. **Generate Summary** - Creates executive summary
3. **VC Framework Analysis** - Analyzes using venture capital criteria
4. **SWOT Analysis** - Strengths, Weaknesses, Opportunities, Threats
5. **PESTLE Analysis** - Political, Economic, Social, Technological, Legal, Environmental
6. **Investment Recommendation** - Final AI investment recommendation

### Stage Status

Each stage can have one of four statuses:

| Status | Icon | Color | Description |
|--------|------|------|-------------|
| `pending` | ⏰ | Gray | Waiting to start |
| `running` | 🔄 | Blue | In progress with progress bar |
| `completed` | ✅ | Green | Successfully completed |
| `failed` | ❌ | Red | Failed with error message |

### Stage Data Structure

```typescript
interface PipelineStage {
  id: string;           // Stage identifier
  name: string;         // Display name
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;     // 0-100 percentage
  startTime?: Date;     // When stage started
  endTime?: Date;      // When stage completed
  errorMessage?: string; // Error message if failed
}
```

## State Management

### Pipeline Store

**File:** `src/stores/pipeline.store.ts`

The pipeline state is managed using Zustand with the following key features:

- **Persistence**: Critical state survives page refreshes
- **Real-time Updates**: Stage progress updates are atomic
- **Polling Control**: Built-in polling mechanism tracking
- **Error Handling**: Graceful error state management

#### Key Actions

```typescript
// Stage management
updateStage(stageId: string, updates: Partial<PipelineStage>)
setStages(stages: Record<string, PipelineStage>)

// Polling control
setPolling(isPolling: boolean)
incrementPollCount()

// Error handling
setError(error: string | null)
```

## Styling

### Visual Design

- **Nodes**: Rounded borders with status-based colors
- **Edges**: Animated when connecting to running stages
- **Icons**: Lucide React icons with spin animation for running state
- **Progress**: Blue progress bar for running stages
- **Handles**: Gray connection points for linking stages

### Color Scheme

| Status | Background | Text | Border |
|--------|------------|------|---------|
| pending | bg-gray-100 | text-gray-600 | border-gray-300 |
| running | bg-blue-50 | text-blue-600 | border-blue-300 |
| completed | bg-green-50 | text-green-600 | border-green-300 |
| failed | bg-red-50 | text-red-600 | border-red-300 |

## Integration

### Backend Integration

The pipeline visualization integrates with the backend through:

1. **Analysis Service**: Triggers pipeline initiation
2. **Polling Mechanism**: Regular status updates via API
3. **WebSocket Support**: Real-time progress updates (future enhancement)

### API Integration

```typescript
// Start analysis
await pitchDeckService.startAnalysis(uuid);

// Poll for status
const status = await pitchDeckService.getAnalysisStatus(uuid);
pipelineStore.updateStage(stageId, {
  status: status.status,
  progress: status.progress
});
```

## Usage Examples

### Basic Implementation

```typescript
import { PipelineVisualization } from '@/components/pipeline-visualization';
import { usePipelineStore } from '@/stores/pipeline.store';

function PipelineView() {
  const stages = usePipelineStore((state) => state.stages);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Analysis Pipeline</h2>
      <PipelineVisualization className="w-full h-64" />
    </div>
  );
}
```

### With Stage Details

```typescript
import { PipelineFlow, PipelineNode } from '@/components/pipeline-visualization';

function EnhancedPipelineView() {
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Show stage details modal
    setShowStageDetails(node.data);
  }, []);

  return (
    <PipelineFlow
      className="w-full h-64"
      onNodeClick={onNodeClick}
    />
  );
}
```

## Performance Considerations

### Optimization Techniques

1. **Memoization**: Node and edge arrays are memoized
2. **Lazy Loading**: Pipeline visualization loads only when needed
3. **Limited Interactions**: Reduced ReactFlow controls for performance
4. **Efficient Updates**: Zustand selectors prevent unnecessary re-renders

### Best Practices

1. Use `useMemo` for expensive calculations
2. Limit ReactFlow interaction controls
3. Implement proper cleanup on unmount
4. Use TypeScript for type safety

## Future Enhancements

### Planned Features

1. **Interactive Nodes**: Click to view stage details
2. **Parallel Processing**: Support for concurrent stages
3. **Historical View**: Display previous pipeline runs
4. **Export Feature**: Save pipeline visualization as image
5. **Custom Themes**: Dark/light mode support
6. **Zoom Controls**: Enhanced user interaction

### Technical Improvements

1. **WebSockets**: Replace polling with real-time updates
2. **Error Recovery**: Automatic retry mechanisms
3. **Caching**: Cache stage results for better performance
4. **Analytics**: Track pipeline performance metrics

## Troubleshooting

### Common Issues

1. **Nodes Not Visible**: Check ReactFlow container height
2. **Animations Laggy**: Reduce complexity or use web workers
3. **State Not Updating**: Verify Zustand store actions
4. **Styling Issues**: Check Tailwind CSS configuration

### Debug Tips

```typescript
// Enable debug logging
localStorage.setItem('reactflow debug', 'true');

// Check pipeline state
console.log(usePipelineStore.getState());

// Monitor performance
const start = performance.now();
// ... render pipeline
const end = performance.now();
console.log(`Pipeline render: ${end - start}ms`);
```

## Related Files

- `src/types/domain/pipeline.ts` - Type definitions
- `src/constants/pipeline-stages.ts` - Stage configurations
- `src/stores/pipeline.store.ts` - State management
- `src/services/api/pitch-deck.service.ts` - API integration