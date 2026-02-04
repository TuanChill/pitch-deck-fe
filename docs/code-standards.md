# Code Standards

This document outlines the coding standards and best practices for the Next.js boilerplate project. These standards ensure code quality, consistency, and maintainability across the entire codebase.

## Table of Contents

1. [ESLint Configuration](#eslint-configuration)
2. [Prettier Formatting Standards](#prettier-formatting-standards)
3. [Import Organization Patterns](#import-organization-patterns)
4. [TypeScript Configuration](#typescript-configuration)
5. [Testing Standards](#testing-standards)
6. [Git Hooks (Husky, lint-staged)](#git-hooks-husky-lint-staged)
7. [General Coding Conventions](#general-coding-conventions)
8. [Component Patterns](#component-patterns)
9. [State Management Standards](#state-management-standards)
10. [API Layer Standards](#api-layer-standards)

---

## ESLint Configuration

### Core Setup

The project uses ESLint 9 with Next.js configuration:

```typescript
// eslint.config.mjs
export default [
  {
    ignores: [
      '**/node_modules/*',
      '**/out/*',
      '**/.next/*',
      '**/coverage',
      'src/styles/globals.css'
    ]
  },
  ...compat.extends(
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
    'prettier'
  )
];
```

### Key ESLint Rules

#### TypeScript Rules

```typescript
// No unused variables (allow prefixing with _)
'@typescript-eslint/no-unused-vars': [
  2,
  {
    argsIgnorePattern: '^_'
  }
],

// Strict null checks enabled by default
'@typescript-eslint/no-explicit-any': 2,
'@typescript-eslint/explicit-function-return-type': 0,
'@typescript-eslint/explicit-module-boundary-types': 0,
```

#### React Rules

```typescript
// No prop types requirement (using TypeScript)
'react/prop-types': 0,

// No React import in scope (Next 13+ supports JSX without import)
'react/react-in-jsx-scope': 0,

// Require newline before return
'newline-before-return': 2,
```

#### Import Organization

```typescript
'import-helpers/order-imports': [
  2,
  {
    newlinesBetween: 'always',
    groups: [
      ['/^next/', 'module'],           // Next.js imports first
      '/^@/styles/',                  // Style imports
      '/^@/components/',              // Component imports
      ['parent', 'sibling', 'index']  // Relative imports last
    ],
    alphabetize: {
      order: 'asc',
      ignoreCase: true
    }
  }
],
```

#### Console Usage

```typescript
// Only allow warn and error
'no-console': [
  2,
  {
    allow: ['warn', 'error']
  }
]
```

---

## Prettier Formatting Standards

### Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Key Formatting Rules

#### JavaScript/TSX

```typescript
// Use single quotes
const name = 'John';

// No trailing commas in single line objects
const obj = { name: 'John' };

// Always use semicolons
const x = 1;

// Arrow function parentheses when necessary
const func = (param) => param * 2;
const complexFunc = (a, b) => {
  return a + b;
};
```

#### JSX Formatting

```jsx
// Opening and closing tags on separate lines
<Component
  prop1={value1}
  prop2={value2}
>
  Content
</Component>

// Self-closing tags for void elements
<img src="path" />
<br />
```

---

## Import Organization Patterns

### Import Order

Imports must follow this exact order:

1. **Next.js imports**
2. **Third-party imports**
3. **Internal imports (styles first, then components, then utilities)**
4. **Relative imports**

### Example Pattern

```typescript
// 1. Next.js imports
import { Metadata } from 'next';
import Image from 'next/image';

// 2. Third-party imports
import { useStore } from 'zustand';
import axios from 'axios';
import { Button } from '@radix-ui/react-slot';

// 3. Internal imports
// Styles
import '@/styles/globals.css';

// Components
import { Header } from '@/components/layout/header';
import { UserCard } from '@/components/common/user-card';

// Utilities
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date';

// 4. Relative imports
import { UserAvatar } from './user-avatar';
import { UserList } from './user-list';
```

### Import Naming

- Use named imports for specificity
- Avoid default imports when possible
- Use aliases for conflicting imports

```typescript
// Good
import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user.store';

// Avoid
import React from 'react';
import userStore from '@/stores/user.store';
```

---

## TypeScript Configuration

### Strict Mode Enabled

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Type Safety Standards

#### Interface vs Type

- Use `interface` for object types that might be extended
- Use `type` for unions, intersections, and utility types

```typescript
// Interface for objects that might be extended
interface User {
  id: string;
  name: string;
  email: string;
}

interface Admin extends User {
  role: 'admin';
}

// Type for unions and intersections
type UserStatus = 'active' | 'inactive' | 'pending';
type UserProfile = User & { profile: Profile };
```

#### Generic Type Constraints

```typescript
// Always specify constraints when appropriate
function fetchData<T extends { id: string }>(url: string): Promise<T> {
  return fetch(url).then((res) => res.json());
}

// Use readonly for immutable data
interface ImmutableUser {
  readonly id: string;
  readonly name: string;
}
```

#### Null and Undefined Handling

```typescript
// Use nullish coalescing operator
const name = user?.name ?? 'Guest';

// Use optional chaining for nested properties
const address = user?.address?.street;

// Explicitly type optional props
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}
```

---

## Testing Standards

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Component Testing with React Testing Library

#### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Async Component Test

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from '@/components/user-profile';
import { useUserStore } from '@/stores/user.store';

jest.mock('@/stores/user.store');

describe('UserProfile', () => {
  it('displays user name when loaded', async () => {
    (useUserStore as jest.Mock).mockReturnValue({
      user: { id: '1', name: 'John', email: 'john@example.com' }
    });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });
});
```

### API Service Testing

```typescript
import { httpClient } from '@/services/http/client';
import { login } from '@/services/api/auth.service';

jest.mock('@/services/http/client');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends correct login request', async () => {
    (httpClient.post as jest.Mock).mockResolvedValue({
      data: { success: true, data: { token: 'fake-token' } }
    });

    await login({ email: 'test@example.com', password: 'password' });

    expect(httpClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password'
    });
  });
});
```

---

## Git Hooks (Husky, lint-staged)

### Configuration

```json
// package.json
{
  "lint-staged": {
    "src/**/*": ["pnpm prettier:format", "pnpm eslint:format"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### Hook Workflow

#### Pre-commit Hook

1. **lint-staged** runs on staged files
2. **Prettier** formats the files
3. **ESLint** fixes auto-fixable issues
4. Files are restaged automatically

#### Commit Message Hook

1. **commitlint** enforces conventional commit format
2. Validates commit message structure

### Commit Message Standards

```bash
# Format: type(scope): description
feat(auth): add login functionality
fix(ui): resolve button styling issue
docs(readme): update installation instructions
test(component): add button tests
chore(deps): update react to latest version
```

---

## General Coding Conventions

### Naming Conventions

#### Variables and Functions

```typescript
// Use camelCase
const userName = 'John';
const calculateTotal = (items: Item[]) => { ... };

// Use descriptive names
const isLoading = false; // Not: isLd
const userPreferences = { ... }; // Not: usrPrefs
```

#### Components and Files

```typescript
// Use PascalCase for components
const UserProfile = () => { ... };
const UserList = () => { ... };

// Use kebab-case for files
user-profile.tsx
user-list.tsx
auth-service.ts
```

#### Constants and Types

```typescript
// Use UPPER_SNAKE_CASE for constants
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// Use PascalCase for interfaces and types
interface User { ... }
type UserStatus = 'active' | 'inactive';
```

### Function Patterns

#### Async Functions

```typescript
// Always use async/await
const fetchUserData = async (id: string): Promise<User> => {
  try {
    const response = await httpClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};

// Handle errors properly
const handleError = (error: unknown): never => {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  } else {
    console.error('Unknown error occurred');
  }
  throw error;
};
```

#### Pure Functions

```typescript
// Prefer pure functions when possible
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Avoid side effects in pure functions
const filterActiveUsers = (users: User[]): User[] => {
  return users.filter((user) => user.status === 'active');
};
```

---

## Component Patterns

### Functional Components with TypeScript

```typescript
interface UserCardProps {
  user: User;
  onClick?: () => void;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick, className }) => {
  return (
    <div className={cn('user-card', className)} onClick={onClick}>
      <Avatar src={user.avatar} />
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
};
```

### Custom Hooks Pattern

```typescript
import { useState, useEffect } from 'react';

const useUser = (id: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await httpClient.get(`/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return { user, isLoading, error };
};
```

### Higher-Order Components (Optional)

```typescript
interface withAuthProps {
  children: React.ReactNode;
}

const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & withAuthProps> => {
  return ({ children, ...props }) => {
    const { isAuthenticated } = useUserStore();

    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }

    return <Component {...(props as P)}>{children}</Component>;
  };
};
```

---

## FileUploader Component Standards

### Multi-File Upload Component Guidelines

The FileUploader component follows specific patterns for handling multiple file uploads with validation and user experience considerations.

#### Component Interface Standards

```typescript
// Always use array type for file selection
interface FileUploaderProps {
  onFilesSelect: (files: File[]) => void;  // Required: File array callback
  disabled?: boolean;                      // Optional: Disable interaction
  className?: string;                     // Optional: Additional styling
  selectedFiles?: File[];                 // Optional: Controlled component mode
}

// Example: Basic usage
<FileUploader onFilesSelect={handleFilesSelect} />

// Example: Controlled component
<FileUploader
  onFilesSelect={handleFilesSelect}
  selectedFiles={selectedFiles}
  disabled={isUploading}
/>
```

#### File Validation Standards

1. **Type Validation**
   ```typescript
   // Use existing validation utility
   import { validatePitchDeckFile } from '@/constants/file-types';

   const validation = validatePitchDeckFile(file);
   if (!validation.valid) {
     // Handle validation error
   }
   ```

2. **Count Validation**
   ```typescript
   // Maximum 10 files total
   const totalCount = selectedFiles.length + newFiles.length;
   if (totalCount > 10) {
     setError('Maximum 10 files allowed');
     return;
   }
   ```

3. **Size Validation**
   ```typescript
   // Use MAX_PITCH_DECK_SIZE constant
   import { MAX_PITCH_DECK_SIZE } from '@/constants/file-types';

   if (file.size > MAX_PITCH_DECK_SIZE) {
     setError('File exceeds maximum size');
     return;
   }
   ```

#### State Management Patterns

```typescript
// File state should always be an array
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

// Handler must accept File[]
const handleFilesSelect = useCallback((files: File[]) => {
  setSelectedFiles(files);
  // Additional logic if needed
}, []);
```

#### UI Display Standards

1. **File Count Display**
   ```typescript
   // Show count clearly
   <p>Selected Files ({selectedFiles.length}/10)</p>

   // Button text should reflect count
   <Button>
     Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
   </Button>
   ```

2. **File List Display**
   ```typescript
   {selectedFiles.map((file, index) => (
     <div key={`${file.name}-${index}`} className="file-item">
       <FileIcon />
       <div className="file-info">
         <span className="file-name">{file.name}</span>
         <span className="file-size">{formatFileSize(file.size)}</span>
       </div>
       <Button
         variant="ghost"
         size="icon"
         onClick={() => handleRemoveFile(index)}
       >
         <XIcon />
       </Button>
     </div>
   ))}
   ```

#### Error Handling Standards

```typescript
// Always provide clear error messages
const [error, setError] = useState<string | null>(null);

const validateAndSelectFiles = (newFiles: File[]) => {
  const errors: string[] = [];

  newFiles.forEach(file => {
    const validation = validatePitchDeckFile(file);
    if (!validation.valid) {
      errors.push(`${file.name}: ${validation.error}`);
    }
  });

  if (errors.length > 0) {
    setError(errors.join('; '));
  }
};
```

#### Integration Guidelines

1. **With Upload Forms**
   ```typescript
   <UploadForm>
     <FileUploader
       onFilesSelect={setSelectedFiles}
       selectedFiles={selectedFiles}
     />
     {/* Other form fields */}
   </UploadForm>
   ```

2. **API Integration**
   ```typescript
   // Service accepts File[]
   const uploadPitchDeck = async (data: {
     files: File[];
     title: string;
     description: string;
     tags: string[];
   }) => {
     // Upload implementation
   };
   ```

#### Testing Standards

```typescript
// Test multi-file scenarios
describe('FileUploader', () => {
  it('handles multiple file selection', () => {
    const mockFiles = [file1, file2, file3];
    render(<FileUploader onFilesSelect={mockOnFilesSelect} />);

    // Simulate file selection
    const fileInput = screen.getByLabelText(/select files/i);
    fireEvent.change(fileInput, { target: { files: mockFiles } });

    expect(mockOnFilesSelect).toHaveBeenCalledWith(mockFiles);
  });

  it('validates file count limit', () => {
    // Test beyond 10 files
    const tooManyFiles = Array(11).fill(mockFile);
    // Verify error is shown
  });
});
```

---

## State Management Standards

### Zustand Store Pattern

```typescript
interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: Error | null;
}

interface UserActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await loginService(credentials);
          set({
            user: response.user,
            token: response.token,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            error: error as Error,
            isLoading: false
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          error: null
        });
      },

      setUser: (user) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token
      })
    }
  )
);
```

### State Update Patterns

```typescript
// Prefer selectors for derived state
const userSelector = (state: UserState) => state.user;
const user = useUserStore(userSelector);

