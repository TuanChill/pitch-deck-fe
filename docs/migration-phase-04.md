# Phase 04 Migration Guide: Controller Layer Updates

This document provides migration guidance for the Phase 04 Controller Layer updates, which bring multi-file support to the pitch deck upload system.

## Overview

The Phase 04 updates complete the multi-file support implementation by updating the controller layer to handle multiple files per upload with enhanced security and validation.

## What Changed

### 1. File Upload Interceptor

**From Single to Multiple Files:**

```typescript
// BEFORE (Single file)
@UseInterceptors(FileInterceptor('deck'))
async uploadDeck(@UploadedFile() file: Express.Multer.File, ...)

// AFTER (Multiple files)
@UseInterceptors(
  FilesInterceptor('files', 10, {
    storage: diskStorage({...}),
    limits: { fileSize: 50 * 1024 * 1024 }
  })
)
async uploadDeck(@UploadedFiles() files: Express.Multer.File[], ...)
```

### 2. Enhanced Validation

**Bulk Validation with Cleanup:**

```typescript
// Validate each file with bulk cleanup on failure
for (const file of files) {
  if (!ALLOWED_MIMES.includes(file.mimetype as any)) {
    // Clean up ALL files on any failure
    await Promise.allSettled(files.map((f) => fs.unlink(f.path)));
    throw new BadRequestException(`Invalid file type: ${basename(file.originalname)}`);
  }
}
```

### 3. Security Enhancements

**Path Sanitization:**

- Error messages now use `basename()` to prevent path exposure
- No full file paths leaked in error responses

### 4. Service Integration

**Files Array Passed to Service:**

```typescript
const pitchDeck = await this.pitchDeckService.uploadDeck(
  files, // Files array instead of single file
  dto,
  ownerId
);
```

### 5. Response Updates

**Using `getItems()` for Files:**

```typescript
// Load files efficiently
return PitchDeckResponseDto.fromEntity(pitchDeck, await pitchDeck.files.loadItems());
```

## Frontend Impact

### No Breaking Changes ✅

The frontend API interface remains unchanged:

```typescript
// Upload interface (unchanged)
const formData = new FormData();
formData.append('deck', file); // Still works for single files
formData.append('title', title);
formData.append('description', description);
formData.append('tags', JSON.stringify(tags));
```

### Response Structure Updates

**Detail API Response:**

```typescript
const response = await api.getPitchDeckDetail(uuid);

// New structure
const files = response.files; // Array of files
const fileCount = response.fileCount; // Total count
const fileName = files[0]?.originalFileName; // Access first file
```

### Migration Steps

#### 1. Update File Display Components

```typescript
// BEFORE (Single file)
<h3>{deck.originalFileName}</h3>
<p>Size: {deck.fileSize} bytes</p>

// AFTER (Multi-file)
<h3>Uploaded Files ({deck.fileCount})</h3>
{deck.files.map((file) => (
  <div key={file.uuid}>
    <h4>{file.originalFileName}</h4>
    <p>Size: {file.fileSize} bytes</p>
    <p>Status: {file.status}</p>
  </div>
))}
```

#### 2. Update File Access Patterns

```typescript
// BEFORE
const fileName = response.originalFileName;
const fileSize = response.fileSize;

// AFTER
const files = response.files;
const fileName = files[0]?.originalFileName;
const fileSize = files[0]?.fileSize;
```

#### 3. Handle Multiple Files (Future Enhancement)

When multiple file support is enabled on frontend:

```typescript
// Multiple files upload
formData.append('files', file1);
formData.append('files', file2);
// ... for each file
```

## Security Considerations

### 1. File Validation

- Each file is validated individually
- Bulk cleanup on any validation failure
- Magic number validation to prevent spoofing

### 2. Error Messages

- No file paths exposed in errors
- Only filenames shown using `basename()`
- Clear error messages for specific validation failures

### 3. File Limits

- Maximum 10 files per upload
- 50MB per file limit
- Temporary files cleaned up after validation

## Performance Optimizations

### 1. Lazy Loading

Files are loaded only when needed using `getItems()`:

```typescript
// Efficient file loading
deck.files.getItems(); // Loads files on demand
```

### 2. Bulk Operations

Parallel cleanup using `Promise.allSettled()`:

```typescript
// Parallel file cleanup
await Promise.allSettled(files.map((f) => fs.unlink(f.path)));
```

### 3. Memory Management

- Temporary files cleaned up after validation
- Files loaded only for requested decks
- Efficient relationship loading

## Error Handling

### Common Error Scenarios

1. **No Files Provided**

   ```typescript
   if (!files || files.length === 0) {
     throw new BadRequestException('No files provided');
   }
   ```

2. **Invalid File Type**

   ```typescript
   if (!ALLOWED_MIMES.includes(file.mimetype as any)) {
     throw new BadRequestException(`Invalid file type: ${basename(file.originalname)}`);
   }
   ```

3. **File Size Exceeded**
   ```typescript
   // 50MB limit enforced by interceptor
   // Error handled automatically by ParseFilePipeBuilder
   ```

### Frontend Error Handling

```typescript
try {
  const result = await api.uploadPitchDeck(formData);
  // Handle success
} catch (error) {
  if (error.response?.status === 400) {
    const message = error.response.data.message;
    // Show user-friendly error message
  }
}
```

## Testing Considerations

### Unit Tests

```typescript
// Test multi-file validation
describe('uploadDeck', () => {
  it('should validate multiple files', async () => {
    const mockFiles = [file1, file2, invalidFile];
    // Test validation logic
  });

  it('should clean up files on validation failure', async () => {
    // Test cleanup mechanism
  });
});
```

### Integration Tests

```typescript
// Test complete upload flow
describe('Upload Integration', () => {
  it('should handle multiple file upload', async () => {
    // Test with multiple valid files
  });

  it('should reject mixed valid/invalid files', async () => {
    // Test validation failure cleanup
  });
});
```

## Timeline and Dependencies

### Completed Phases

- ✅ **Phase 01**: Database layer (multi-file entities)
- ✅ **Phase 02**: DTO layer (response structures)
- ✅ **Phase 03**: Service layer (business logic)
- ✅ **Phase 04**: Controller layer (multi-file support)

### Next Phase

- **Phase 05**: Integration testing and final validation

## Troubleshooting

### Common Issues

1. **Files Not Loading**

   - Check `deck.files.getItems()` is called
   - Verify relationship loading in service

2. **Upload Failing**

   - Check file size limits (50MB per file)
   - Verify file types are in ALLOWED_MIMES
   - Check magic number validation

3. **Response Structure**
   - Access files via `response.files`
   - Use `fileCount` for total count
   - Map through files array for individual files

### Debug Tips

```typescript
// Debug file upload
console.log('Uploaded files:', files);
console.log('File count:', files.length);
console.log('First file:', files[0]?.originalFileName);

// Debug response
console.log('Response files:', response.files);
console.log('File count:', response.fileCount);
```

## Support

For issues related to Phase 04 implementation:

1. Check the controller implementation in `/src/api/pitchdeck/pitchdeck.controller.ts`
2. Review DTOs in `/src/api/pitchdeck/dto/`
3. Check service layer in `/src/api/pitchdeck/pitchdeck.service.ts`

---

_Last Updated: 2026-02-03_
_Version: 1.6.0 (Phase 04 Controller Layer)_
