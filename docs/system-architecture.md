# System Architecture

This document provides a comprehensive overview of the Next.js boilerplate system architecture, including component organization, data flow, and implementation patterns.

## Table of Contents

1. [Application Architecture Overview](#application-architecture-overview)
2. [Layer Structure](#layer-structure)
3. [Authentication Flow](#authentication-flow)
4. [HTTP Client Architecture](#http-client-architecture)
5. [Provider Setup](#provider-setup)
6. [State Management Architecture](#state-management-architecture)
7. [Component Architecture](#component-architecture)
8. [API Integration Pattern](#api-integration-pattern)
9. [Error Handling Strategy](#error-handling-strategy)
10. [Performance Architecture](#performance-architecture)

---

## Application Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   UI        │  │   Layout    │  │   Pages     │        │
│  │  Components │  │  Components │  │  Components │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        Logic Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Hooks    │  │  Stores     │  │   Services  │        │
│  │  (Custom)  │  │  (Zustand)  │  │   (API)     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  HTTP      │  │   Local     │  │   External  │        │
│  │  Client    │  │   State     │  │   API       │        │
│  │ (Axios)    │  │ (Storage)   │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Layered Architecture**: Clear separation between presentation, logic, and data layers
2. **Component Composition**: Reusable components with single responsibility
3. **State Management**: Centralized state with Zustand, persisted locally
4. **API Integration**: Centralized HTTP client with interceptors
5. **Type Safety**: Comprehensive TypeScript implementation
6. **Error Boundaries**: Graceful error handling throughout the application

---

## Layer Structure

### 1. Presentation Layer

**Responsibility**: User interface and user interactions

#### Components Layer

```typescript
// src/components/
├── ui/           # shadcn/ui primitives (Button, Input, etc.)
├── common/       # Reusable business components
├── layout/       # Page layout components
└── forms/        # Form components (future)
```

**Component Responsibilities**:

- **UI Components**: Low-level, reusable components
- **Common Components**: Business logic with UI components
- **Layout Components**: Page structure and navigation

#### Pages Layer

```typescript
// src/app/
├── layout.tsx           # Root layout with providers
├── page.tsx            # Home page
├── dashboard/          # Dashboard section
│   ├── layout.tsx      # Dashboard layout
│   └── page.tsx       # Dashboard home
└── auth/              # Authentication pages
    ├── login/         # Login page
    └── register/     # Register page
```

### 2. Logic Layer

**Responsibility**: Business logic and state management

#### Custom Hooks

```typescript
// src/hooks/
├── useAuth.ts          # Authentication logic
├── useTheme.ts         # Theme management
├── useApi.ts          # API data fetching
└── index.ts          # Hook exports
```

#### State Management (Zustand)

```typescript
// src/stores/
├── user.store.ts      # User authentication state
├── theme.store.ts     # Theme preferences (future)
└── index.ts          # Store exports
```

### 3. Data Layer

**Responsibility**: Data persistence and external API communication

#### HTTP Client

```typescript
// src/services/http/
├── client.ts          # Axios instance with interceptors
├── interceptors.ts    # Request/response interceptors
└── index.ts          # HTTP exports
```

#### API Services

```typescript
// src/services/api/
├── auth.service.ts      # Authentication API calls
├── user.service.ts      # User API calls
├── pitch-deck.service.ts # Pitch deck CRUD operations
├── analysis.service.ts  # Analysis with polling (Phase 03)
├── vc-analysis.service.ts # VC analysis & management
├── file.service.ts      # File upload & management
└── index.ts            # API service exports
```

└── index.ts # API service exports

````

---

## Authentication Flow

### Authentication Architecture

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant AuthProvider
    participant UserStore
    participant HTTPClient
    participant API

    User->>UI: Clicks Login
    UI->>AuthProvider: Initiates login
    AuthProvider->>UserStore: Updates loading state
    UserStore->>HTTPClient: Sends login request
    HTTPClient->>API: POST /auth/login
    API->>HTTPClient: Returns JWT token
    HTTPClient->>UserStore: Stores token
    UserStore->>AuthProvider: Updates auth state
    AuthProvider->>UI: Shows success
    UI->>User: Redirects to dashboard
````

### Authentication Implementation Pattern

#### 1. Auth Provider Setup

```typescript
// src/providers/auth-provider.tsx
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, token, isLoading } = useUserStore();

  // Protect routes
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !token) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
};
```

#### 2. Protected Route Pattern

```typescript
// src/components/common/protected-route.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission
}) => {
  const { user, isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};
```

#### 3. Login Flow Implementation

```typescript
// src/components/auth/login-form.tsx
export const LoginForm = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const { login, isLoading, error } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <Input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </form>
  );
};
```

---

## HTTP Client Architecture

### HTTP Client Setup

```typescript
// src/services/http/client.ts
export const httpClient = Axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE,
  timeout: 60000 * 5, // 5 minutes
  headers: {
    'Content-Type': 'application/json'
  },
  maxContentLength: 1024 * 1024 * 1024, // 1GB
  maxBodyLength: 1024 * 1024 * 1024
});
```

### Request Interceptor Chain

```typescript
// Request interceptor for authentication
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Step 1: Get JWT token from store
    const token = await getCurrentAccessToken();

    // Step 2: Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Step 3: Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();

    // Step 4: Add timestamp
    config.headers['X-Request-Time'] = Date.now().toString();

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
```

### Response Interceptor Chain

```typescript
// Response interceptor for global error handling
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Step 1: Validate response structure
    if (!response.data || typeof response.data !== 'object') {
      throw new ApiError('Invalid response structure', 500);
    }

    // Step 2: Check for API errors
    if (response.data.success === false) {
      throw new ApiError(
        response.data.message || 'API request failed',
        response.status,
        response.data.code
      );
    }

    // Step 3: Transform response data
    response.data = transformResponseData(response.data);

    return response;
  },
  async (error: AxiosError) => {
    // Step 1: Handle network errors
    if (!error.response) {
      throw new NetworkError('Network error occurred');
    }

    // Step 2: Handle authentication errors
    if (error.response.status === 401) {
      await handleUnauthorized();
      return Promise.reject(error);
    }

    // Step 3: Handle validation errors
    if (error.response.status === 422) {
      const validationErrors = parseValidationError(error.response.data);
      throw new ValidationError('Validation failed', validationErrors);
    }

    // Step 4: Handle server errors
    if (error.response.status >= 500) {
      throw new ServerError('Server error occurred');
    }

    return Promise.reject(error);
  }
);
```

### Error Handling Hierarchy

```typescript
// Custom error classes hierarchy
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError';
  }
}
```

---

## Provider Setup

### Root Provider Structure

```typescript
// src/app/layout.tsx
import { AuthProvider } from '@/providers/auth-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Next.js Boilerplate',
  description: 'Modern web application with Next.js'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Theme Provider Implementation

```typescript
// src/providers/theme-provider.tsx
interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false
}) => {
  const theme = useTheme();
  const mounted = useIsMounted();

  useEffect(() => {
    // Handle theme persistence
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      theme.set(storedTheme);
    } else if (defaultTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      theme.set(systemTheme);
    } else {
      theme.set(defaultTheme);
    }
  }, [defaultTheme, theme]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    if (disableTransitionOnChange) {
      root.classList.add('transition-colors');
    }
  }, [theme, mounted, disableTransitionOnChange]);

  return <ThemeProviderContext.Provider value={{ theme, setTheme }}>
    {children}
  </ThemeProviderContext.Provider>;
};
```

### Context Provider Pattern

```typescript
// src/providers/index.ts
// Combine all providers in a single file for easy importing
export { AuthProvider } from './auth-provider';
export { ThemeProvider } from './theme-provider';
export { useAuth } from './auth-context';
export { useTheme } from './theme-context';
```

---

## State Management Architecture

### Zustand Store Structure

```typescript
// src/stores/user.store.ts
interface UserState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: Error | null;

  // Derived state
  isAuthenticated: boolean;
  permissions: string[];
}

interface UserActions {
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;

  // Async actions
  refreshUser: () => Promise<void>;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // Initial state
      ...defaultState,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: response.user,
            token: response.token,
            isLoading: false,
            error: null
          });

          // Store token in cookies for API requests
          setCookie('auth-token', response.token, {
            expires: new Date(Date.now() + response.expiresIn * 1000)
          });
        } catch (error) {
          set({
            error: error as Error,
            isLoading: false
          });
        }
      },

      logout: () => {
        set(defaultState);
        deleteCookie('auth-token');
      },

      // Selectors
      isAuthenticated: () => !!get().token,

      // Async actions
      refreshUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const user = await userService.getMe();
          set({ user });
        } catch (error) {
          set({ error: error as Error });
        }
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token
      }),
      storage: createJSONStorage(() => localStorage)
    }
  )
);
```

### Store Selector Pattern

```typescript
// Custom selectors for performance optimization
const userSelector = (state: UserState) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated
});

