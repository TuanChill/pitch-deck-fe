# Analysis Polling Architecture

This document describes the sophisticated polling mechanism implemented in Phase 03 for handling long-running analysis operations.

## Overview

The Analysis Service implements a sophisticated polling mechanism with exponential backoff to handle long-running analysis operations efficiently. This provides real-time progress feedback to users while optimizing server resources.

## Polling Flow Architecture

### Core Implementation

```typescript
// src/services/api/analysis.service.ts
export class AnalysisService {
  async startAnalysisAndWait(
    deckUuid: string,
    progressCallback?: (status: AnalysisStatusResponse) => void,
    options?: PollingOptions
  ): Promise<AnalysisResponse> {
    // 1. Start analysis and get UUID
    const startResponse = await this.startAnalysis(deckUuid);
    const analysisUuid = startResponse.uuid;

    // 2. Initialize polling state
    let attempt = 0;
    let currentInterval = options?.interval || 1000;
    const maxAttempts = options?.maxAttempts || 300;
    const timeout = options?.timeout || 300000; // 5 minutes

    // 3. Poll until completion
    while (attempt < maxAttempts) {
      attempt++;

      // Check timeout
      if (attempt * currentInterval > timeout) {
        throw new Error('Analysis polling timeout');
      }

      // Fetch status
      const status = await this.getAnalysisStatus(analysisUuid);

      // Update progress
      if (progressCallback) {
        progressCallback(status);
      }

      // Check completion
      if (status.status === 'completed') {
        return await this.getAnalysisResult(analysisUuid);
      }

      if (status.status === 'failed') {
        throw new Error(`Analysis failed: ${status.message || 'Unknown error'}`);
      }

      // Exponential backoff with jitter
      currentInterval = Math.min(currentInterval * 2, 30000);
      const delay = currentInterval + Math.random() * 1000;

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    throw new Error('Analysis polling exceeded maximum attempts');
  }
}
```

### Polling Strategy Components

#### 1. Exponential Backoff

- **Initial Delay**: 1 second (rapid initial feedback)
- **Growth Rate**: 2x per iteration (1s → 2s → 4s → 8s → ...)
- **Maximum Delay**: 30 seconds (capped to prevent excessive delays)
- **Purpose**: Reduce server load during peak times

#### 2. Random Jitter

- **Range**: 0-1 second random delay
- **Purpose**: Prevent thundering herd effect
- **Implementation**: `Math.random() * 1000`
- **Benefit**: Distributes polling requests across time

#### 3. Progress Tracking

- **Callback Pattern**: UI updates on each status change
- **Status Types**: `pending` | `processing` | `completed` | `failed`
- **Progress Range**: 0-100 percentage
- **Estimated Time**: Optional remaining seconds

#### 4. Error Handling

- **Timeout Protection**: 5-minute maximum duration
- **Maximum Attempts**: 300 attempts limit
- **Graceful Degradation**: Proper error states
- **User Feedback**: Clear error messages

## Polling Configuration Options

### PollingOptions Interface

```typescript
export type PollingOptions = {
  interval?: number; // Initial polling interval in ms (default: 1000)
  maxInterval?: number; // Maximum interval in ms (default: 30000)
  maxAttempts?: number; // Maximum number of attempts (default: 300)
  timeout?: number; // Total timeout in ms (default: 300000)
  jitter?: number; // Maximum jitter in ms (default: 1000)
};
```

### Default Configuration

```typescript
const DEFAULT_POLLING_OPTIONS: Required<PollingOptions> = {
  interval: 1000, // 1 second
  maxInterval: 30000, // 30 seconds
  maxAttempts: 300, // 5 minutes at max interval
  timeout: 300000, // 5 minutes total
  jitter: 1000 // 1 second max jitter
};
```

## UI Integration Patterns

### Custom React Hook

