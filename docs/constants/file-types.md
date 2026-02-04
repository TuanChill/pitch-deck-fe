# File Type Constants

**File:** `src/constants/file-types.ts`

This module contains all constants and validation logic for file uploads in the pitch deck system. It provides centralized management of file type constraints and validation rules.

## Constants

### ALLOWED_PITCH_DECK_TYPES

```typescript
export const ALLOWED_PITCH_DECK_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
] as const;
```

**Description:** Array of MIME types accepted for pitch deck uploads.
**Purpose:** Ensures only specific file types are processed by the system.

### MAX_PITCH_DECK_SIZE

```typescript
export const MAX_PITCH_DECK_SIZE = 50 * 1024 * 1024; // 50MB
```

**Description:** Maximum file size for pitch deck uploads in bytes.
**Purpose:** Enforces server-side file size limits to prevent abuse.
**Note:** Must match backend API constraints.

### FILE_TYPE_LABELS

```typescript
export const FILE_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/vnd.ms-word': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'text/plain': 'TXT'
};
```

**Description:** Mapping of MIME types to human-readable labels.
**Purpose:** Provides consistent display names for file types in the UI.

### ALLOWED_FILE_EXTENSIONS

```typescript
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.txt'] as const;
```

**Description:** Array of file extensions accepted for pitch deck uploads.
**Purpose:** Fallback validation when MIME type detection fails.

## Functions

### validatePitchDeckFile

```typescript
export const validatePitchDeckFile = (file: File): { valid: boolean; error?: string } => {
  // Validation logic...
};
```

**Parameters:**

- `file` (`File`): The file to validate

**Returns:**

- `valid` (`boolean`): Whether the file is valid
- `error` (`string?`): Error message if invalid

**Validation Rules:**

1. Checks file type against `ALLOWED_PITCH_DECK_TYPES`
2. Validates file extension as fallback
3. Enforces `MAX_PITCH_DECK_SIZE` limit
4. Ensures file is not empty

**Example:**

```typescript
const result = validatePitchDeckFile(file);
if (!result.valid) {
  console.error(result.error);
  return;
}
```

### formatFileSize

```typescript
export const formatFileSize = (bytes: number): string => {
  // Formatting logic...
};
```

**Parameters:**

- `bytes` (`number`): File size in bytes

**Returns:**

- `string`: Formatted file size (e.g., "2.5 MB", "1.2 KB")

**Purpose:** Converts byte counts to human-readable format for display.

### getFileTypeLabel

```typescript
export const getFileTypeLabel = (file: File): string => {
  // Label extraction logic...
};
```

**Parameters:**

- `file` (`File`): The file to get label for

**Returns:**

- `string`: Human-readable file type label or filename extension

**Purpose:** Provides consistent file type naming throughout the application.

## Usage Examples

### Basic File Validation

```typescript
import { validatePitchDeckFile } from '@/constants/file-types';

const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const validation = validatePitchDeckFile(file);
if (!validation.valid) {
  alert(`Upload failed: ${validation.error}`);
  return;
}

// Proceed with upload...
```

### Display File Size in UI

```typescript
import { formatFileSize } from '@/constants/file-types';

function FileUploadProgress({ file }: { file: File }) {
  const formattedSize = formatFileSize(file.size);

  return (
    <div>
      <p>{file.name} ({formattedSize})</p>
    </div>
  );
}
```

### Upload Form Usage

```typescript
import { MAX_PITCH_DECK_SIZE, FILE_TYPE_LABELS } from '@/constants/file-types';

function UploadForm() {
  const maxSizeMB = MAX_PITCH_DECK_SIZE / 1024 / 1024;

  return (
    <div>
      <p>Maximum file size: {maxSizeMB}MB</p>
      <p>Supported types: {Object.values(FILE_TYPE_LABELS).join(', ')}</p>
    </div>
  );
}
```

## Best Practices

### 1. Always Use Constants

Never hardcode file size limits or type values in components:

```typescript
// ❌ Don't do this
const maxSize = 50 * 1024 * 1024;

// ✅ Do this
import { MAX_PITCH_DECK_SIZE } from '@/constants/file-types';
const maxSize = MAX_PITCH_DECK_SIZE;
```

### 2. Centralize Validation Logic

Use `validatePitchDeckFile` for all file upload validation:

```typescript
// ✅ Centralized validation
const { valid, error } = validatePitchDeckFile(file);

// ❌ Don't implement custom validation
if (file.size > 50 * 1024 * 1024) {
  // error...
}
```

### 3. Consistent Error Messaging

Use the error messages provided by `validatePitchDeckFile` for user feedback:

```typescript
const { valid, error } = validatePitchDeckFile(file);
if (!valid) {
  setError(error || 'Invalid file');
  return;
}
```

## Integration Points

### Upload Component Integration

The UploadForm component in `src/components/pitch-deck-management/upload-form.tsx` uses these constants:

```typescript
import { MAX_PITCH_DECK_SIZE, validatePitchDeckFile } from '@/constants/file-types';
```

### API Integration

The file upload API endpoint expects files that pass these validation checks. Ensure backend validation matches these constants.

### UI Integration

The upload page displays file size limits using the constant:

```typescript
import { MAX_PITCH_DECK_SIZE } from '@/constants/file-types';

// In JSX
<li>Maximum file size: {MAX_PITCH_DECK_SIZE / 1024 / 1024}MB per file</li>
```

## Maintenance

### When Updating Constants

1. **MAX_PITCH_DECK_SIZE Updates:**

   - Verify backend alignment before changing
   - Update all documentation references
   - Test with boundary conditions
   - Communicate changes to users if necessary

2. **ALLOWED_PITCH_DECK_TYPES Updates:**

   - Consider security implications of adding new types
   - Test with actual files of new types
   - Update error messages if needed

3. **FILE_TYPE_LABELS Updates:**
   - Ensure consistency with backend labels
   - Update display components if labels change

### Testing Strategy

- Unit tests for validation function with various file types and sizes
- Integration tests for upload workflow
- Boundary testing for file size limits
- Error message testing for user feedback

---

**Related Documentation:**

- [API Documentation](../api-docs.md) - Upload endpoints
- [System Architecture](../system-architecture.md) - File upload flow
- [Code Standards](../code-standards.md) - Constants management