const authStatusSelector = (state: UserState) => ({
  isLoading: state.isLoading,
  error: state.error
});

// Usage in components
const { user, isAuthenticated } = useUserStore(userSelector);
const { isLoading, error } = useUserStore(authStatusSelector);
```

### State Management Best Practices

1. **Single Responsibility**: Each store manages one domain
2. **Immutable Updates**: Use state setters for updates
3. **Derived State**: Use selectors for computed values
4. **Persistence**: Only persist necessary state
5. **Error Handling**: Handle errors in store actions

---

## Component Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    App Component                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Layout Component                     │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │               Page Component                    │ │ │
│  │  │  ┌─────────────────────────────────────────────┐ │ │ │
│  │  │  │              Component                        │ │ │ │
│  │  │  │  ┌─────────────────────────────────────────┐ │ │ │ │
│  │  │  │  │              UI Component                │ │ │ │ │
│  │  │  │  │                                         │ │ │ │ │
│  │  │  │  └─────────────────────────────────────────┘ │ │ │ │
│  │  │  │                                               │ │ │ │
│  │  │  └─────────────────────────────────────────────┘ │ │ │
│  │  │                                                   │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Component Composition Pattern

```typescript
// src/components/common/with-error-boundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Higher-Order Component Pattern

```typescript
// src/components/hoc/with-auth.tsx
import { useUserStore } from '@/stores';

interface WithAuthProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithAuthProps> => {
  const AuthenticatedComponent: React.FC<P & WithAuthProps> = ({
    children,
    requiredPermission,
    ...props
  }) => {
    const { isAuthenticated, user } = useUserStore();

    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }

    if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
      return <Navigate to="/unauthorized" />;
    }

    return <Component {...(props as P)}>{children}</Component>;
  };

  return AuthenticatedComponent;
};
```

