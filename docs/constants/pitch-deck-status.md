# Pitch Deck Status Constants

## Overview

The pitch deck status system (`src/constants/pitch-deck-status.ts`) provides a standardized way to track and display the lifecycle of uploaded pitch deck files. This system ensures consistency across the application and provides clear visual feedback to users.

## Status Values

The system uses four primary status values:

```typescript
export type PitchDeckStatus = 'uploading' | 'processing' | 'ready' | 'error';
```

### Status Descriptions

| Status       | Description                                      | Typical Duration       | User Action Required             |
| ------------ | ------------------------------------------------ | ---------------------- | -------------------------------- |
| `uploading`  | File is being uploaded to the server             | 1-60 seconds           | Wait for upload to complete      |
| `processing` | File is being analyzed by the VC framework       | 30 seconds - 5 minutes | Wait for analysis to complete    |
| `ready`      | File has been successfully uploaded and analyzed | Ongoing                | View results, download, or share |
| `error`      | Upload or processing failed                      | Ongoing                | Retry upload or contact support  |

## Status Configuration

### Color Scheme

Each status has an associated color scheme for consistent UI representation:

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

### Visual Indicators

#### Status Badge

```tsx
import { getStatusColor, getStatusLabel } from '@/constants/pitch-deck-status';

function StatusBadge({ status }: { status: PitchDeckStatus }) {
  const colorClass = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span className={`${colorClass} px-2 py-1 rounded-full text-sm font-medium`}>{label}</span>
  );
}
```

#### Progress Ring

```tsx
import { PitchDeckStatus } from '@/constants/pitch-deck-status';

function StatusProgress({ status }: { status: PitchDeckStatus }) {
  const progress = {
    uploading: 50,
    processing: 75,
    ready: 100,
    error: 0
  }[status];

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={2 * Math.PI * 28}
          strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)}
          className={`
            ${status === 'uploading' ? 'text-blue-500' : ''}
            ${status === 'processing' ? 'text-yellow-500' : ''}
            ${status === 'ready' ? 'text-green-500' : ''}
            ${status === 'error' ? 'text-red-500' : ''}
          `}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium">{progress}%</span>
      </div>
    </div>
  );
}
```

## Utility Functions

### `getStatusLabel`

```typescript
export const getStatusLabel = (status: PitchDeckStatus): string;
```

Returns the human-readable label for a status.

**Usage:**

```typescript
import { getStatusLabel } from '@/constants/pitch-deck-status';

const status = 'processing';
const label = getStatusLabel(status); // 'Processing'
```

### `getStatusColor`

```typescript
export const getStatusColor = (status: PitchDeckStatus): string;
```

Returns the Tailwind CSS color classes for a status.

**Usage:**

```typescript
import { getStatusColor } from '@/constants/pitch-deck-status';

const status = 'ready';
const colorClass = getStatusColor(status);
// 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
```

## UI Component Usage

### Status List Item

```tsx
import { PitchDeckListItem } from '@/types/response/pitch-deck';
import { StatusBadge } from '@/components/common/status-badge';

function PitchDeckItem({ deck }: { deck: PitchDeckListItem }) {
  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{deck.title}</h3>
          <p className="text-sm text-gray-500">{deck.originalFileName}</p>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={deck.status} />
            <span className="text-sm text-gray-500">{deck.fileSize} bytes</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{new Date(deck.createdAt).toLocaleDateString()}</p>
          {deck.status === 'ready' && (
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
              View Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Upload Progress

```tsx
import { PitchDeckStatus } from '@/constants/pitch-deck-status';

function UploadProgress({ status, progress }: { status: PitchDeckStatus; progress: number }) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        <StatusProgress status={status} />
        <div className="flex-1">
          <h3 className="font-medium mb-1">{getStatusLabel(status)}</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {status === 'uploading' && 'Uploading your pitch deck...'}
            {status === 'processing' && 'Analyzing your pitch deck...'}
            {status === 'ready' && 'Analysis complete!'}
            {status === 'error' && 'Upload failed. Please try again.'}
          </p>
        </div>
      </div>
    </div>
  );
}
```

## State Management Integration

### Zustand Store Example

```tsx
import { create } from 'zustand';
import { PitchDeckStatus, getStatusLabel } from '@/constants/pitch-deck-status';

interface PitchDeckState {
  uploadStatus: PitchDeckStatus | null;
  uploadProgress: number;
  error: string | null;

  setUploadStatus: (status: PitchDeckStatus) => void;
  setUploadProgress: (progress: number) => void;
  setError: (error: string | null) => void;

  getStatusMessage: () => string;
}

