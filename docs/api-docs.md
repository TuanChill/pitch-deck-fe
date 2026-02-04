# API Documentation

## Pitch Deck Management API

### Overview

This document provides comprehensive API documentation for the Pitch Deck Management system, including request/response types, status constants, and utility functions.

### Base API URL

```typescript
// Base URL: http://localhost:8082 (development)
// Configured in src/services/http/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8082';
```

### API Endpoint Constants

All endpoint URLs are centralized in `src/constants/api-url.ts`:

```typescript
export const API_URL = {
  // Auth endpoints
  GET_ME: '/users/me',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  // Pitch deck endpoints (4 total)
  PITCH_DECK: {
    UPLOAD: '/pitchdeck/upload',
    LIST: '/pitchdeck',
    DETAIL: (uuid: string) => `/pitchdeck/${uuid}`,
    DELETE: (uuid: string) => `/pitchdeck/${uuid}`
  },

  // Analysis endpoints (5 total)
  ANALYSIS: {
    START: '/analysis/start',
    STATUS: (uuid: string) => `/analysis/${uuid}/status`,
    DETAIL: (uuid: string) => `/analysis/${uuid}`,
    LIST: '/analysis',
    DELETE: (uuid: string) => `/analysis/${uuid}`
  }
} as const;
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
  uploadId: string; // DEPRECATED: Use deckId instead
};

export type StartAnalysisRequest = {
  deckId: string; // UUID of the pitch deck to analyze
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
  uploadId: string; // DEPRECATED: Use uuid instead
  filename: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
};

export type PitchDeckDetailResponse = {
  id: string;
  uuid: string;
  title: string;
  description?: string;
  status: PitchDeckStatus;
  chunkCount: number;
  fileCount: number;
  errorMessage?: string;
  tags?: string[];
  files: PitchDeckFile[];
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
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
export type PitchDeckDetailResponse = {
  id: string;
  uuid: string;
  title: string;
  description?: string;
  status: PitchDeckStatus;
  chunkCount: number;
  fileCount: number;
  errorMessage?: string;
  tags?: string[];
  files: PitchDeckFile[];
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
};

export type PitchDeckFile = {
  id: string;
  uuid: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  status: FileStatus;
  errorMessage?: string;
  createdAt: string;
};
```

#### File Status Types

```typescript
export type FileStatus = 'uploading' | 'processing' | 'ready' | 'error';
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
  uploadId: string; // DEPRECATED: Use deckId instead
  filename: string;
  overallScore: number;
  categoryScores: VCCategoryScore;
  strengths: StrengthItem[];
  improvements: ImprovementItem[];
  competitiveAnalysis?: CompetitiveAnalysis;
  analyzedAt: string;
};

export type AnalysisStatusResponse = {
  uuid: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  message?: string;
  estimatedTime?: number; // seconds remaining
};

export type AnalysisResponse = {
  deckId: string; // UUID of the analyzed pitch deck
  status: 'completed' | 'failed';
  result?: PitchDeckAnalysisResponse;
  error?: string;
  completedAt?: string;
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
  async startAnalysis(request: StartAnalysisRequest): Promise<AnalysisResponse>;
  async getAnalysisStatus(uuid: string): Promise<AnalysisStatusResponse>;
  async listPitchDecks(query?: ListPitchDecksQuery): Promise<ListPitchDecksResponse>;
  async getPitchDeckDetail(uuid: string): Promise<PitchDeckDetailResponse>;
  async deletePitchDeck(uuid: string): Promise<void>;
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
  pitchDeckService.startAnalysis({ deckId: uploadResult.uuid })
);

// Check analysis status
const status = await pitchDeckService.getAnalysisStatus(uploadResult.uuid);
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

## 12. Phase 04: Controller Layer Implementation

The controller layer has been updated to support multi-file uploads with enhanced security and validation.

### Key Changes Made

#### 1. Updated File Upload Interceptor

**From Single File to Multiple Files:**

```typescript
// BEFORE: Single file interceptor
@UseInterceptors(FileInterceptor('deck'))

// AFTER: Multiple files interceptor
@UseInterceptors(
  FilesInterceptor('files', 10, {
    storage: diskStorage({...}),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB per file
  })
)
```

#### 2. Updated Handler Signature

**From Single File to Files Array:**

```typescript
// BEFORE
async uploadDeck(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: UploadDeckDto
): Promise<PitchDeckResponseDto>

// AFTER
async uploadDeck(
  @UploadedFiles() files: Express.Multer.File[],
  @Body() dto: UploadDeckDto,
  @Request() req: { user: { sub: string } }
): Promise<PitchDeckResponseDto>
```

#### 3. Enhanced Multi-File Validation

**Individual File Validation with Bulk Cleanup:**

```typescript
// Validate each file
for (const file of files) {
  // Validate MIME type
  if (!ALLOWED_MIMES.includes(file.mimetype as any)) {
    // Clean up ALL files on any validation failure
    await Promise.allSettled(files.map((f) => fs.unlink(f.path)));
    throw new BadRequestException(
      `Invalid file type: ${basename(file.originalname)}. Allowed: PDF, PPT, PPTX, DOC, DOCX`
    );
  }

  // Validate magic numbers (file content)
  const fileBuffer = await fs.readFile(file.path);
  const fileType = await fileTypeFromBuffer(fileBuffer);
  // ... validation logic
}
```

#### 4. Enhanced Security

**Using basename() for Error Messages:**

```typescript
// Security enhancement: don't expose full file paths
throw new BadRequestException(`Invalid file type: ${basename(file.originalname)}.`);