```typescript
// src/hooks/useAnalysisPolling.ts
export function useAnalysisPolling(deckUuid: string) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<AnalysisStatus['status']>('pending');
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!deckUuid) return;

    const analysisService = new AnalysisService();
    let abortController = new AbortController();

    const pollAnalysis = async () => {
      setIsPolling(true);
      setError(null);

      try {
        const result = await analysisService.startAnalysisAndWait(
          deckUuid,
          (status) => {
            if (!abortController.signal.aborted) {
              setProgress(status.progress);
              setStatus(status.status);
            }
          },
          {
            interval: 1000,
            maxInterval: 30000,
            timeout: 300000,
            jitter: 1000
          }
        );

        if (!abortController.signal.aborted) {
          setResult(result);
          setStatus('completed');
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err.message);
          setStatus('failed');
        }
      } finally {
        setIsPolling(false);
      }
    };

    pollAnalysis();

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, [deckUuid]);

  return { progress, status, result, error, isPolling, refetch: pollAnalysis };
}
```

### Component Implementation

```typescript
// src/components/analysis/analysis-progress.tsx
import { useAnalysisPolling } from '@/hooks/useAnalysisPolling';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AnalysisProgressProps {
  deckUuid: string;
}

export function AnalysisProgress({ deckUuid }: AnalysisProgressProps) {
  const { progress, status, result, error, isPolling } = useAnalysisPolling(deckUuid);

  const getStatusColor = (status: AnalysisStatus['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: AnalysisStatus['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '⚡';
      case 'completed': return '✅';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (result) {
    return (
      <AnalysisResult analysis={result} />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{getStatusIcon(status)}</span>
          Analysis Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          {isPolling && (
            <span className="text-xs text-muted-foreground">
              Polling for updates...
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Advanced Usage with Debouncing

```typescript
// src/hooks/useAnalysisPollingDebounced.ts
import { useState, useEffect } from 'react';
import { useAnalysisPolling } from './useAnalysisPolling';