export const usePitchDeckStore = create<PitchDeckState>((set, get) => ({
  uploadStatus: null,
  uploadProgress: 0,
  error: null,

  setUploadStatus: (status) => set({ uploadStatus: status }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setError: (error) => set({ error }),

  getStatusMessage: () => {
    const { uploadStatus, error } = get();

    if (error) return `Error: ${error}`;
    if (!uploadStatus) return 'Ready to upload';

    const label = getStatusLabel(uploadStatus);
    return `${label}...`;
  }
}));
```

## API Integration

### Response Mapping

```typescript
// When receiving API response
const apiResponse: PitchDeckListItem = {
  id: '123',
  uuid: 'abc-def-ghi',
  title: 'Q3 2024 Investor Deck',
  description: 'Quarterly update for investors',
  originalFileName: 'q3-2024-investor-deck.pdf',
  mimeType: 'application/pdf',
  fileSize: 2048000,
  status: 'processing', // Maps directly to PitchDeckStatus
  chunkCount: 42,
  errorMessage: null,
  tags: ['q3', '2024', 'investor'],
  createdAt: '2026-02-03T12:00:00Z',
  updatedAt: '2026-02-03T12:00:00Z',
  lastAccessedAt: '2026-02-03T12:00:00Z'
};

// Display using status utilities
const statusColor = getStatusColor(apiResponse.status);
const statusLabel = getStatusLabel(apiResponse.status);
```

## Error Handling

### Error Status Display

```tsx
import { getStatusColor, getStatusLabel } from '@/constants/pitch-deck-status';

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  const status: PitchDeckStatus = 'error';

  return (
    <div className="p-6 text-center">
      <div className={`inline-flex items-center px-4 py-2 rounded-full ${getStatusColor(status)}`}>
        {getStatusLabel(status)}
      </div>
      <p className="mt-2 text-gray-600">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
```

## Testing

### Unit Tests for Status Utilities

```typescript
// __tests__/constants/pitch-deck-status.test.ts
import {
  PitchDeckStatus,
  PITCH_DECK_STATUS,
  getStatusLabel,
  getStatusColor
} from '@/constants/pitch-deck-status';

describe('PitchDeckStatus Constants', () => {
  test('should have all required status values', () => {
    expect(PITCH_DECK_STATUS).toEqual({
      uploading: expect.objectContaining({
        label: 'Uploading',
        color: expect.any(String)
      }),
      processing: expect.objectContaining({
        label: 'Processing',
        color: expect.any(String)
      }),
      ready: expect.objectContaining({
        label: 'Ready',
        color: expect.any(String)
      }),
      error: expect.objectContaining({
        label: 'Error',
        color: expect.any(String)
      })
    });
  });

  test('getStatusLabel should return correct label', () => {
    expect(getStatusLabel('uploading')).toBe('Uploading');
    expect(getStatusLabel('processing')).toBe('Processing');
    expect(getStatusLabel('ready')).toBe('Ready');
    expect(getStatusLabel('error')).toBe('Error');
  });

  test('getStatusColor should return color classes', () => {
    const uploadColor = getStatusColor('uploading');
    expect(uploadColor).toContain('bg-blue-100');
    expect(uploadColor).toContain('text-blue-700');

    const readyColor = getStatusColor('ready');
    expect(readyColor).toContain('bg-green-100');
    expect(readyColor).toContain('text-green-700');
  });
});
```

### Component Tests

```typescript
// __tests__/components/status-badge.test.tsx
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/common/status-badge';
import { PitchDeckStatus } from '@/constants/pitch-deck-status';

describe('StatusBadge', () => {
  test('displays correct label for uploading status', () => {
    render(<StatusBadge status="uploading" />);
    expect(screen.getByText('Uploading')).toBeInTheDocument();
  });

  test('has correct color classes for uploading', () => {
    const { container } = render(<StatusBadge status="uploading" />);
    expect(container.firstChild).toHaveClass('bg-blue-100');
    expect(container.firstChild).toHaveClass('text-blue-700');
  });

  test('displays error status correctly', () => {
    render(<StatusBadge status="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-red-100');
    expect(container.firstChild).toHaveClass('text-red-700');
  });
});
```

## Internationalization Considerations

### Status Labels for i18n

```typescript
// i18n/en.ts
export const en = {
  pitchDeck: {
    status: {
      uploading: 'Uploading',
      processing: 'Processing',
      ready: 'Ready',
      error: 'Error'
    }
  }
};

// i18n/vi.ts
export const vi = {
  pitchDeck: {
    status: {
      uploading: 'Đang tải lên',
      processing: 'Đang xử lý',
      ready: 'Sẵn sàng',
      error: 'Lỗi'
    }
  }
};
```

### Usage with i18n

```tsx
import { useTranslation } from 'next-i18next';
import { PitchDeckStatus } from '@/constants/pitch-deck-status';

function StatusBadge({ status }: { status: PitchDeckStatus }) {
  const { t } = useTranslation();

  const label = t(`pitchDeck.status.${status}`, {
    defaultValue: PITCH_DECK_STATUS[status].label
  });

  const colorClass = PITCH_DECK_STATUS[status].color;

  return (
    <span className={`${colorClass} px-2 py-1 rounded-full text-sm font-medium`}>{label}</span>
  );
}
```

## Best Practices

1. **Consistent Usage**: Always use the status constants and utilities instead of hardcoding values
2. **Visual Hierarchy**: Use color and size to indicate importance of status
3. **Accessibility**: Ensure color contrast meets WCAG guidelines
4. **State Persistence**: Store status in state management for real-time updates
5. **Error Recovery**: Provide clear pathways for users to recover from error states

---

_Last Updated: 2026-02-03_
_Version: 1.0.0_