// Batch updates when possible
setUser(newUser);
setLoading(false);
setError(null);

// Use middleware for side effects
const logger = storeApi((set, get) => ({
  ...initialState,
  updateUser: (user) => {
    console.log('Updating user:', user);
    set({ user });
  }
}));
```

---

## Pitch Deck Management Standards

### File Organization

Pitch deck management follows established patterns:

```
src/
├── constants/
│   └── pitch-deck-status.ts        # Status constants and utilities
├── services/api/
│   └── pitch-deck.service.ts      # Pitch deck API service
├── types/
│   ├── request/
│   │   └── pitch-deck.ts          # Request types
│   └── response/
│       └── pitch-deck.ts         # Response types with VC framework
├── utils/
│   ├── retry.ts                   # Retry utility for transient failures
│   └── index.ts                   # Utility exports
└── stores/
    └── pitch-deck.store.ts        # Pitch deck state management
```

### API Type Definitions

#### Request Types

```typescript
// Always use specific request types
interface UploadPitchDeckRequest {
  file: File;
}

interface UploadPitchDeckWithMetadataRequest {
  deck: File;
  title: string;
  description?: string;
  tags?: string[];
}

interface ListPitchDecksQuery {
  status?: PitchDeckStatus; // Use enum from constants
  limit?: number;
  offset?: number;
}
```

#### Response Types

```typescript
// Use comprehensive response types
interface PitchDeckListItem {
  id: string;
  uuid: string;
  title: string;
  description: string | null;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  status: PitchDeckStatus; // Use enum from constants
  chunkCount: number;
  errorMessage: string | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
}
```

### Status Management

#### Using Status Constants

```typescript
// Import from constants
import {
  PitchDeckStatus,
  PITCH_DECK_STATUS,
  getStatusLabel,
  getStatusColor
} from '@/constants/pitch-deck-status';

