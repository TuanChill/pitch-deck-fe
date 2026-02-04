# Project Overview - Product Development Requirements (PDR)

## Project Information

**Project Name:** pitch-deck-management
**Version:** 0.1.0
**Description:** Pitch deck management system with upload, analysis, and VC framework evaluation capabilities
**Status:** Phase 03 Complete - Constants Update Implementation

## Technology Stack

### Core Framework

- **Next.js 15.5** - React framework with App Router and Server Components
- **React 19 RC** - Latest React with concurrent features and hooks
- **TypeScript 5.7** - Type-safe JavaScript with modern features

### Styling & UI

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library with Radix UI primitives
- **tailwind-merge** - Tailwind CSS class merging utilities
- **tailwindcss-animate** - Animation utilities for Tailwind CSS

### State Management

- **Zustand** - Lightweight state management solution
- **React Context API** - Theme and authentication contexts

### HTTP & API

- **Axios** - Promise-based HTTP client
- **Zod** - TypeScript-first schema validation

### Development Tools

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Testing Library** - Testing utilities
- **Husky & lint-staged** - Git hooks for pre-commit checks

### Build & Deployment

- **PostCSS** - CSS transformation tool
- **Autoprefixer** - CSS vendor prefixing
- **pnpm** - Fast, disk space efficient package manager

## Key Features

### 1. Authentication System

- JWT-based authentication with state persistence
- Protected routes and guards
- Automatic token refresh handling
- User session management

### 2. Dark Mode Support

- Theme provider with light/dark mode switching
- System preference detection
- Persistent theme selection

### 3. State Management

- Centralized user authentication state
- Persistent storage for user data
- Reactive state updates with Zustand

### 4. Testing Infrastructure

- Comprehensive test setup with Jest
- React Testing Library integration
- Coverage reports and CI/CD support
- Storybook for component development

### 5. Developer Experience

- ESLint + Prettier for consistent code style
- Husky pre-commit hooks
- lint-staged for staged file formatting
- TypeScript strict mode enabled

### 6. Pitch Deck Management

- File upload with chunked transfer support
- Real-time status tracking (uploading, processing, ready, error)
- VC framework analysis with 7 key categories
- **Sophisticated polling mechanism with exponential backoff** (Phase 03)
- **Real-time progress tracking** during analysis operations
- Retry mechanism for transient failures
- Comprehensive API type definitions
- Multi-file support with metadata management
- **Multi-File Upload UI** (Phase 01): File selection up to 10 files with individual removal
- **Dynamic File Management**: Real-time file count tracking and progress display

### 7. Performance Optimizations

- Next.js App Router for efficient routing
- Code splitting and lazy loading
- Optimized bundle sizes
- Image optimization support

## Product Requirements

### Functional Requirements

1. **User Authentication**

   - Login/logout functionality
   - Protected route access
   - Token-based authorization
   - Session persistence

2. **Theme Management**

   - Light/dark mode toggle
   - System preference detection
   - Theme persistence across sessions

3. **API Integration**

   - RESTful API communication
   - Request/response interceptors
   - Error handling and status codes
   - Axios configuration with timeouts

4. **Pitch Deck Management**
   - File upload with metadata support
   - Real-time status tracking
   - VC framework analysis integration
   - Automatic retry mechanism for transient failures
   - Pagination and filtering for pitch deck lists

### Non-Functional Requirements

1. **Code Quality**

   - TypeScript strict mode
   - ESLint rule enforcement
   - Prettier formatting
   - Consistent coding standards

2. **Performance**

   - Fast initial load times
   - Optimized bundle sizes
   - Efficient state management
   - Proper image handling

3. **Maintainability**

   - Clear directory structure
   - Consistent naming conventions
   - Comprehensive documentation
   - Type-safe API contracts

4. **Testing**
   - Unit tests for utilities
   - Component tests with RTL
   - Integration tests
   - Coverage reporting

## Backend Implementation

### Multi-File Pitch Deck Architecture

The backend is being enhanced to support multiple files per pitch deck, following a 5-phase implementation approach:

#### Phase 01: Database Layer (Completed)

- Created `PitchDeckFile` entity for file metadata
- Updated `PitchDeck` entity to support one-to-many relationship
- Implemented cascade delete for data integrity
- Added file type constants and utilities

#### Phase 02: DTO Layer (Completed)

- Created `PitchDeckFileResponseDto` for individual file responses
- Updated `PitchDeckResponseDto` with `files` array structure
- Maintained backward compatibility for upload requests
- Added proper type safety and Swagger documentation

