# Phase 05 Migration Guide: Integration Testing & Migration

This document provides migration guidance for the Phase 05 Integration Testing & Migration phase, focusing on final verification and migration of existing single-file pitch decks to the new multi-file structure.

## Overview

The Phase 05 updates complete the multi-file support implementation by adding comprehensive integration testing and providing migration scripts for existing deployments with single-file pitch decks.

## What Changed

### 1. Migration Script

**Database Migration Support:**

Located at `/Users/tuanchill/Desktop/Capylabs/tbx/RAG-be/migrations/260203-multi-file-pitch-deck.ts`:

```typescript
// Migration with up() and down() functions
export async function up(orm: MikroORM): Promise<void>;
export async function down(orm: MikroORM): Promise<void>;

// Manual migration for existing data
export async function migrateExisting(): Promise<void>;
```

**Key Features:**

- Verification of `PitchDeckFile` collection existence
- Safe rollback functionality
- Manual migration script for custom data transformation
- Complete error handling and logging

### 2. Migration Documentation

**Enhanced README with Checklists:**

Located at `/Users/tuanchill/Desktop/Capylabs/tbx/RAG-be/migrations/README.md`:

- **Pre-Deployment Checklist**: Backup requirements and testing steps
- **Post-Deployment Checklist**: Verification and monitoring steps
- **Detailed Migration Instructions**: Step-by-step guidance
- **Safety Notes**: Critical precautions

### 3. Migration Scripts

**Usage Examples:**

```bash
# Run migration (up)
cd /Users/tuanchill/Desktop/Capylabs/tbx/RAG-be
npx ts-node migrations/260203-multi-file-pitch-deck.ts up

# Rollback migration (down)
npx ts-node migrations/260203-multi-file-pitch-deck.ts down

# Manual migration for existing data
node -e "require('./migrations/260203-multi-file-pitch-deck.ts').migrateExisting()"
```

## Frontend Impact

### No Breaking Changes ✅

The frontend remains fully compatible with both single and multi-file structures:

```typescript
// Single file access (still works)
const fileName = response.files[0]?.originalFileName;
const fileSize = response.files[0]?.fileSize;

// Multi-file access
const files = response.files;
const fileCount = response.fileCount;
```

### Response Structure

The API response structure supports both patterns:

```typescript
{
  uuid: string,
  title: string,
  description: string,
  tags: string[],
  status: 'draft' | 'review' | 'approved' | 'rejected',
  fileCount: number,
  files: [
    {
      uuid: string,
      originalFileName: string,
      mimeType: string,
      fileSize: number,
      status: 'uploading' | 'ready' | 'error'
    }
  ]
}
```

## Migration Steps

### 1. Pre-Migration Preparation

**Backup Everything:**

```bash
# Backup MongoDB
mongodump --db your_db_name --collection pitch_decks --out ./backup/

# Backup uploaded files
cp -r /uploads/pitchdecks/ ./backup/pitchdecks-files/
```

**Test Environment:**

```bash
# Run migration in staging first
npx ts-node migrations/260203-multi-file-pitch-deck.ts up

# Verify migration results
# Check data integrity
# Test all CRUD operations
```

### 2. Migration Execution

**For New Deployments:**

1. Deploy the updated backend
2. Migration runs automatically via MikroORM
3. Verify collections exist
4. No manual migration needed

**For Existing Deployments:**

1. Complete pre-deployment backups
2. Deploy updated backend
3. Run manual migration script if needed
4. Verify data integrity

### 3. Post-Migration Verification

**Checklist:**

- [ ] All pitch decks accessible
- [ ] File counts correct
- [ ] Files display properly
- [ ] Upload/download works
- [ ] Delete operation works
- [ ] No orphaned files

**Verification Commands:**

```bash
# Check PitchDeckFile collection
db.pitch_deck_files.count()

# Check file counts in pitch_decks
db.pitch_decks.find({}, { fileCount: 1 })

# Verify file storage structure
ls -la /uploads/pitchdecks/
```

## Testing Considerations

### Integration Tests (Skipped)

**Per Project Rules:**

- Unit tests not configured
- E2E tests not configured
- Manual testing only

### Manual Testing Checklist

**Upload Flow:**

- [ ] Single file upload
- [ ] Multiple file upload
- [ ] Mixed valid/invalid files
- [ ] Large file handling
- [ ] Error messages displayed

**Download Flow:**