### Component Testing Strategy

```typescript
// Component tests
describe('UserProfile', () => {
  it('renders user information', () => {
    render(
      <UserStoreProvider>
        <UserProfile userId="1" />
      </UserStoreProvider>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { getByText } = render(
      <UserStoreProvider>
        <UserProfile userId="1" isLoading={true} />
      </UserStoreProvider>
    );

    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message', () => {
    const { getByText } = render(
      <UserStoreProvider>
        <UserProfile userId="1" error={new Error('Failed to load user')} />
      </UserStoreProvider>
    );

    expect(getByText('Failed to load user')).toBeInTheDocument();
  });
});
```

---

## API Integration Pattern

### Service Layer Architecture

```typescript
// src/services/api/index.ts
// Central API service exports
export { authService } from './auth.service';
export { userService } from './user.service';
export { apiService } from './base.service';

// API types
export type { LoginRequest, LoginResponse } from './types/auth';
export type { User, UserCreate, UserUpdate } from './types/user';
```

### Base Service Pattern

```typescript
// src/services/api/base.service.ts
export class BaseService {
  protected baseURL = env.NEXT_PUBLIC_API_BASE;
  protected httpClient = axiosClient;

  protected async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.httpClient.get<T>(endpoint, config);
    return response.data;
  }

  protected async post<T>(
    endpoint: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.httpClient.post<T>(endpoint, data, config);
    return response.data;
  }

  protected async put<T>(endpoint: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.httpClient.put<T>(endpoint, data, config);
    return response.data;
  }

  protected async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.httpClient.delete<T>(endpoint, config);
    return response.data;
  }
}
```

