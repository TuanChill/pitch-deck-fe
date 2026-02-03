# Project Overview - Product Development Requirements (PDR)

## Project Information

**Project Name:** pitch-deck-management
**Version:** 0.1.0
**Description:** Pitch deck management system with upload, analysis, and VC framework evaluation capabilities
**Status:** Active Development - Phase 01: Foundation Layer

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
- Retry mechanism with exponential backoff for transient failures
- Comprehensive API type definitions

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

### 🚧 In Progress

- Authentication system implementation
- Theme provider integration
- API service integration
- Component library expansion
- Pitch deck upload UI implementation
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

## Phase 01: Foundation Layer Summary

### Completed Components (February 3, 2026)

#### Core Infrastructure ✅
1. **Pitch Deck Status System**
   - Four status constants: uploading, processing, ready, error
   - Configurable labels and Tailwind CSS color classes
   - Utility functions for status management

2. **API Type Definitions**
   - Request types: UploadPitchDeckRequest, AnalyzePitchDeckRequest, ListPitchDecksQuery
   - Response types: PitchDeckListItem, PitchDeckAnalysisResponse with VC framework types
   - Comprehensive typing for all API interactions

3. **Retry Utility**
   - Exponential backoff with jitter to prevent retry storms
   - Configurable retry parameters (maxRetries, baseDelay, maxDelay)
   - Handles transient network and server failures

4. **Service Architecture**
   - Separated API logic from UI components
   - Axios HTTP client with JWT interceptors
   - Domain-specific service modules for clean code organization

#### Wave 3: Pitch Deck Management Pages (v0.2.0) ✅

**Completed Features (February 3, 2026):**

1. **Pitch Deck Management UI Components** (11 components)
   - `pitch-deck-filter.tsx`: Status-based filtering with search integration
   - `pitch-deck-list.tsx`: Paginated deck list with status indicators
   - `pitch-deck-pagination.tsx`: Custom pagination with offset/limit
   - `metadata-inputs.tsx`: Form for deck title, description, tags
   - `delete-confirmation-dialog.tsx`: Safe deletion with confirmation
   - `upload-progress-tracker.tsx`: Real-time upload progress visualization
   - `pitch-deck-info.tsx`: Display of deck metadata and files
   - `pitch-deck-actions.tsx`: Action buttons (delete, download, share)
   - `pitch-deck-card.tsx`: Individual deck card with status badge
   - `pitch-deck-detail-header.tsx`: Detail page header with title, status, dates
   - `upload-form.tsx`: Complete upload interface with metadata

2. **Page Implementations**
   - List Page (`/dashboard/pitch-decks/`): Filter, pagination, delete functionality
   - Upload Page (`/dashboard/pitch-decks/upload/`): File upload with metadata
   - Detail Page (`/dashboard/pitch-decks/[uuid]/`): Deck view with actions, UUID validation

3. **Key Features Implemented**
   - Status tracking: uploading | processing | ready | error
   - Optimistic updates for better UX
   - UUID validation with error handling
   - Date parsing and formatting utilities
   - Memory leak fix (interval cleanup in progress tracking)
   - Toast notifications for user feedback
   - Responsive design with Tailwind CSS
   - Dark/light mode support

4. **Store Integration**
   - Zustand store for pitch deck state management
   - LocalStorage persistence for data retention
   - Real-time state updates with React bindings
   - Pagination state management (offset/limit)
   - Filter state management (status-based filtering)

5. **Error Handling**
   - Graceful error states for network failures
   - UUID format validation
   - Timeout handling for API calls
   - User-friendly error messages

### Next Steps (Phase 02)

1. Implement actual API integration (currently using mock data)
2. Add file upload progress tracking with real-time updates
3. Develop VC framework analysis visualization components
4. Implement bulk operations for pitch deck management
5. Add search functionality with full-text search
6. Create export capabilities for analysis results

---

_Last Updated: 2026-02-03_
_Version: 0.2.0_
