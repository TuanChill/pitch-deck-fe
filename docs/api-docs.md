# API Documentation

## Pitch Deck Management API

### Overview

This document provides comprehensive API documentation for the Pitch Deck Management system, including request/response types, status constants, and utility functions.

### Base API URL

```typescript
// Base URL configured in src/services/http/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
```

### Authentication

All API endpoints require JWT authentication. The HTTP client automatically attaches the Bearer token to requests:

```typescript
// Authorization header automatically added
Authorization: Bearer <jwt-token>
```

---

## 1. Pitch Deck Status Constants

### Status Values

The pitch deck system uses four main status values to track the lifecycle of uploaded files:

```typescript
export type PitchDeckStatus = 'uploading' | 'processing' | 'ready' | 'error';
```

### Status Configuration

```typescript
export const PITCH_DECK_STATUS: Record<PitchDeckStatus, { label: string; color: string }> = {
  uploading: {
    label: 'Uploading',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  },
  processing: {
    label: 'Processing',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
  },
  ready: {
    label: 'Ready',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  },
  error: {
    label: 'Error',
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  }
};
```

### Utility Functions

```typescript
// Get human-readable label for status
export const getStatusLabel = (status: PitchDeckStatus): string => PITCH_DECK_STATUS[status].label;

// Get Tailwind CSS color classes for status
export const getStatusColor = (status: PitchDeckStatus): string => PITCH_DECK_STATUS[status].color;
```

**Usage:**

```typescript
import { getStatusLabel, getStatusColor } from '@/constants/pitch-deck-status';

const status = 'processing';
const label = getStatusLabel(status); // 'Processing'
const colorClass = getStatusColor(status); // 'bg-yellow-100 text-yellow-700...'
```

---

## 2. API Request Types

### Upload Pitch Deck

#### Basic Upload

```typescript
export type UploadPitchDeckRequest = {
  file: File;
};
```

#### Upload with Metadata

```typescript
export type UploadPitchDeckWithMetadataRequest = {
  deck: File;
  title: string;
  description?: string;
  tags?: string[];
};
```

### Analyze Pitch Deck

```typescript
export type AnalyzePitchDeckRequest = {
  uploadId: string;
};
```

### List Pitch Decks

```typescript
export type ListPitchDecksQuery = {
  status?: 'uploading' | 'processing' | 'ready' | 'error';
  limit?: number;
  offset?: number;
};
```

---

## 3. API Response Types

### Upload Response

```typescript
export type UploadPitchDeckResponse = {
  uploadId: string;
  filename: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
};
```

### Pitch Deck List Item

```typescript
export type PitchDeckListItem = {
  id: string;
  uuid: string;
  title: string;
  description: string | null;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  status: PitchDeckStatus;
  chunkCount: number;
  errorMessage: string | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
};
```

### List Pitch Decks Response

```typescript
export type ListPitchDecksResponse = PitchDeckListItem[];
```

### Pitch Deck Detail Response

```typescript
export type PitchDeckDetailResponse = PitchDeckListItem;
```

### Pitch Deck Analysis Response

#### VC Framework Types

```typescript
export type VCCategory =
  | 'teamAndFounders'
  | 'marketSize'
  | 'productSolution'
  | 'traction'
  | 'businessModel'
  | 'competition'
  | 'financials';

export type VCCategoryScore = {
  [K in VCCategory]: {
    score: number;
    weight: number;
    details?: string;
  };
};

export type StrengthItem = {
  id: string;
  title: string;
  description: string;
  evidence: EvidenceQuote[];
  impact: 'high' | 'medium' | 'low';
  category: VCCategory;
};

export type ImprovementItem = {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
  priority: number;
  category: VCCategory;
};

export type CompetitiveAnalysis = {
  positioning: CompetitivePosition[];
  differentiators: Differentiator[];
  marketOpportunity: {
    size: string;
    growth: string;
    trend: 'rising' | 'stable' | 'declining';
  };
};

export type PitchDeckAnalysisResponse = {
  uploadId: string;
  filename: string;
  overallScore: number;
  categoryScores: VCCategoryScore;
  strengths: StrengthItem[];
  improvements: ImprovementItem[];
  competitiveAnalysis?: CompetitiveAnalysis;
  analyzedAt: string;
};
```

---

## 4. Retry Utility

The retry utility provides exponential backoff with jitter to handle transient API failures.

### Retry Options

```typescript
export type RetryOptions = {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
};
```

### Default Configuration

```typescript
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000
};
```

### Usage

