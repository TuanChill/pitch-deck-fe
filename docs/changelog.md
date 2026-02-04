# Changelog

All notable changes to the Pitch Deck Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Phase 01: API Constants & Types (2026-02-04)
  - All 9 backend endpoint URLs in api-url.ts
  - Request DTOs for pitch deck operations
  - Updated response types with files array and uuid fields
  - Barrel exports for service modules

### Changed

- Phase 01: API Constants & Types (2026-02-04)
  - Fixed uploadId to uuid consistency in response types
  - Updated detail page and upload form to use files array
  - Added pitch-deck.service.ts with mock implementations

### Changed

- Phase 03: Constants Update (2026-02-04)
  - Updated MAX_PITCH_DECK_SIZE from 10MB to 50MB in file-types.ts
  - Replaced hardcoded file size value in upload page with dynamic constant
  - Verified backend alignment for 50MB file size limit
  - Ensured consistent file size validation across application

### Planned

- Phase 04: Store Integration updates
- Phase 05: Error Handling & Testing

---

## [0.2.0] - 2026-02-03

### Added

- **Phase 08: Multi-File Pitch Deck Backend Integration**
  - PitchDeckFile entity with MikroORM relationship patterns
  - One-to-many relationship: PitchDeck → PitchDeckFile
  - Cascade delete configuration for data consistency
  - File status tracking: 'uploading' | 'ready' | 'error'
  - Organized storage pattern: `/uploads/pitchdecks/{deckUuid}/{fileUuid}.{ext}`
  - Foreign key indexes for performance optimization

### Changed

- **Database Layer Refactoring**
  - Removed file fields from PitchDeck entity
  - Added files collection to PitchDeck entity
  - Updated MikroORM module registration
  - Created constants/file-types.ts for DRY compliance

### Fixed

- **DRY Violation**: Consolidated MimeType type and MIME_TO_EXT constant
- **Security**: Added foreign key index to prevent query performance issues
- **Architecture**: Proper MikroORM relationship patterns with cascade delete

### Documentation

- Created project-roadmap.md for tracking multi-file backend integration
- Updated phase-01-database-layer.md with completion status
- Added changelog.md for version tracking

---

## [0.1.0] - 2026-02-01

### Added

- Initial Next.js 15 setup with App Router
- TypeScript strict mode configuration
- Tailwind CSS integration with dark mode
- shadcn/ui component library
- Zustand state management with localStorage persistence
- Axios HTTP client with JWT interceptors
- Pitch Deck status management system
- VC framework analysis types
- File upload interface with drag-and-drop
- Real-time upload progress tracking
- 11 pitch deck management components
- Dashboard navigation with route constants
- Authentication guards and protected routes

### Changed

- Configured ESLint + Prettier for consistent code formatting
- Set up Husky + lint-staged for pre-commit hooks
- Implemented retry utility with exponential backoff
- Created centralized route constants (APP_URL pattern)
- Added comprehensive error handling patterns

### Documentation

- Created codebase-summary.md with complete project overview
- Added code-standards.md for development guidelines
- Documented system architecture patterns
- Created API documentation for service contracts
- Added developer workflow documentation

---

### 2026-02-04

- **Phase 05 Complete**: Constants update and centralization
- **File Size Update**: MAX_PITCH_DECK_SIZE increased from 10MB to 50MB
- **UI Consistency**: Replaced hardcoded values with dynamic constants
- **Validation**: Updated file validation to use new size limit
- **Documentation**: Created comprehensive file-types.md constants documentation

## [0.0.1] - 2026-01-31

### Added

- Project initialization
- Basic folder structure
- Package.json dependencies setup
- TypeScript configuration
- Git repository initialization

---