#### Phase 03: Service Layer (In Progress)

- Implement multi-file upload logic with transactions
- Handle file processing and status updates
- Map entities to DTOs for clean API responses

#### Phase 04: Controller Layer

- Update endpoints to handle multiple files
- Implement `FilesInterceptor` for multi-file uploads
- Add proper error handling for file operations

#### Phase 05: Integration Testing

- End-to-end verification of multi-file workflows
- Performance testing with multiple files
- Migration path for existing single-file data

#### Key Architecture Decisions

1. **Reference Pattern**: PitchDeck (1) → (N) PitchDeckFile
2. **Cascade Delete**: Files auto-delete when deck deleted
3. **Storage Path**: `/uploads/pitchdecks/{deckUuid}/{fileUuid}.{ext}`
4. **Sequential Upload**: Process files one-by-one (MVP)

#### API Contract Changes

- **Breaking Change**: File fields moved from deck level to `files[]` array
- **Frontend Impact**: Must use `response.files[0]` instead of direct file properties
- **Upload Interface**: Unchanged (metadata stays deck-level)

## Acceptance Criteria

### Basic Setup

- [ ] Project builds successfully
- [ ] ESLint passes without errors
- [ ] Prettier formatting is consistent
- [ ] TypeScript compilation succeeds

### Authentication

- [ ] User can login with valid credentials
- [ ] Protected routes are inaccessible without auth
- [ ] JWT tokens are properly stored and refreshed
- [ ] Logout clears user state

### Theme System

- [ ] Theme switcher functions correctly
- [ ] Theme persists across page refreshes
- [ ] System preference is detected
- [ ] UI elements adapt to theme

### API Integration

- [ ] HTTP client is properly configured
- [ ] Requests include authentication headers
- [ ] Error handling is implemented
- [ ] API responses are properly typed

### Pitch Deck Management

- [ ] File upload functionality works with metadata
- [ ] Status tracking displays correctly (uploading, processing, ready, error)
- [ ] Retry mechanism handles transient failures
- [ ] Pitch deck lists load with pagination
- [ ] VC framework analysis results display properly

## Implementation Status

### ✅ Completed

- Basic Next.js setup with App Router
- TypeScript configuration
- Tailwind CSS integration
- shadcn/ui component setup
- Basic project structure
- ESLint + Prettier configuration
- Husky + lint-staged setup
- Zustand store configuration
- HTTP client with Axios
- Basic layout components
- Pitch deck status constants and utilities
- API type definitions for pitch deck management
- Retry utility with exponential backoff
- Service layer architecture for pitch deck API
- **Analysis Service Layer (Phase 03)**: Complete polling mechanism with real-time progress tracking
- **Multi-File Upload UI (Phase 01)**: FileUploader with multi-file selection, individual removal, and file count management
- **All 5 analysis endpoints**: start, status, result, list, delete
- **Exponential backoff polling**: 1s → 30s with random jitter
- **Progress callback system**: Real-time UI updates
- **Type-safe analysis responses**: Complete VC framework integration
- **Error handling**: Timeout protection and graceful degradation

### 🚧 In Progress

- Authentication system implementation
- Theme provider integration
- API service integration
- Component library expansion
- Pitch deck upload UI implementation ✅ (Multi-file support complete)
- Pitch deck multi-file analysis page implementation
- Pitch deck list management interface
- Status display components
- VC framework analysis visualization

### ❌ Planned

- Storybook configuration
- Additional UI components
- Error boundary implementation
- Loading states
- Form validation
- Internationalization support

## Dependencies & Requirements

### Node.js

- Version: >= 18.20.2

### Package Manager

- pnpm: ^9.1.1

### Browser Support

- Modern browsers with ES2017+ support
- Chrome, Firefox, Safari, Edge latest versions

## Security Considerations

1. **Environment Variables**

   - All sensitive data in .env files
   - Environment validation with @t3-oss/env-nextjs

2. **Authentication**

   - JWT token storage in secure cookies (planned)
   - HTTPS requirement in production
   - CSRF protection (planned)

3. **Input Validation**
   - Zod schema validation for API requests
   - Type checking at runtime
   - Sanitization of user inputs

## Future Enhancements

### Phase 1 (v0.2.0) - Foundation Layer