// Instead of:
// throw new BadRequestException(`Invalid file type: ${file.originalname}`);
```

#### 5. Updated Service Call

**Passing Files Array to Service:**

```typescript
const pitchDeck = await this.pitchDeckService.uploadDeck(
  files, // ← Files array instead of single file
  dto,
  ownerId
);
```

#### 6. Updated Response Mapping

**Using deck.files.loadItems() for Files:**

```typescript
// Load all files for the deck
return PitchDeckResponseDto.fromEntity(pitchDeck, await pitchDeck.files.loadItems());
```

### Get/List Endpoint Updates

#### Get Endpoint

```typescript
async getDeck(@Param('uuid') uuid: string): Promise<PitchDeckResponseDto> {
  // ...
  return PitchDeckResponseDto.fromEntity(
    deck,
    deck.files.getItems()  // ← Use getItems() for loaded files
  );
}
```

#### List Endpoint

```typescript
async listDecks(): Promise<PitchDeckResponseDto[]> {
  const decks = await this.pitchDeckService.findByOwner(ownerId, {...});

  return decks.map((deck) =>
    PitchDeckResponseDto.fromEntity(
      deck,
      deck.files.getItems()  // ← Use getItems() for each deck's files
    )
  );
}
```

### Frontend Migration Notes

#### File Upload Changes

**No Breaking Changes for Frontend:**

The frontend upload interface remains the same since it uses `FormData`:

```typescript
// Frontend upload (unchanged)
const formData = new FormData();
formData.append('deck', file); // Still works for single file
formData.append('title', title);
formData.append('description', description);
formData.append('tags', JSON.stringify(tags));

// Multiple files support (future enhancement)
formData.append('files', file1); // New field for multiple files
formData.append('files', file2); // Multiple 'files' fields
```

#### Response Handling Changes

**Detail API Response Structure:**

```typescript
// Frontend now receives files array
const response = await api.getPitchDeckDetail(uuid);

// File metadata is now in an array
const files = response.files; // Array of files
const fileCount = response.fileCount; // Total count
const firstFileName = files[0]?.originalFileName; // Access individual files
```

### Security Improvements

1. **Bulk File Cleanup**: All temporary files are cleaned up if any file fails validation
2. **Path Sanitization**: Error messages use `basename()` to prevent path exposure
3. **File Size Limits**: 50MB limit per file with proper validation
4. **Magic Number Validation**: Validates actual file content against MIME type

### Performance Considerations

1. **Parallel Validation**: Files are validated in sequence but cleaned up in parallel
2. **Lazy Loading**: Files are loaded only when needed using `getItems()`
3. **Memory Management**: Temporary files are cleaned up after validation

### Error Handling Patterns

```typescript
// Multi-file specific error handling
if (!files || files.length === 0) {
  throw new BadRequestException('No files provided');
}

// Validation errors with file names
if (!ALLOWED_MIMES.includes(file.mimetype as any)) {
  throw new BadRequestException(`Invalid file type: ${basename(file.originalname)}`);
}
```

---

## 13. Version History

| Version | Date       | Changes                                                  |
| ------- | ---------- | -------------------------------------------------------- |
| 1.0.0   | 2026-02-03 | Initial API documentation                                |
| 1.1.0   | 2026-02-03 | Added VC framework types                                 |
| 1.2.0   | 2026-02-03 | Added retry utility documentation                        |
| 1.3.0   | 2026-02-03 | Wave 3: Pitch deck management pages                      |
| 1.4.0   | 2026-02-03 | Backend database layer (Phase 01) completed              |
| 1.5.0   | 2026-02-03 | Multi-file support - DTO layer (Phase 02)                |
| 1.6.0   | 2026-02-03 | Controller layer updates (Phase 04) - Multi-file support |
| 1.7.0   | 2026-02-03 | Frontend API constants & types (Phase 01) - UUID identifiers, multi-file support |

---

## 10. Migration Guide: Multi-File Support

### Breaking Changes (Phase 02)

The backend has been updated to support multiple files per pitch deck. This introduces a breaking change in the API response structure.

#### Response Structure Changes

**Before (Single File)**:

```typescript
// OLD: File metadata at deck level
export type PitchDeckDetailResponse = {
  id: string;
  uuid: string;
  title: string;
  originalFileName: string; // ← At deck level
  mimeType: string; // ← At deck level
  fileSize: number; // ← At deck level
  status: PitchDeckStatus;
  // ... other fields
};
```

**After (Multi-File)**:

```typescript
// NEW: File metadata in files array
export type PitchDeckDetailResponse = {
  id: string;
  uuid: string;
  title: string;
  status: PitchDeckStatus;
  fileCount: number; // ← Total number of files
  files: PitchDeckFile[]; // ← New files array
  // ... other deck-level fields
};