- [ ] File download
- [ ] Multiple files listing
- [ ] Corrupted file handling
- [ ] Permission checks

**Delete Flow:**

- [ ] Single file delete
- [ ] Entire deck delete
- [ ] Cascade delete verification
- [ ] Orphaned files cleanup

## Performance Considerations

### 1. Database Optimization

**Indexes:**

```typescript
@ManyToOne(() => PitchDeck, deck => deck.files, { onDelete: 'CASCADE' })
@Index({ name: 'idx_pitch_deck_file_deck' })  // Performance index
deck: PitchDeck;
```

**Query Optimization:**

```typescript
// Load files only when needed
await pitchDeck.files.loadItems();

// Use efficient filtering
const decks = await em.find(
  PitchDeck,
  {},
  {
    populate: ['files'],
    orderBy: { createdAt: 'DESC' }
  }
);
```

### 2. Memory Management

**File Handling:**

- Temporary files cleaned after validation
- Files loaded on demand only
- Stream-based file operations

### 3. Storage Efficiency

**File Organization:**

- Organized by deck UUID
- Automatic cleanup on deletion
- No duplicate storage

## Error Handling

### Common Migration Issues

1. **Database Connection Errors**

   ```typescript
   // Check MikroORM configuration
   await MikroORM.init();
   ```

2. **File System Errors**

   ```typescript
   // Ensure upload directory exists
   await fs.mkdir('/uploads/pitchdecks/', { recursive: true });
   ```

3. **Data Corruption**
   ```typescript
   // Always backup before migration
   // Verify checksums after migration
   ```

### Rollback Procedures

**Complete Rollback:**

```bash
# 1. Stop the application
pm2 stop pitch-deck-api

# 2. Restore from backup
mongorestore --db your_db_name --drop ./backup/pitch_decks/

# 3. Restore files
cp -r ./backup/pitchdecks-files/* /uploads/pitchdecks/

# 4. Run rollback migration
npx ts-node migrations/260203-multi-file-pitch-deck.ts down

# 5. Start application
pm2 start pitch-deck-api
```

## Deployment Strategy

### Production Deployment

**Blue-Green Deployment:**

1. Deploy to staging environment
2. Run full test suite
3. Verify migration results
4. Deploy to production
5. Monitor health metrics

**Zero-Downtime Migration:**

1. Prepare migration script
2. Put application in maintenance mode
3. Run migration
4. Verify results
5. Resume normal operation

### Monitoring Post-Migration

**Health Checks:**

```typescript
// Monitor collection sizes
const deckCount = await em.count(PitchDeck);
const fileCount = await em.count(PitchDeckFile);

// Monitor error rates
const errors = await em.find(PitchDeckFile, { status: 'error' });
```

**File System Monitoring:**

```bash
# Check disk usage
df -h /uploads/

# Check orphaned files
find /uploads/pitchdecks/ -name '*.pdf' -o -name '*.pptx' | wc -l
```

## Security Considerations

### File Validation

**Enhanced Validation:**

```typescript
const ALLOWED_MIMES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

// Magic number validation
const validateMagicNumbers = (file: Express.Multer.File) => {
  // Implementation for file type verification
};
```

### Access Control

**File Access:**

- JWT-based authentication
- Deck-level permissions
- File-level access control

## Support

### Issue Resolution

**Common Issues:**

1. Migration fails - Check logs and backup
2. Files not loading - Check relationship loading
3. Upload errors - Check file size and type validation
4. Performance issues - Check indexes and query optimization

### Debug Commands

```typescript
// Debug database state
console.log('Total decks:', await em.count(PitchDeck));
console.log('Total files:', await em.count(PitchDeckFile));
console.log('Error files:', await em.count(PitchDeckFile, { status: 'error' }));

// Debug file storage
console.log('Storage structure:', await fs.readdir('/uploads/pitchdecks/'));
```

### Contact Information

For issues related to Phase 05 implementation:

1. Check migration script in `/Users/tuanchill/Desktop/Capylabs/tbx/RAG-be/migrations/`
2. Review migration guide in `/Users/tuanchill/Desktop/Capylabs/tbx/RAG-be/migrations/README.md`
3. Check backend implementation in `/src/api/pitchdeck/`

---

_Last Updated: 2026-02-03_
_Version: 1.7.0 (Phase 05 Integration Testing & Migration)_
_Status: Complete - Ready for Production_