- ✅ Pitch deck status constants and utilities
- ✅ API type definitions for pitch deck management
- ✅ Retry utility with exponential backoff
- ✅ Service layer architecture for pitch deck API
- 🚧 Pitch deck upload UI implementation
- 🚧 Pitch deck list management interface
- 🚧 Status display components
- 🚧 VC framework analysis visualization
- Form validation with Zod and React Hook Form
- Error boundaries and error pages
- Loading states and skeletons
- SEO optimization

### Phase 2 (v0.3.0)

- Internationalization (i18n)
- Analytics integration
- Performance monitoring
- Accessibility improvements

### Phase 3 (v1.0.0)

- CMS integration
- E-commerce features
- Real-time features (WebSockets)
- PWA capabilities

## Maintainers

- Development Team: TBX/Capylabs
- Contact: development@capylabs.com

## Implementation Status - COMPLETE 🎉

### ✅ All 7 Phases of Pitch Deck Management Plan Completed (February 3, 2026)

#### **Phase 01: Foundation Layer** ✅

- Basic Next.js setup with App Router
- TypeScript configuration
- Tailwind CSS integration
- shadcn/ui component setup
- ESLint + Prettier configuration
- Husky + lint-staged setup
- Zustand store configuration
- HTTP client with Axios

#### **Phase 02: Service Layer Architecture** ✅

- Domain-specific API services
- JWT token interceptors
- Error handling patterns
- Retry utility with exponential backoff
- Type-safe API contracts

#### **Phase 03: Pitch Deck Status System** ✅

- Four status constants: uploading, processing, ready, error
- Configurable labels and Tailwind CSS color classes
- Utility functions for status management
- Visual indicators (badges, progress rings)

#### **Phase 04: Type System & Validation** ✅

- Comprehensive API type definitions
- Request/response types for all operations
- Pitch deck management types
- VC framework analysis types

#### **Phase 05: UI Components - Upload & Analysis** ✅

- File upload interface with drag-and-drop
- Real-time progress tracking
- Analysis result visualization
- Category score displays
- Gauge charts and competitive analysis

#### **Phase 06: Pitch Deck Management Pages** ✅

- List page with filtering and pagination
- Upload page with metadata forms
- Detail page with UUID validation
- 11 specialized UI components
- Responsive design with dark mode

#### **Phase 07: Integration - Final Phase** ✅

- **Routes centralized in constants**
- **All navigation uses APP_URL constants (no hardcoded paths)**
- **Dashboard navigation cards added**
- **README.md documentation updated**
- **Key Achievement**: All 7 phases of the Pitch Deck Management plan are now complete!

### **Final Implementation Summary**

**Complete Feature Set:**

1. **Authentication System**

   - JWT-based authentication with state persistence
   - Protected routes and guards
   - Automatic token refresh handling

2. **Pitch Deck Management**

   - File upload with chunked transfer support
   - Real-time status tracking
   - VC framework analysis with 7 categories
   - Retry mechanism for transient failures

3. **Dashboard & Navigation**

   - Centralized route constants
   - Consistent navigation using APP_URL constants
   - Dashboard navigation cards
   - Breadcrumb navigation

4. **UI Components**

   - 11 pitch deck management components
   - Upload progress visualization
   - Status-based filtering
   - Pagination with offset/limit
   - Delete confirmation dialogs
   - Action buttons and cards

5. **State Management**

   - Zustand stores with localStorage persistence
   - Real-time updates
   - Pagination and filter state management

6. **Developer Experience**
   - Comprehensive documentation
   - Code standards and patterns
   - Testing infrastructure
   - Git workflow automation

**Project Status: Production Ready** ✅

All core functionality is implemented and ready for production deployment. The system includes proper error handling, responsive design, dark/light mode support, and comprehensive documentation.

---

## Multi-File Backend Status

### Completed Phases

- ✅ **Phase 01**: Database Layer (Entities and relationships)
- ✅ **Phase 02**: DTO Layer (API contracts for multi-file)
- ✅ **Phase 03**: Service Layer (Multi-file upload logic)
- ✅ **Phase 04**: Controller Layer (Multi-file endpoint updates)

### In Progress Phases

- 🔲 **Phase 05**: Integration Testing (E2E verification)

### Current Focus

Phase 04 Controller layer has been completed with enhanced features:

- Multi-file upload support with FilesInterceptor
- Enhanced validation with bulk cleanup
- Security improvements with path sanitization
- Updated response mapping using deck.files.getItems()
- Frontend compatible API (no breaking changes)

---

_Last Updated: 2026-02-03_
_Version: 0.2.2_
_Status: Frontend Complete - Backend Phase 04 Complete_