```typescript
import { withRetry } from '@/utils/retry';

// Basic usage
try {
  const result = await withRetry(async () => {
    return await apiService.uploadPitchDeck(file);
  });

  console.log('Upload successful:', result);
} catch (error) {
  console.error('Upload failed after retries:', error);
}

// Custom retry options
try {
  const result = await withRetry(() => apiService.analyzePitchDeck(uploadId), {
    maxRetries: 5,
    baseDelay: 2000,
    maxDelay: 60000
  });

  console.log('Analysis completed:', result);
} catch (error) {
  console.error('Analysis failed after retries:', error);
}
```

### Retry Logic

1. **Exponential Backoff**: Delay increases exponentially with each retry

   - Formula: `baseDelay * 2^attempt`

2. **Jitter**: Random delay (0-1000ms) added to prevent retry storms

   - Prevents multiple clients from retrying simultaneously

3. **Max Delay**: Capped at 30 seconds (configurable)

   - Prevents excessively long delays

4. **Error Handling**: Retries on all errors except the final attempt

### When to Use Retry

- **File uploads**: Handle network interruptions during large file uploads
- **Analysis requests**: Retry during processing when server is busy
- **API calls**: Handle temporary server or network issues
- **Long-running operations**: Retry operations that might timeout

### When NOT to Use Retry

- **Client-side validation errors**
- **Authentication failures (401)**
- **Permission errors (403)**
- **Invalid request errors (400)**
- **Resource not found (404)**

---

## 5. API Service Integration

### Service Layer Structure

```typescript
// src/services/api/pitch-deck.service.ts
export class PitchDeckService {
  async uploadPitchDeck(request: UploadPitchDeckRequest): Promise<UploadPitchDeckResponse>;
  async uploadPitchDeckWithMetadata(
    request: UploadPitchDeckWithMetadataRequest
  ): Promise<UploadPitchDeckResponse>;
  async analyzePitchDeck(request: AnalyzePitchDeckRequest): Promise<PitchDeckAnalysisResponse>;
  async listPitchDecks(query?: ListPitchDecksQuery): Promise<ListPitchDecksResponse>;
  async getPitchDeckDetail(id: string): Promise<PitchDeckDetailResponse>;
}
```

### Example Usage

```typescript
import { PitchDeckService } from '@/services/api';
import { withRetry } from '@/utils/retry';

const pitchDeckService = new PitchDeckService();

// Upload with retry
const uploadResult = await withRetry(() =>
  pitchDeckService.uploadPitchDeckWithMetadata({
    deck: file,
    title: 'My Pitch Deck',
    description: 'Annual presentation for investors',
    tags: ['annual', 'investor', '2024']
  })
);

// List pitch decks
const pitchDecks = await pitchDeckService.listPitchDecks({
  status: 'ready',
  limit: 10,
  offset: 0
});

// Analyze pitch deck
const analysis = await withRetry(() =>
  pitchDeckService.analyzePitchDeck({ uploadId: uploadResult.uploadId })
);
```

---

## 6. Error Handling

### Common Error Scenarios

1. **Upload Errors**

   - `413 Payload Too Large`: File exceeds size limit
   - `415 Unsupported Media Type`: Invalid file format
   - `Network Error`: Connection interrupted during upload

2. **Analysis Errors**

   - `409 Conflict`: File already being analyzed
   - `422 Unprocessable Entity`: Invalid file format for analysis
   - `503 Service Unavailable`: Analysis service busy

3. **Retriable Errors**
   - `502 Bad Gateway`
   - `503 Service Unavailable`
   - `504 Gateway Timeout`
   - `ECONNRESET` (Network error)

### Error Recovery Patterns

```typescript
// Upload with error handling and retry
try {
  const result = await withRetry(() => pitchDeckService.uploadPitchDeck(file), { maxRetries: 5 });
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
```

---

## 7. Best Practices

### 1. File Uploads

- Use `UploadPitchDeckWithMetadataRequest` for better organization
- Implement progress tracking for large files
- Validate file size and type before upload

### 2. Retry Strategy

- Use retry for transient failures only
- Set appropriate retry counts based on operation type
- Implement user feedback during retries

### 3. Status Handling

- Display status-appropriate UI (loading, error states)
- Use `getStatusLabel` and `getStatusColor` for consistent UI
- Handle error states gracefully with retry options

### 4. Performance

- Limit pagination results with `limit` parameter
- Use offset for pagination
- Cache frequently accessed pitch deck lists

---

## 8. Testing

### Unit Tests

```typescript
// Test retry utility
describe('withRetry', () => {
  it('should succeed on first attempt', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(mockFn);
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    const mockFn = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('success');

    const result = await withRetry(mockFn, { maxRetries: 2 });
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
```

### Integration Tests

```typescript
// Test API service with mock server
describe('PitchDeckService', () => {
  it('should upload pitch deck', async () => {
    const service = new PitchDeckService();
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    const result = await service.uploadPitchDeck({ file: mockFile });

    expect(result).toHaveProperty('uploadId');
    expect(result).toHaveProperty('filename');
  });
});
```