export type PitchDeckFile = {
  id: string;
  uuid: string;
  originalFileName: string; // ← Moved from deck level
  mimeType: string; // ← Moved from deck level
  fileSize: number; // ← Moved from deck level
  status: FileStatus; // ← Individual file status
  // ... file-specific fields
};
```

#### Frontend Migration Steps

1. **Update File Access Pattern**

   ```typescript
   // OLD WAY
   const fileName = response.originalFileName;
   const fileSize = response.fileSize;
   const fileType = response.mimeType;

   // NEW WAY
   const files = response.files;
   const fileName = files[0]?.originalFileName;
   const fileSize = files[0]?.fileSize;
   const fileType = files[0]?.mimeType;
   ```

2. **Update File Display Components**

   ```typescript
   // OLD: Single file display
   <div>
     <h3>{deck.originalFileName}</h3>
     <p>Size: {deck.fileSize} bytes</p>
   </div>

   // NEW: Multi-file display
   <div>
     <h3>Uploaded Files ({deck.fileCount})</h3>
     {deck.files.map((file) => (
       <div key={file.uuid}>
         <h4>{file.originalFileName}</h4>
         <p>Size: {file.fileSize} bytes</p>
         <p>Status: {file.status}</p>
       </div>
     ))}
   </div>
   ```

3. **Upload Request (Unchanged)**

   The upload request interface remains the same:

   ```typescript
   // No changes needed
   uploadPitchDeckWithMetadata({
     deck: file,
     title: 'My Pitch Deck',
     description: 'Description',
     tags: ['tag1', 'tag2']
   });
   ```

### Backward Compatibility

- ✅ **Upload Requests**: No changes required
- ✅ **List API**: No changes required (still returns array of decks)
- ❌ **Detail API**: Breaking change - must use `files` array
- ⚠️ **File Metadata**: Now accessed via `files[0]` instead of direct properties

### Timeline

- **Phase 02 Completed**: DTO layer updated (backend)
- **Phase 03 Completed**: Service layer implementation
- **Phase 04 Completed**: Controller layer updates (multi-file support)
- **Phase 05 Upcoming**: Integration testing

---

## 11. Backend Architecture Updates

### Phase 02: DTO Layer (Completed)

The backend DTO layer has been updated to support the multi-file architecture while maintaining clean separation of concerns.

#### Key Changes Made

1. **Created `PitchDeckFileResponseDto`**

   - Dedicated DTO for individual file metadata
   - Includes file-specific fields (UUID, filename, MIME type, size, status)
   - Static `fromEntity()` method for proper mapping

2. **Updated `PitchDeckResponseDto`**

   - Moved file fields to `files` array
   - Added `fileCount` property for quick reference
   - Updated mapping logic to handle entity relationships

3. **Maintained Upload Interface**
   - `UploadDeckDto` unchanged (metadata stays deck-level)
   - Clean barrel exports for all DTOs

#### Data Flow Transformation

```typescript
// Backend Entity Mapping
PitchDeckEntity + PitchDeckFileEntity[]
    ↓ (DTO Conversion)
PitchDeckResponseDto + PitchDeckFileResponseDto[]
    ↓ (API Response)
Frontend Response with files array
```

#### Benefits

- **Scalability**: Support for multiple files per deck
- **Type Safety**: Strong typing throughout the conversion process
- **Performance**: Quick access to file count via separate property
- **Maintainability**: Clear separation between deck and file metadata

#### Next Steps

1. ✅ **Phase 03**: Update service layer to populate files array
2. ✅ **Phase 04**: Update controller to use new DTO structure
3. **Phase 05**: Integration testing with multi-file scenarios

---

## 12. Wave 3 Implementation Notes

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

## 12. Backend Architecture Updates

### Phase 01: Database Layer (Completed)

The backend has been enhanced with a multi-file entity structure to support more flexible pitch deck management.

#### New Entity Relationships

```typescript
// Multi-file approach (NEW)
PitchDeck
└── files: Collection<PitchDeckFile>

PitchDeckFile
├── deck: ManyToOne(PitchDeck)
├── originalFileName: string
├── mimeType: MimeType
├── fileSize: number
└── storagePath: string
```

#### Key Improvements

1. **Scalability**: Support for multiple files per pitch deck
2. **Data Integrity**: Proper MikroORM relationships with cascade delete
3. **Performance**: Indexed foreign key queries
4. **Maintainability**: Clear separation of concerns

#### Frontend Compatibility

- ✅ All existing API contracts remain valid
- ✅ No breaking changes to frontend types
- ✅ Enhanced capabilities for future multi-file support

#### DRY Compliance

The backend now follows DRY principles with centralized file type constants:

```typescript
// src/api/pitchdeck/constants/file-types.ts
export type MimeType = /* ... */;
export const MIME_TO_EXT = /* ... */;
```

#### Migration Strategy

- Current: Single-file decks still supported
- Phase 05: Database migration for existing data
- Future: Multi-file upload capabilities

---

_Last Updated: 2026-02-03_
_API Version: 1.7.0_
