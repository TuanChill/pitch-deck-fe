# Project Roadmap

**Project**: Pitch Deck Management System (Frontend)
**Current Phase**: Phase 02 - Pitch Deck Service Layer
**Last Updated**: 2026-02-04
**Version**: v0.3.0

---

## Current Status

### Frontend API Integration Plan 🔄

| Phase                              | Status         | Progress | Completed  |
| ---------------------------------- | -------------- | -------- | ---------- |
| Phase 01: API Constants & Types    | ✅ DONE        | 100%     | 2026-02-04 |
| Phase 02: Pitch Deck Service Layer | 🔄 In Progress | 0%       | -          |
| Phase 03: Analysis Service Layer   | ⏳ Pending     | 0%       | -          |
| Phase 04: Store Integration        | ⏳ Pending     | 0%       | -          |
| Phase 05: Error Handling & Testing | ⏳ Pending     | 0%       | -          |

---

## Implementation Progress

### ✅ Phase 01: API Constants & Types (100% Complete)

**Status**: DONE - 2026-02-04

**Completed Tasks**:

- ✅ Created `src/constants/api-url.ts` with all 9 endpoint URLs
- ✅ Created `src/types/request/pitch-deck.ts` with request DTOs
- ✅ Updated `src/types/response/pitch-deck.ts` with files array and uuid fields
- ✅ Modified `src/services/api/index.ts` for barrel exports
- ✅ Updated `src/services/api/pitch-deck.service.ts` with mock implementations
- ✅ Fixed detail page and upload form to use `files` array
- ✅ Fixed uploadId to uuid consistency in response types

**Key Changes Made**:

- API constants: All backend endpoints defined with proper URL patterns
- Type safety: Strong typing for request/response contracts
- Service layer: Mock implementations ready for real API integration
- UI updates: Components adapted for multi-file response structure

**Next Phase**: Phase 02 - Pitch Deck Service Layer

---

## Architecture Overview

### Service Layer Pattern

```
Frontend Services
├── Pitch Deck Service (Phase 02)
│   ├── uploadPitchDeck()
│   ├── getPitchDecks()
│   ├── getPitchDeck()
│   └── deletePitchDeck()
└── Analysis Service (Phase 03)
    ├── startAnalysis()
    ├── getAnalysisStatus()
    ├── getAnalysis()
    └── deleteAnalysis()
```

### State Management

```
Stores
├── pitch-deck.store.ts
└── pitch-deck-management.store.ts
```

---

## Phase Timeline

| Phase | Duration | Dependencies | Notes                       |
| ----- | -------- | ------------ | --------------------------- |
| 01    | 4-5 hrs  | None         | ✅ Complete                 |
| 02    | 3-4 hrs  | 01           | 🔄 In Progress              |
| 03    | 2-3 hrs  | 01           | ⏳ Can start after Phase 01 |
| 04    | 2-3 hrs  | 02, 03       | ⏳ Sequential               |
| 05    | 1-2 hrs  | 04           | ⏳ Final verification       |

**Total Duration**: ~12-17 hours
**Parallel Potential**: Phases 02+3 can run simultaneously

---

## Key Design Decisions

1. **Service Layer**: Separate modules for each domain (Pitch Deck, Analysis)
2. **Type Safety**: Strong TypeScript contracts for all API interactions
3. **Error Handling**: Centralized error handling with user-friendly messages
4. **State Management**: Zustand stores with localStorage persistence
5. **Mock Layer**: Development-time mock implementations for testing

---

## Risk Assessment

| Risk                   | Mitigation                             | Status      |
| ---------------------- | -------------------------------------- | ----------- |
| API contract mismatch  | Strong TypeScript types and validation | ✅ Complete |
| Authentication issues  | JWT interceptor implementation         | ✅ Complete |
| File upload errors     | Progress tracking and error states     | ✅ Complete |
| Type safety violations | ESLint + TypeScript strict mode        | ✅ Complete |

---

## Dependencies

```
Phase 01 (API Types) - COMPLETE
    ├─> Phase 02 (Pitch Service) ──┐
    └> Phase 03 (Analysis Service)─┤
                                 ├─> Phase 04 (Store Integration)
                                 └─> Phase 05 (Error Handling)
```

---

## Success Metrics

- [x] Phase 01 API constants and types complete
- [ ] Phase 2 Pitch service handles all CRUD operations
- [ ] Phase 3 Analysis service with status tracking
- [ ] Phase 4 Store integration with proper state management
- [ ] Phase 5 Error handling and testing complete

---

## Next Steps

1. ✅ **Complete**: Phase 01 - API Constants & Types (2026-02-04)
2. 🔄 **In Progress**: Phase 02 - Pitch Deck Service Layer
3. ⏳ **Next**: Phase 03 - Analysis Service Layer
4. ⏳ **Next**: Phase 04 - Store Integration
5. ⏳ **Next**: Phase 05 - Error Handling & Testing

**Priority**: Complete Phase 02 to enable real API integration

---

## Changelog

### 2026-02-04

- **Phase 01 Complete**: API constants and types implementation
- **API Constants**: All 9 backend endpoints defined in api-url.ts
- **Type Contracts**: Request/response DTOs with strong typing
- **Service Layer**: Mock implementations ready for integration
- **UI Updates**: Components adapted for multi-file structure
- **Type Safety**: Fixed uploadId to uuid consistency issues
- **Documentation**: Updated project roadmap and changelog

---
