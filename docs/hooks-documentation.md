# Custom Hooks Documentation

This document provides comprehensive documentation for the custom hooks implemented in the pitch deck management system.

## Table of Contents

1. [usePipelineAutoStart](#usepipelinestart)
2. [Hook Architecture](#hook-architecture)
3. [Integration Patterns](#integration-patterns)
4. [Best Practices](#best-practices)

---

## usePipelineAutoStart

The `usePipelineAutoStart` hook provides intelligent pipeline management for pitch deck analysis operations. It automatically detects existing analysis, resumes polling, and can restart failed analysis operations.

### Overview

```typescript
import { usePipelineAutoStart } from '@/hooks';
```

### Purpose

- **Automatic Detection**: Checks for existing analysis when component mounts
- **Smart Resumption**: Resumes polling from where it left off
- **Auto-Restart**: Can automatically restart failed analysis
- **Real-time Updates**: Provides progress tracking and state updates
- **Memory Management**: Proper cleanup to prevent memory leaks

### API Reference

#### Interface

```typescript
interface UsePipelineAutoStartOptions {
  autoStart?: boolean;        // Enable auto-restart of failed analysis (default: true)
  onProgress?: (progress: number) => void;    // Progress callback
  onComplete?: (analysisUuid: string) => void; // Completion callback
  onError?: (error: string) => void;        // Error callback
}
```

#### Return Value

```typescript
{
  isPolling: boolean;        // Whether polling is active
  analysisUuid: string | null; // Current analysis UUID
  overallStatus: string | null; // Overall analysis status
  overallProgress: number;   // Overall progress percentage (0-100)
  stages: Record<string, PipelineStage>; // Individual stage status
  currentStage: string | null; // Currently executing stage
  error: string | null;      // Error message if any
}
```

### Usage Examples

#### Basic Usage

```typescript
function PitchDeckDetail({ deckUuid }) {
  const { isPolling, overallProgress, stages } = usePipelineAutoStart(deckUuid);

  return (
    <div>
      {isPolling && <div>Analysis in progress... {overallProgress}%</div>}
      <PipelineStages stages={stages} />
    </div>
  );
}
```

#### With Callbacks

```typescript
function PitchDeckDetail({ deckUuid }) {
  const {
    isPolling,
    overallProgress,
    analysisUuid,
    error
  } = usePipelineAutoStart(deckUuid, {
    autoStart: true,
    onProgress: (progress) => {
      console.log(`Analysis progress: ${progress}%`);
    },
    onComplete: (uuid) => {
      console.log('Analysis complete:', uuid);
      toast.success('Analysis completed successfully!');
    },
    onError: (errorMsg) => {
      console.error('Analysis failed:', errorMsg);
      toast.error(errorMsg);
    }
  });

  // ... component JSX
}
```

#### Conditional Auto-Start

```typescript
function PitchDeckDetail({ deckUuid, userPreferences }) {
  const { isPolling, error } = usePipelineAutoStart(
    deckUuid,
    {
      autoStart: userPreferences.autoRestartAnalysis,
      onError: (errorMsg) => {
        // Custom error handling
      }
    }
  );

  // ... component JSX
}
```

### Implementation Details

#### State Flow

1. **Component Mount**: Hook checks for existing analysis
2. **Existing Analysis Found**:
   - If completed: Call `onComplete`
   - If failed: Restart if `autoStart=true`
   - If processing: Resume polling
3. **No Analysis Found**: Start new if `autoStart=true`
4. **Polling**: Use exponential backoff until completion

#### Agent-Stage Mapping

The hook maps backend agents to frontend pipeline stages:

```typescript
// From src/constants/pipeline-stages.ts
export const AGENT_TO_STAGE_MAP: Record<string, string> = {
  'Sector Match Agent': 'analytics',
  'Stage Match Agent': 'analytics',
  'Thesis Overlap Agent': 'analytics',
  'History Behavior Agent': 'analytics',
  'Strengths Agent': 'swot',
  'Weaknesses Agent': 'swot',
  'Competitive Agent': 'swot',
  // ... more agents
};
```

#### Integration with Zustand Store

The hook updates the pipeline store with:

- `analysisUuid`: Current analysis identifier
- `overallStatus`: Overall analysis progress
- `overallProgress`: Progress percentage
- `stages`: Individual stage status updates
- `currentStage`: Active stage
- `isPolling`: Polling state
- `error`: Error messages

---

## Hook Architecture

### Design Principles

1. **Single Responsibility**: Each hook manages one specific concern
2. **Composability**: Hooks can be composed together
3. **Performance**: Minimal re-renders with proper memoization
4. **Error Boundaries**: Graceful error handling
5. **Type Safety**: Full TypeScript support

### Common Patterns

#### 1. Data Fetching Pattern

```typescript
function useAsyncData(url: string, options?: { refetch?: boolean }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      setData(response.json());
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, options?.refetch]);

  return { data, error, isLoading, refetch: fetchData };
}
```

#### 2. State Management Pattern

```typescript
function useLocalState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  const updateState = (updater: T | ((prev: T) => T)) => {
    setState(updater);
  };

  const resetState = () => {
    setState(initialValue);
  };

  return { state, updateState, resetState };
}
```

#### 3. Effect Cleanup Pattern

```typescript
function useWebSocket(url: string) {
  const [data, setData] = useState(null);
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { data };
}
```

---

## Integration Patterns

### 1. Component Integration

#### With Loading States

```typescript
function PitchDeckAnalysis({ deckUuid }) {
  const {
    isPolling,
    overallProgress,
    stages,
    currentStage
  } = usePipelineAutoStart(deckUuid);

  if (isPolling) {
    return (
      <div className="loading-state">
        <Progress value={overallProgress} />
        <p>Analyzing... Current: {currentStage}</p>
      </div>
    );
  }

  return <AnalysisResults stages={stages} />;
}
```

#### With Error Boundaries

```typescript
function PitchDeckAnalysis({ deckUuid }) {
  const {
    error,
    onError
  } = usePipelineAutoStart(deckUuid, {
    onError: (errorMsg) => {
      // Log to monitoring service
      logError(errorMsg);
    }
  });

  if (error) {
    return <ErrorComponent message={error} onRetry={() => window.location.reload()} />;
  }

  // ... normal rendering
}
```

### 2. Store Integration

#### Multiple Stores

```typescript
function PitchDeckDetail({ deckUuid }) {
  const { user } = useUserStore();
  const {
    isPolling,
    overallProgress
  } = usePipelineAutoStart(deckUuid, {
    autoStart: user?.preferences?.autoRestart
  });

  const { theme } = useThemeStore();

  // ... component logic
}
```

#### Custom Selectors

```typescript
function PitchDeckDetail({ deckUuid }) {
  const { stages, currentStage } = usePipelineAutoStart(deckUuid);

  // Custom derived state
  const completedStages = Object.values(stages).filter(
    stage => stage.status === 'completed'
  ).length;

  const totalStages = Object.keys(stages).length;

  return (
    <div>
      <Progress
        value={(completedStages / totalStages) * 100}
        label={`${completedStages}/${totalStages} stages complete`}
      />
    </div>
  );
}
```

### 3. API Integration

#### Service Layer

```typescript
function useAnalysisService(deckUuid: string) {
  const { startAnalysis, getAnalysisStatus } = useAnalysisApi();
  const {
    analysisUuid,
    setAnalysisUuid
  } = usePipelineStore();

  const manualStart = async () => {
    const newAnalysis = await startAnalysis(deckUuid);
    setAnalysisUuid(newAnalysis.uuid);
  };

  return {
    analysisUuid,
    manualStart,
    getAnalysisStatus: () => getAnalysisStatus(analysisUuid)
  };
}
```

---

## Best Practices

### 1. Hook Organization

- **File Structure**: Group related hooks in logical files
- **Naming Convention**: Use `use` prefix for custom hooks
- **Single File**: One hook per file for better maintainability

```typescript
// src/hooks/
├── index.ts              # Hook exports
├── use-pipeline-auto-start.ts
├── use-auth.ts
├── use-theme.ts
└── use-local-storage.ts
```

### 2. Performance Optimization

#### Memoization

```typescript
function useFilteredData(data: any[], filter: string) {
  const filtered = useMemo(() => {
    return data.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  return filtered;
}
```

#### Debouncing

```typescript
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### 3. Error Handling

#### Error Boundaries

```typescript
function useAsyncOperation<T>(operation: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [operation]);

  return {
    data,
    error,
    isLoading,
    execute,
    reset: () => {
      setData(null);
      setError(null);
    }
  };
}
```

### 4. Testing Hooks

#### Testing Custom Hooks

```typescript
// tests/hooks/use-pipeline-auto-start.test.tsx
import { renderHook, act } from '@testing-library/react';
import { usePipelineAutoStart } from '@/hooks/use-pipeline-auto-start';
import { mockAnalysisApi } from '__mocks__/analysis-api';

describe('usePipelineAutoStart', () => {
  it('should start polling when deckUuid is provided', () => {
    const { result } = renderHook(() =>
      usePipelineAutoStart('test-uuid')
    );

    expect(result.current.isPolling).toBe(true);
  });

  it('should call onComplete when analysis finishes', async () => {
    const mockOnComplete = jest.fn();
    const { result } = renderHook(() =>
      usePipelineAutoStart('test-uuid', {
        onComplete: mockOnComplete
      })
    );

    // Simulate completion
    await act(async () => {
      mockAnalysisApi.completeAnalysis('test-uuid');
    });

    expect(mockOnComplete).toHaveBeenCalledWith('test-uuid');
  });
});
```

### 5. Documentation

#### JSDoc Comments

```typescript
/**
 * Manages pitch deck analysis pipeline with auto-start capabilities
 *
 * @param deckUuid - UUID of the pitch deck to analyze
 * @param options - Configuration options
 * @param options.autoStart - Enable auto-restart of failed analysis (default: true)
 * @param options.onProgress - Callback for progress updates
 * @param options.onComplete - Callback when analysis completes
 * @param options.onError - Callback for error handling
 * @returns Pipeline state and polling status
 */
export const usePipelineAutoStart = (
  deckUuid: string,
  options?: UsePipelineAutoStartOptions
) => {
  // Implementation
};
```

---

## Migration Guide

### Upgrading from v0.2.0 to v0.3.0

#### Breaking Changes

1. **Hook Signature**: Added `options` parameter for configuration

```typescript
// Before
const { isPolling } = usePipelineAutoStart(deckUuid);

// After
const { isPolling } = usePipelineAutoStart(deckUuid, {
  autoStart: true,
  onProgress: (progress) => console.log(progress)
});
```

#### Deprecations

- `useAnalysisPolling` → Use `usePipelineAutoStart` instead
- Direct store access → Use hook callbacks

### Future Considerations

1. **React 18 Features**: Plan for concurrent rendering patterns
2. **Server Components**: Consider hook limitations for SSR
3. **TypeScript**: Plan for upcoming TS features
4. **Performance**: Monitor and optimize hook usage

---

## Troubleshooting

### Common Issues

#### Memory Leaks

**Problem**: Components not unmounting properly

```typescript
// Fix: Ensure proper cleanup
useEffect(() => {
  const timer = setInterval(() => {
    // Polling logic
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

#### Stale Closures

**Problem**: Hook callbacks have stale state

```typescript
// Fix: Use functional updates or refs
const { updateState } = useLocalState();

// Instead of:
updateState(state + 1);

// Use:
updateState(prev => prev + 1);
```

#### Re-render Issues

**Problem**: Unnecessary re-renders

```typescript
// Fix: Memoize callbacks
const memoizedCallback = useCallback((progress: number) => {
  console.log(progress);
}, []);
```

---

_**Last Updated**: 2026-02-06_
_**Version**: v0.3.0_
_**Maintainer**: TBX/Capylabs Development Team_