### Authentication Service Implementation

```typescript
// src/services/api/auth.service.ts
export class AuthService extends BaseService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.post<ApiResponse<LoginResponse>>('/auth/login', credentials, {
      withCredentials: true
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.post('/auth/logout', {}, { withCredentials: true });
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await this.post<{ token: string }>(
      '/auth/refresh',
      {},
      { withCredentials: true }
    );
    return response.data;
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.get('/auth/validate');
      return true;
    } catch {
      return false;
    }
  }
}

// Service instance
export const authService = new AuthService();
```

### API Error Handling Pattern

```typescript
// src/utils/api-error.ts
export class ApiErrorHandler {
  static handle(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response?.status === 401) {
        throw new UnauthorizedError('Session expired', error);
      }

      if (response?.status === 403) {
        throw new ForbiddenError('Access denied', error);
      }

      if (response?.status === 404) {
        throw new NotFoundError('Resource not found', error);
      }

      if (response?.status === 422) {
        throw new ValidationError('Validation failed', error);
      }

      throw new ApiError(
        response?.data?.message || 'API request failed',
        response?.status || 500,
        error
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new ApiError('Unknown error occurred');
  }
}
```

---

## Error Handling Strategy

### Error Boundary Implementation

```typescript
// src/components/common/error-boundary.tsx
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Global Error Handler

```typescript
// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Log error to monitoring service
    logError({
      error,
      pathname,
      searchParams: searchParams.toString(),
      timestamp: new Date().toISOString()
    });
  }, [error, pathname, searchParams]);

  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Performance Architecture

### Code Splitting Strategy

```typescript
// Dynamic imports for large components
const HeavyComponent = React.lazy(() => import('@/components/heavy-component'));

// Usage in component
const Dashboard = () => (
  <div>
    <React.Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </React.Suspense>
  </div>
);
```

### Image Optimization

```typescript
// Optimized image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={85}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};
```

### Bundle Analysis

```json
// webpack-bundle-analyzer configuration
{
  "scripts": {
    "analyze": "ANALYZE=true pnpm build"
  }
}
```

### Caching Strategy

```typescript
// Cache API responses
export const useCachedData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { staleTime?: number; revalidateOnFocus?: boolean }
) => {
  return useSWR(key, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    ...options
  });
};
```

---

## 11. Pitch Deck Management Architecture (Wave 3)

### Component Organization

```typescript
// src/components/
├── ui/                   # shadcn/ui primitives (Button, Input, etc.)
├── common/              # Reusable business components
├── layout/              # Page layout components
├── auth/                # Authentication components
├── pitch-deck/          # Pitch deck analysis components
└── pitch-deck-management/  # Pitch deck management UI components (NEW)
```

### Pitch Deck Management Components (Wave 3)

The pitch deck management system implements 11 specialized components:

```typescript
// src/components/pitch-deck-management/
├── pitch-deck-filter.tsx        // Status-based filtering component
├── pitch-deck-list.tsx          // Paginated deck list with status indicators
├── pitch-deck-pagination.tsx    // Custom pagination with offset/limit
├── metadata-inputs.tsx          // Form for deck title, description, tags
├── delete-confirmation-dialog.tsx // Safe deletion with confirmation
├── upload-progress-tracker.tsx  // Real-time upload progress visualization
├── pitch-deck-info.tsx         // Display of deck metadata and files
├── pitch-deck-actions.tsx       // Action buttons (delete, download, share)
├── pitch-deck-card.tsx         # Individual deck card with status badge
├── pitch-deck-detail-header.tsx // Detail page header with title, status, dates
└── upload-form.tsx             // Complete upload interface with metadata
```

### State Management Architecture

#### Pitch Deck Store

