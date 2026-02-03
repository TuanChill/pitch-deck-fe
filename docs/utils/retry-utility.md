# Retry Utility Documentation

## Overview

The retry utility (`src/utils/retry.ts`) provides a robust mechanism for handling transient failures in API calls using exponential backoff with jitter. This ensures reliable operations during network interruptions, server overload, or temporary service unavailability.

## Core Features

### Exponential Backoff

- Delay increases exponentially with each retry attempt
- Formula: `baseDelay * 2^attempt`
- Prevents immediate retry storms that could overwhelm the server

### Jitter

- Random delay (0-1000ms) added to each retry
- Prevents synchronized retry attempts from multiple clients
- Reduces the risk of cascading failures

### Configurable Parameters

- `maxRetries`: Maximum number of retry attempts (default: 3)
- `baseDelay`: Initial delay in milliseconds (default: 1000ms)
- `maxDelay`: Maximum delay cap in milliseconds (default: 30000ms)

## Usage Examples

### Basic Usage

```typescript
import { withRetry } from '@/utils/retry';

// Simple retry for an API call
try {
  const result = await withRetry(async () => {
    return await apiService.uploadPitchDeck(file);
  });

  console.log('Upload successful:', result);
} catch (error) {
  console.error('Upload failed after all retries:', error);
}
```

### Custom Retry Configuration

```typescript
import { withRetry, type RetryOptions } from '@/utils/retry';

const retryOptions: RetryOptions = {
  maxRetries: 5, // Retry up to 5 times
  baseDelay: 2000, // Start with 2 second delay
  maxDelay: 60000 // Cap at 60 seconds
};

try {
  const analysis = await withRetry(() => apiService.analyzePitchDeck({ uploadId }), retryOptions);

  console.log('Analysis completed:', analysis);
} catch (error) {
  console.error('Analysis failed after retries:', error);
}
```

### Service Layer Integration

```typescript
// src/services/api/pitch-deck.service.ts
import { withRetry } from '@/utils/retry';

export class PitchDeckService {
  async uploadPitchDeckWithRetry(
    request: UploadPitchDeckWithMetadataRequest,
    options?: RetryOptions
  ): Promise<UploadPitchDeckResponse> {
    return withRetry(() => this.uploadPitchDeck(request), options);
  }

  async analyzePitchDeckWithRetry(
    request: AnalyzePitchDeckRequest,
    options?: RetryOptions
  ): Promise<PitchDeckAnalysisResponse> {
    return withRetry(() => this.analyzePitchDeck(request), options);
  }
}
```

## Retry Strategy Guidelines

### When to Use Retry

1. **File Uploads**

   - Network interruptions during large file uploads
   - Temporary server timeouts during processing

2. **Analysis Requests**

   - Server busy scenarios (503 Service Unavailable)
   - Temporary processing queue delays

3. **API Calls**
   - Network timeouts (504 Gateway Timeout)
   - Temporary server overload (502 Bad Gateway)

### When NOT to Use Retry

1. **Client-Side Errors**

   ```typescript
   // Don't retry validation errors
   if (error.response?.status === 400) {
     throw new Error('Invalid request parameters');
   }
   ```

2. **Authentication Issues**

   ```typescript
   // Don't retry auth failures
   if (error.response?.status === 401) {
     throw new Error('Authentication required');
   }
   ```

3. **Permission Denied**

   ```typescript
   // Don't retry permission errors
   if (error.response?.status === 403) {
     throw new Error('Access denied');
   }
   ```

4. **Resource Not Found**
   ```typescript
   // Don't retry for 404 errors
   if (error.response?.status === 404) {
     throw new Error('Resource not found');
   }
   ```

## Error Handling Patterns

### Basic Error Handling

```typescript
try {
  const result = await withRetry(() => apiService.call());
  return result;
} catch (error) {
  // Handle final failure after all retries
  console.error('Operation failed:', error);
  throw error; // Re-throw for UI to handle
}
```

### Type-Specific Error Handling

```typescript
async function uploadWithRetry(file: File) {
  try {
    const result = await withRetry(() => pitchDeckService.uploadPitchDeck({ file }), {
      maxRetries: 3
    });

    return result;
  } catch (error) {
    if (error.response?.status === 413) {
      throw new Error('File size exceeds limit');
    }

    if (error.response?.status === 415) {
      throw new Error('Unsupported file format');
    }

    throw new Error('Upload failed. Please try again.');
  }
}
```