---

## 9. Migration Guide

### Legacy Types

The legacy 4-category structure is deprecated but supported for transition:

```typescript
// Legacy types (deprecated)
export type CategoryScores = {
  narrative: number;
  design: number;
  business: number;
  market: number;
};
```

**Migration Path:**

1. Update UI to use new VC framework types
2. Replace `CategoryScores` with `VCCategoryScore`
3. Update analysis display to use `StrengthItem[]` and `ImprovementItem[]`
4. Add competitive analysis features when available

---

## 10. Version History

| Version | Date       | Changes                             |
| ------- | ---------- | ----------------------------------- |
| 1.0.0   | 2026-02-03 | Initial API documentation           |
| 1.1.0   | 2026-02-03 | Added VC framework types            |
| 1.2.0   | 2026-02-03 | Added retry utility documentation   |
| 1.3.0   | 2026-02-03 | Wave 3: Pitch deck management pages |

---

## 11. Wave 3 Implementation Notes

### Current Status

The pitch deck management UI components are fully implemented with mock data. Actual API integration is pending backend implementation.

### Implemented Components

#### 1. Pitch Deck Store

```typescript
// src/stores/pitch-deck-management.store.ts
export const usePitchDeckManagementStore = create<PitchDeckState & PitchDeckActions>()(
  persist(
    (set, get) => ({
      // Initial state
      pitchDecks: [],
      total: 0,
      limit: 10,
      offset: 0,
      filters: {},
      isLoading: false,
      error: null,

      // Actions
      fetchPitchDecks: async () => {
        // Mock implementation - replace with actual API call
        set({ isLoading: true, error: null });
        try {
          const response = await mockFetchPitchDecks(get().filters, get().offset, get().limit);
          set({
            pitchDecks: response.items,
            total: response.total,
            isLoading: false
          });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      removePitchDeck: (uuid) => {
        // Optimistic update
        set((state) => ({
          pitchDecks: state.pitchDecks.filter((deck) => deck.uuid !== uuid)
        }));
      }
    }),
    {
      name: 'pitch-deck-storage'
    }
  )
);
```

#### 2. Service Layer Implementation

```typescript
// src/services/api/pitch-deck-management.service.ts
export const deletePitchDeckByUuid = async (uuid: string): Promise<void> => {
  // TODO: Replace with actual API call when ready
  // await httpClient.delete(`/pitch-deck/${uuid}`);

  await new Promise((resolve) => setTimeout(resolve, 500));
};

export const mockFetchPitchDecks = async (
  filters: { status?: PitchDeckStatus },
  offset: number,
  limit: number
): Promise<{ items: PitchDeckListItem[]; total: number }> => {
  // Mock implementation generating sample data
  // In production, this will be replaced with actual API call
  return generateMockPitchDeckData(filters, offset, limit);
};
```

### Mock Data Generation

The current implementation uses mock data for development and testing purposes. The `mock-analysis.ts` utility generates realistic pitch deck data with:

- Random UUIDs using valid UUID v4 format
- Various status states (uploading, processing, ready, error)
- Realistic file metadata (filenames, sizes, types)
- Mock timestamps for created/updated dates
- Sample descriptions and tags

### API Integration Points

When the backend API is ready, the following integration points need to be updated:

1. **Fetch Pitch Decks List**

   ```typescript
   // Replace mock with actual API call
   const response = await httpClient.get<ListPitchDecksResponse>('/pitch-deck', {
     params: {
       status: filters.status,
       limit,
       offset
     }
   });
   ```

2. **Delete Pitch Deck**

   ```typescript
   // Replace mock with actual API call
   await httpClient.delete(`/pitch-deck/${uuid}`);
   ```

3. **Upload Pitch Deck**
   ```typescript
   // Currently using mock upload in pitch-deck.service.ts
   // Replace with actual file upload implementation
   ```

### UI-Ready Features

The Wave 3 implementation includes all UI components needed for:

- ✅ Pitch deck listing with pagination
- ✅ Status-based filtering
- ✅ Delete functionality with confirmation
- ✅ Upload interface with metadata
- ✅ Detail view with actions
- ✅ UUID validation and error handling
- ✅ Toast notifications for feedback
- ✅ Responsive design with Tailwind CSS

### Next Steps for API Integration

1. Implement backend API endpoints
2. Replace mock functions with actual HTTP calls
3. Add authentication headers (already handled by HTTP client)
4. Implement real-time status updates (WebSocket/SSE)
5. Add file upload progress tracking

---

_Last Updated: 2026-02-03_
_API Version: 1.3.0_