```typescript
// src/stores/pitch-deck-management.store.ts
interface PitchDeckState {
  pitchDecks: PitchDeckListItem[];
  total: number;
  limit: number;
  offset: number;
  filters: {
    status?: PitchDeckStatus;
  };
  isLoading: boolean;
  error: string | null;
}

interface PitchDeckActions {
  fetchPitchDecks: () => Promise<void>;
  removePitchDeck: (uuid: string) => void;
  setFilters: (filters: Partial<PitchDeckState['filters']>) => void;
  setPagination: (offset: number) => void;
}
```

### Page Architecture

#### 1. List Page (`/dashboard/pitch-decks/`)

**Features:**

- Filter by status (all, uploading, processing, ready, error)
- Paginated display with custom pagination
- Delete functionality with confirmation dialog
- Optimistic updates for better UX
- Error handling and loading states

**Implementation Pattern:**

```typescript
export default function PitchDecksPage() {
  const { fetchPitchDecks, pitchDecks, total, limit, offset, filters } = usePitchDeckManagementStore();

  useEffect(() => {
    fetchPitchDecks();
  }, [fetchPitchDecks, offset, filters.status]);

  return (
    <div className="container mx-auto py-8">
      <PitchDeckFilter ... />
      <PitchDeckList ... />
      <PitchDeckPagination ... />
    </div>
  );
}
```

#### 2. Upload Page (`/dashboard/pitch-decks/upload/`)

**Features:**

- File upload with drag-and-drop support
- Metadata form (title, description, tags)
- Upload progress tracking
- File validation (size, type)
- Guidance and help text

#### 3. Detail Page (`/dashboard/pitch-decks/[uuid]/`)

**Features:**

- UUID validation before API call
- Deck information display
- Status indicators
- Action buttons (delete, download, share)
- Error states for invalid/missing decks

**Security Implementation:**

```typescript
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function PitchDeckDetailContent() {
  const uuid = params.uuid as string;
  const isValidUuid = UUID_V4_REGEX.test(uuid);

  if (!isValidUuid) {
    return <NotFoundState error="Invalid pitch deck ID format" />;
  }

  // ... rest of implementation
}
```

### Error Handling Strategy

#### 1. Network Error Handling

```typescript
try {
  const result = await deletePitchDeckByUuid(uuid);
  toast.success('Pitch deck deleted successfully');
} catch (error) {
  toast.error('Failed to delete pitch deck');
  fetchPitchDecks(); // Re-fetch to restore state
}
```

#### 2. UUID Validation

- Regex pattern validation for UUID v4 format
- Graceful error state for invalid UUIDs
- User-friendly error messages

#### 3. Memory Leak Prevention

- Interval cleanup in progress tracking components
- Proper cleanup of event listeners
- React cleanup patterns

## 13. Backend Architecture Updates

### Phase 02: DTO Layer (Completed)

The DTO layer has been successfully updated to support multi-file pitch deck architecture while maintaining clean separation of concerns.

#### Key Components

1. **PitchDeckFileResponseDto**

   - Dedicated response type for individual files
   - Includes file metadata: UUID, filename, MIME type, size, status
   - Static `fromEntity()` method for entity-to-DTO conversion

2. **PitchDeckResponseDto** (Updated)

   - File metadata moved to `files` array
   - Added `fileCount` property for quick reference
   - Maintains deck-level metadata (title, description, tags)

3. **UploadDeckDto** (Unchanged)
   - Maintains backward compatibility
   - Deck-level metadata only

#### Data Flow Architecture

```
Frontend Request
    ↓
UploadDeckDto (unchanged)
    ↓
Controller (Phase 04 - Multi-file support)
    ↓
Service → PitchDeckEntity + PitchDeckFileEntity[] (Phase 03)
    ↓
DTO Conversion → PitchDeckResponseDto + PitchDeckFileResponseDto[]
    ↓
Frontend Response with files array
```

#### Benefits

- **Scalability**: Support for multiple files per deck
- **Type Safety**: Strong TypeScript typing throughout
- **Performance**: Quick access to file count
- **Maintainability**: Clear separation of concerns

