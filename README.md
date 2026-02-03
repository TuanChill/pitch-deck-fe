# Next.js Boilerplate Template

A modern, production-ready Next.js boilerplate with comprehensive development tooling, authentication setup, and services architecture. Built with best practices for scalable enterprise applications.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.20.2 or higher
- pnpm 9.1.1 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nextjs-boilerplate

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- [Project Overview & PDR](./docs/project-overview-pdr.md) - Product requirements and project details
- [Codebase Summary](./docs/codebase-summary.md) - Architecture and implementation overview
- [Code Standards](./docs/code-standards.md) - Coding standards and best practices
- [System Architecture](./docs/system-architecture.md) - Detailed architecture documentation

## 🛠️ Technology Stack

### Core Framework

- **Next.js 15.5** - React framework with App Router and Turbo mode
- **React 19 RC** - Latest React features
- **TypeScript 5.7** - Type safety and developer experience

### Styling & UI

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Shadcn/ui** - Pre-built accessible components
- **Lucide React** - Icon library
- **Next Themes** - Dark/light mode support

### State Management & HTTP

- **Zustand 5.0** - Lightweight state management with persistence
- **Axios 1.11** - HTTP client with request/response interceptors
- **Zod 3.24** - Schema validation

### Development Tools

- **ESLint 9.19** - Code linting with flat config
- **Prettier 3.4** - Code formatting
- **Husky & lint-staged** - Git hooks for quality enforcement
- **Jest & Testing Library** - Testing framework

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                 # Shadcn/ui components
│   ├── layout/             # Layout components
│   └── common/             # Common components
├── config/                 # Configuration files
│   ├── env.ts              # Environment variables
│   ├── fonts.ts            # Font configuration
│   └── site.ts             # Site metadata
├── constants/              # Application constants
│   ├── api.ts              # API endpoints
│   ├── routes.ts           # Application routes
│   └── index.ts            # Constants index
├── providers/              # React Context providers
│   ├── auth-provider.tsx   # Authentication context
│   ├── theme-provider.tsx  # Theme context
│   └── index.ts            # Providers index
├── services/               # API and service layers
│   ├── http/               # HTTP client configuration
│   ├── api/                # API service layer
│   └── index.ts            # Services index
├── stores/                 # State management
│   ├── user.store.ts       # User authentication state
│   └── index.ts            # Stores index
├── types/                  # TypeScript type definitions
│   ├── request/            # Request types
│   ├── response/           # Response types
│   └── index.ts            # Type exports
├── utils/                  # Utility functions
│   ├── cn/                 # Class name utilities
│   └── index.ts            # Utility exports
└── styles/                 # Global styles
    └── globals.css         # Global CSS imports
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbo mode
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm eslint:format  # Fix ESLint issues
pnpm prettier:format # Format code with Prettier
pnpm prettier:check  # Check formatting

# Testing
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Run tests with coverage
pnpm test:ci      # Run tests in CI mode
```

## 🎯 Key Features

### Authentication System

- JWT-based authentication with state persistence
- Protected routes and guards
- Automatic token handling via interceptors
- User session management with Zustand

### State Management

- Zustand stores with persistence
- Centralized user authentication state
- Type-safe state management
- Derived state selectors

### API Integration

- Axios with custom configuration
- Request/response interceptors
- Automatic JWT injection
- Global error handling

### Development Experience

- ESLint + Prettier for consistent code style
- Husky pre-commit hooks
- lint-staged for staged file formatting
- TypeScript strict mode enabled
- Jest + Testing Library for testing

### Theming

- Dark/light mode support
- System preference detection
- Theme persistence
- Next Themes integration

## 🔐 Environment Variables

Create `.env.local` from `.env.example` and configure:

```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api/v1/
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms

The project is compatible with any platform that supports Next.js:

- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests in CI mode
pnpm test:ci
```

## 📦 Dependencies

### Core Dependencies

- Next.js 15.5
- React 19 RC
- TypeScript 5.7
- Tailwind CSS 3.4
- Axios 1.11
- Zustand 5.0

### Development Dependencies

- ESLint 9.19
- Prettier 3.4
- Jest 29.7
- Testing Library 16.0
- Husky 9.1
- lint-staged 15.4

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

_Built with ❤️ by TBX/Capylabs_