export function useAnalysisPollingDebounced(deckUuid: string, debounceMs: number = 100) {
  const [debouncedProgress, setDebouncedProgress] = useState(0);
  const [debouncedStatus, setDebouncedStatus] = useState<AnalysisStatus['status']>('pending');

  const { progress, status, ...rest } = useAnalysisPolling(deckUuid);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProgress(progress);
      setDebouncedStatus(status);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [progress, status, debounceMs]);

  return {
    ...rest,
    progress: debouncedProgress,
    status: debouncedStatus
  };
}
```

## Performance Considerations

### Optimization Features

1. **Efficient Polling**: Exponential backoff reduces unnecessary API calls
2. **Progress Debouncing**: Optional debouncing for rapid updates
3. **Memory Management**: Automatic cleanup on component unmount
4. **Caching**: Recent analysis results cached locally
5. **Request Deduplication**: Prevents multiple simultaneous polling requests

### Resource Management Best Practices

```typescript
// Proper cleanup pattern
useEffect(() => {
  const abortController = new AbortController();
  const timerRef = useRef<NodeJS.Timeout>();

  const pollAnalysis = async () => {
    try {
      await analysisService.startAnalysisAndWait(deckUuid, (status) => {
        if (!abortController.signal.aborted) {
          // Update state only if not aborted
          setProgress(status.progress);
          setStatus(status.status);
        }
      });
    } catch (error) {
      if (!abortController.signal.aborted) {
        setError(error.message);
      }
    }
  };

  // Start polling
  pollAnalysis();

  // Cleanup function
  return () => {
    abortController.abort();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, [deckUuid]);
```

## Security Considerations

### Security Features

1. **Authentication**: JWT tokens automatically attached to all API calls
2. **Input Validation**: UUID validation for analysis requests
3. **Rate Limiting**: Built into polling mechanism
4. **Error Sanitization**: No sensitive data in error messages
5. **Request Timeout**: Prevents hanging requests

### Security Patterns

```typescript
// Secure polling implementation
class SecureAnalysisService {
  async startAnalysisAndWait(
    deckUuid: string,
    progressCallback?: (status: AnalysisStatusResponse) => void
  ) {
    // Validate input
    if (!validateUuid(deckUuid)) {
      throw new Error('Invalid deck UUID');
    }

    // Start analysis
    const startResponse = await this.startAnalysis(deckUuid);

    // Continue with secure polling...
  }

  private validateUuid(uuid: string): boolean {
    // Implement UUID validation
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
  }
}
```

## Error Handling Strategies

### Error Types and Recovery

```typescript
// Comprehensive error handling
function useAnalysisPollingWithRetry(deckUuid: string) {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const { error, ...rest } = useAnalysisPolling(deckUuid);

  useEffect(() => {
    if (error && retryCount < maxRetries) {
      // Retry after delay
      const retryTimer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, 5000); // 5 second delay before retry

      return () => clearTimeout(retryTimer);
    }
  }, [error, retryCount, maxRetries]);

  return {
    ...rest,
    error,
    retryCount,
    canRetry: retryCount < maxRetries,
    retry: () => setRetryCount(0)
  };
}
```

## Testing Strategy

### Unit Tests for Polling Logic

```typescript
// __tests__/analysis/analysis-service.test.ts
describe('AnalysisService', () => {
  let analysisService: AnalysisService;
  let mockGetAnalysisStatus: jest.Mock;

  beforeEach(() => {
    analysisService = new AnalysisService();
    mockGetAnalysisStatus = jest.fn();
  });

  describe('startAnalysisAndWait', () => {
    it('should poll until completion', async () => {
      // Mock status updates
      mockGetAnalysisStatus
        .mockReturnValueOnce({ status: 'processing', progress: 25 })
        .mockReturnValueOnce({ status: 'processing', progress: 50 })
        .mockReturnValueOnce({ status: 'processing', progress: 75 })
        .mockReturnValueOnce({
          status: 'completed',
          progress: 100,
          result: mockAnalysisResult
        });

      const progressCallback = jest.fn();
      const result = await analysisService.startAnalysisAndWait('test-uuid', progressCallback);

      expect(progressCallback).toHaveBeenCalledTimes(4);
      expect(result).toEqual(mockAnalysisResult);
    });

    it('should handle analysis failure', async () => {
      mockGetAnalysisStatus.mockReturnValueOnce({
        status: 'failed',
        message: 'Analysis failed due to error'
      });

      await expect(analysisService.startAnalysisAndWait('test-uuid')).rejects.toThrow(
        'Analysis failed'
      );
    });

    it('should respect timeout', async () => {
      mockGetAnalysisStatus.mockReturnValue({ status: 'processing', progress: 0 });

      await expect(
        analysisService.startAnalysisAndWait('test-uuid', undefined, {
          timeout: 1000, // 1 second
          interval: 500 // 500ms intervals
        })
      ).rejects.toThrow('Analysis polling timeout');
    });
  });
});
```

### Integration Tests

```typescript
// __tests__/analysis/analysis-polling.integration.test.ts
describe('Analysis Polling Integration', () => {
  it('should integrate with UI components', async () => {
    render(<AnalysisProgress deckUuid="test-uuid" />);

    // Start polling
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
    });

    // Verify UI updates
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '50');
  });
});
```

## Deployment Considerations

### Production Configuration

```typescript
// Production polling configuration
const PROD_POLLING_OPTIONS: PollingOptions = {
  interval: 2000, // 2 seconds in production
  maxInterval: 60000, // 60 seconds in production
  timeout: 600000, // 10 minutes in production
  jitter: 2000 // 2 seconds jitter in production
};

// Development configuration
const DEV_POLLING_OPTIONS: PollingOptions = {
  interval: 500, // 500ms in development
  maxInterval: 10000, // 10 seconds in development
  timeout: 120000, // 2 minutes in development
  jitter: 500 // 500ms jitter in development
};
```

### Monitoring and Metrics

```typescript
// Add polling metrics
class MetricsAwareAnalysisService extends AnalysisService {
  private pollCounter: Prometheus.Counter;
  private errorCounter: Prometheus.Counter;
  private durationHistogram: Prometheus.Histogram;

  async startAnalysisAndWait(
    deckUuid: string,
    progressCallback?: (status: AnalysisStatusResponse) => void
  ) {
    const startTime = Date.now();

    try {
      const result = await super.startAnalysisAndWait(deckUuid, progressCallback);

      this.durationHistogram.observe(Date.now() - startTime);
      this.pollCounter.inc();

      return result;
    } catch (error) {
      this.errorCounter.inc();
      throw error;
    }
  }
}
```

---

This polling architecture provides a robust, efficient mechanism for handling long-running analysis operations while maintaining excellent user experience and system performance.