---

## 14. Multi-File Architecture Overview

### Entity Relationships

```
PitchDeck (1) ←→ (N) PitchDeckFile
  │                    │
  ├─ title             ├─ originalFileName
  ├─ description        ├─ mimeType
  ├─ tags              ├─ fileSize
  └─ status            └─ storagePath
```

### API Contract Changes

| Field         | Before                  | After                            |
| ------------- | ----------------------- | -------------------------------- |
| File Metadata | Deck level              | Files array                      |
| File Access   | `deck.originalFileName` | `deck.files[0].originalFileName` |
| File Count    | N/A                     | `deck.fileCount`                 |
| File Status   | Deck status             | Individual file status           |

### Frontend Impact

**Components to Update**:

- File display components
- Detail page views
- File list rendering
- Status indicators

**API Calls Affected**:

- `/pitch-deck/{uuid}` (detail endpoint)
- File metadata access pattern

---

## 14.1 FileUploader Component Architecture

### Component Design

The FileUploader component is the primary interface for file selection and management in the pitch deck system. It has been updated to support multi-file selection with robust validation and user experience features.

#### Component Structure

```typescript
// src/components/pitch-deck/file-uploader.tsx
interface FileUploaderProps {
  onFilesSelect: (files: File[]) => void;      // Callback for file selection
  disabled?: boolean;                          // Disable interaction
  className?: string;                         // Additional styling
  selectedFiles?: File[];                     // Controlled component support
}

// Internal state
interface FileUploaderState {
  isDragging: boolean;    // Drag-and-drop visual state
  error: string | null;  // Validation errors
}
```

#### Key Features

1. **Multi-File Support**
   - Select up to 10 files per upload
   - Drag-and-drop with visual feedback
   - File type validation (PDF, PPT, PPTX, DOC, DOCX, TXT)
   - Individual file size limits (10MB per file)

2. **File Management**
   - Display selected files with metadata
   - Individual remove buttons for each file
   - File count indicator (X/10)
   - File size formatting (B, KB, MB)

3. **Validation**
   - File type checking against ALLOWED_PITCH_DECK_TYPES
   - Size validation per file (MAX_PITCH_DECK_SIZE)
   - Count validation (10 files maximum)
   - Graceful error handling

4. **User Experience**
   - Visual feedback for drag-and-drop
   - Dynamic button text based on selection
   - Clear error messages
   - Accessible interface with keyboard support

#### Data Flow

```
User Action
    ↓
File Selection (Input or Drag-and-Drop)
    ↓
Validation (Type, Size, Count)
    ↓
Update Selected Files Array
    ↓
Callback to Parent Component (onFilesSelect)
    ↓
UI Update (File List, Count, Button Text)
```

#### Integration Patterns

**1. Standalone Usage**
```typescript
<FileUploader onFilesSelect={handleFilesSelect} />
```

**2. Controlled Component**
```typescript
<FileUploader
  onFilesSelect={handleFilesSelect}
  selectedFiles={selectedFiles}
  disabled={isUploading}
/>
```

**3. Within Upload Form**
```typescript
<UploadForm>
  <FileUploader
    onFilesSelect={handleFileChanges}
    selectedFiles={formState.selectedFiles}
  />
  {/* Metadata inputs */}
</UploadForm>
```

#### Implementation Details

- **File Validation**: Uses `validatePitchDeckFile` utility
- **State Management**: Local state for drag/drop and errors
- **Performance**: Efficient rendering with keyed file list
- **Accessibility**: Full keyboard navigation support

### Backend Integration

The FileUploader integrates seamlessly with the multi-file backend architecture:

```typescript
// Upload service accepts File[]
const handleSubmit = async () => {
  const response = await uploadPitchDeck({
    files: selectedFiles,  // File[] instead of File
    title,
    description,
    tags
  });
};
```

---

## 15. Phase 04: Controller Layer Implementation

### Controller Architecture Updates

The controller layer has been successfully updated to support multi-file uploads with enhanced security and validation patterns.

#### Key Implementation Changes

##### 1. File Upload Interceptor Enhancement