// Display status in UI
function StatusBadge({ status }: { status: PitchDeckStatus }) {
  const colorClass = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span className={`${colorClass} px-2 py-1 rounded-full text-sm font-medium`}>
      {label}
    </span>
  );
}
```

### Retry Utility Usage

#### For API Calls

```typescript
// Import retry utility
import { withRetry, type RetryOptions } from '@/utils/retry';

// Configure retry for specific operations
const pitchDeckRetryOptions: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000
};

// Use with API calls
const uploadResult = await withRetry(
  () => pitchDeckService.uploadPitchDeck(request),
  pitchDeckRetryOptions
);
```

#### Error Handling with Retry

```typescript
async function uploadWithRetry(file: File) {
  try {
    const result = await withRetry(() => pitchDeckService.uploadPitchDeck({ file }), {
      maxRetries: 3
    });
    return result;
  } catch (error) {
    // Handle final error after all retries
    if (error.response?.status === 413) {
      throw new Error('File size exceeds limit');
    }
    throw new Error('Upload failed. Please try again.');
  }
}
```

---

## API Layer Standards

### HTTP Client Configuration

```typescript
// Always use typed responses
export const httpClient = Axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE,
  timeout: 60000 * 5,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor with proper typing
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authentication token
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with error handling
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Clear auth state
      clearAuth();
      redirect to login
    }
    return Promise.reject(error);
  }
);
```

### API Service Pattern

```typescript
// Always use request/response types
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await httpClient.post('/auth/logout');
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await httpClient.post<{ token: string }>('/auth/refresh');
    return response.data;
  }
};
```

### Error Handling Patterns

```typescript
// Custom error class
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

// API error wrapper
export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data;
    throw new ApiError(
      response?.message || 'API request failed',
      error.response?.status || 500,
      response?.code
    );
  }

  if (error instanceof Error) {
    throw new ApiError(error.message, 500, 'UNKNOWN_ERROR');
  }

  throw new ApiError('Unknown error occurred', 500);
};
```

---

## Code Review Checklist

### Before Merging

- [ ] All ESLint rules pass
- [ ] Code is formatted with Prettier
- [ ] TypeScript compilation succeeds
- [ ] Tests are written for new functionality
- [ ] Documentation is updated if needed
- [ ] Follows established patterns and conventions
- [ ] Proper error handling implemented
- [ ] Performance considerations addressed

### Quality Metrics

- Maintainability: High
- Test Coverage: Target 80%+
- Code Complexity: Low to moderate
- Documentation: Comprehensive for complex features

---

_Last Updated: 2026-02-03_
_Version: 0.1.0_