### User Feedback During Retries

```typescript
let retryCount = 0;

async function uploadWithProgress(file: File) {
  try {
    const result = await withRetry(() => pitchDeckService.uploadPitchDeck({ file }), {
      maxRetries: 5,
      onRetry: (error, attempt) => {
        retryCount = attempt;
        console.log(`Retry attempt ${attempt}: ${error.message}`);
        // Update UI to show retry status
      }
    });

    return result;
  } catch (error) {
    // Show final error message to user
    throw new Error(`Upload failed after ${retryCount} retries: ${error.message}`);
  }
}
```

## Configuration Options

### Default Configuration

```typescript
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000
};
```

### Operation-Specific Configurations

```typescript
// Conservative retry for critical operations
const criticalOperationRetry = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000
};

// Aggressive retry for non-critical operations
const nonCriticalRetry = {
  maxRetries: 5,
  baseDelay: 500,
  maxDelay: 30000
};

// Long-polling retry for analysis
const analysisRetry = {
  maxRetries: 10,
  baseDelay: 2000,
  maxDelay: 120000 // 2 minutes max
};
```

## Testing

### Unit Tests

```typescript
// __tests__/utils/retry.test.ts
import { withRetry } from '@/utils/retry';

describe('withRetry', () => {
  it('should succeed on first attempt', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(mockFn);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and succeed', async () => {
    const mockFn = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('success');

    const result = await withRetry(mockFn, { maxRetries: 2 });

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should fail after max retries', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('fail'));

    await expect(withRetry(mockFn, { maxRetries: 2 })).rejects.toThrow('fail');

    expect(mockFn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });

  it('should respect delay timing', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('fail'));
    const startTime = Date.now();

    await expect(
      withRetry(mockFn, {
        maxRetries: 1,
        baseDelay: 1000
      })
    ).rejects.toThrow('fail');

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should be at least 1000ms delay
    expect(duration).toBeGreaterThanOrEqual(1000);
  });
});
```

### Integration Tests

```typescript
// __tests__/services/pitch-deck.service.test.ts
import { PitchDeckService } from '@/services/api';
import { withRetry } from '@/utils/retry';

describe('PitchDeckService with Retry', () => {
  let service: PitchDeckService;

  beforeEach(() => {
    service = new PitchDeckService();
  });

  it('should use retry for upload', async () => {
    const mockFile = new File(['test'], 'test.pdf');
    const mockUpload = vi.spyOn(service, 'uploadPitchDeck');

    // Simulate network failure then success
    mockUpload.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
      uploadId: '123',
      filename: 'test.pdf',
      fileSize: 1024,
      fileType: 'application/pdf',
      uploadedAt: '2026-02-03T12:00:00Z'
    });

    const result = await service.uploadPitchDeckWithRetry({ file: mockFile });

    expect(result.uploadId).toBe('123');
    expect(mockUpload).toHaveBeenCalledTimes(2);
  });
});
```

## Performance Considerations

1. **Retry Count**: Balance between reliability and performance

   - Too few: Misses recovery opportunities
   - Too many: Wastes resources and delays user feedback

2. **Delay Timing**: Respect server backpressure

   - Start with conservative delays
   - Cap maximum delays to prevent excessive waiting

3. **Cancel Support**: Consider adding cancellation for long retries

   ```typescript
   export const withRetry = async <T>(
     fn: () => Promise<T>,
     options: RetryOptions = {}
   ): Promise<T> => {
     const controller = new AbortController();

     // Set up timeout or cancellation logic
     const timeout = setTimeout(() => controller.abort(), 300000);

     try {
       // Retry logic with controller check
     } finally {
       clearTimeout(timeout);
     }
   };
   ```

## Migration from Manual Retry

### Before (Manual Retry)

```typescript
async function manualRetry(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

### After (Using Utility)

```typescript
import { withRetry } from '@/utils/retry';

async function betterRetry(fn: () => Promise<any>) {
  return withRetry(fn, {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000
  });
}
```

## Best Practices

1. **Document Retry Strategy**: Clearly document which operations use retry and why
2. **Monitor Retry Events**: Log retry attempts for debugging and optimization
3. **User Communication**: Inform users when operations are retrying
4. **Circuit Breaking**: Consider circuit breakers for repeated failures
5. **Rate Limiting**: Respect API rate limits during retry attempts

---

_Last Updated: 2026-02-03_
_Version: 1.0.0_