```typescript
// Multi-file interceptor configuration
@UseInterceptors(
  FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: TEMP_UPLOAD_DIR,
      filename: (_req, file, cb) => {
        const uuid = uuidv4();
        const ext = MIME_TO_EXT[file.mimetype as any] || 'bin';
        cb(null, `${uuid}.${ext}`);
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB per file
  })
)
```

**Key Features:**

- Supports up to 10 files per upload
- Individual file size limits (50MB)
- Secure filename generation with UUID
- Temporary storage for validation

##### 2. Enhanced Validation Pipeline

```typescript
// Multi-file validation with bulk cleanup
for (const file of files) {
  // MIME type validation
  if (!ALLOWED_MIMES.includes(file.mimetype as any)) {
    await Promise.allSettled(files.map((f) => fs.unlink(f.path)));
    throw new BadRequestException(`Invalid file type: ${basename(file.originalname)}`);
  }

  // Magic number validation
  const fileBuffer = await fs.readFile(file.path);
  const fileType = await fileTypeFromBuffer(fileBuffer);
  // Additional validation logic
}
```

**Security Enhancements:**

- Bulk file cleanup on validation failure
- Path sanitization using `basename()`
- Magic number validation to prevent file type spoofing

##### 3. Updated Handler Signatures

```typescript
// Multi-file upload handler
async uploadDeck(
  @UploadedFiles() files: Express.Multer.File[],
  @Body() dto: UploadDeckDto,
  @Request() req: { user: { sub: string } }
): Promise<PitchDeckResponseDto>

// Updated get/list handlers using getItems()
async getDeck(@Param('uuid') uuid: string): Promise<PitchDeckResponseDto> {
  const deck = await this.pitchDeckService.findByUuid(uuid, ownerId);
  return PitchDeckResponseDto.fromEntity(
    deck,
    deck.files.getItems()  // Efficient file loading
  );
}
```

##### 4. Service Layer Integration

```typescript
// Passing files array to service
const pitchDeck = await this.pitchDeckService.uploadDeck(
  files, // Multi-file array
  dto,
  ownerId
);
```

### Data Flow Architecture (Updated)

```
Frontend FormData Request
    ↓ (Multi-file support)
Controller: FilesInterceptor('files', 10)
    ↓ (Validation & Security)
Service: uploadDeck(files[], dto, ownerId)
    ↓ (Entity Creation)
Repository: PitchDeck + PitchDeckFile[]
    ↓ (DTO Conversion)
Response: PitchDeckResponseDto + PitchDeckFileResponseDto[]
    ↓ (Frontend)
Files Array with Metadata
```

### Frontend Compatibility

**No Breaking Changes:**

- Frontend upload interface remains unchanged
- FormData API handles both single and multiple files
- Response structure updated to include `files` array

**Migration Considerations:**

- Detail API responses now include `files` array
- File metadata accessed via `response.files[0].property`
- Added `fileCount` for quick reference

### Performance Optimizations

1. **Lazy Loading**: Files loaded only when needed using `getItems()`
2. **Bulk Operations**: Promise.allSettled for parallel file cleanup
3. **Memory Management**: Temporary files cleaned up after validation
4. **Efficient Queries**: File relationships loaded on demand

### Error Handling Patterns

```typescript
// Multi-file specific error handling
if (!files || files.length === 0) {
  throw new BadRequestException('No files provided');
}

// Validation with security
if (!ALLOWED_MIMES.includes(file.mimetype as any)) {
  throw new BadRequestException(`Invalid file type: ${basename(file.originalname)}`);
}
```

### Security Implementation

1. **File Size Validation**: 50MB limit per file
2. **MIME Type Whitelist**: Restricted file types
3. **Magic Number Validation**: Content-based validation
4. **Path Sanitization**: No full path exposure in errors
5. **Bulk Cleanup**: All temporary files removed on failure

---

_Last Updated: 2026-02-03_
_Version: 0.1.0 (Wave 3: v0.2.0) + Phase 02 DTO Layer + Phase 04 Controller Layer_
