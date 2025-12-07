# Rcruit Flow

An AI-powered recruitment platform that automates CV processing and email generation using advanced AI capabilities. The platform leverages OpenAI's GPT models to extract structured data from CVs and generate personalized recruitment emails.

## 🤖 AI-Powered Features

This project utilizes **OpenAI's GPT models** to provide intelligent automation:

- **CV Data Extraction**: Automatically extracts structured information from PDF CVs including personal details, work experience, education, skills, and more
- **Email Generation**: Generates personalized recruitment emails based on candidate information and job descriptions
- **Intelligent Parsing**: Uses AI to understand and structure unstructured CV data with high accuracy

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework for building efficient server-side applications
- **Database**: PostgreSQL with [TypeORM](https://typeorm.io/) for object-relational mapping
- **AI Integration**: [OpenAI API](https://openai.com/) for GPT-powered features
- **File Storage**: AWS S3 (with MinIO for local development)
- **PDF Processing**: `pdf-parse` for extracting text from PDF documents
- **API Documentation**: Swagger/OpenAPI via `@nestjs/swagger`
- **Validation**: `class-validator` and `class-transformer` for DTO validation

### Frontend
- **Framework**: [React 18](https://react.dev/) with TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- **Styling**: 
  - [Styled Components](https://styled-components.com/) for component styling
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query) for server state management
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with Zod validation
- **Internationalization**: [i18next](https://www.i18next.com/) for multi-language support (English, Dutch)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **HTTP Client**: Axios
- **Analytics**: Google Analytics 4 (GA4)

### Infrastructure & DevOps
- **Monorepo Management**: [Turborepo](https://turbo.build/) for build system and task orchestration
- **Package Manager**: [pnpm](https://pnpm.io/) with workspaces
- **Containerization**: Docker and Docker Compose
- **Database**: PostgreSQL 15
- **Object Storage**: 
  - **Production**: AWS S3
  - **Local Development**: MinIO (S3-compatible)
- **Production Infrastructure**: AWS (EC2, S3, CloudFront CDN, Route 53)

### Development Tools
- **TypeScript**: Strict type checking across all packages
- **ESLint**: Code linting with shared configurations
- **Prettier**: Code formatting
- **GitHub Actions**: CI/CD workflows

## 📁 Project Structure

This is a **monorepo** managed with Turborepo and pnpm workspaces, organized as follows:

```
rcruit-flow/
├── apps/
│   ├── backend/          # NestJS backend application
│   │   ├── src/
│   │   │   ├── application/    # Application layer (use cases)
│   │   │   │   ├── cv/        # CV-related use cases
│   │   │   │   ├── email/     # Email generation use cases
│   │   │   │   └── user/      # User management use cases
│   │   │   ├── domain/         # Domain layer (entities, value objects)
│   │   │   │   └── user/      # User domain entities
│   │   │   ├── infrastructure/ # Infrastructure layer
│   │   │   │   ├── gpt/       # OpenAI GPT service
│   │   │   │   ├── persistence/ # Database & repositories
│   │   │   │   └── s3/        # S3/MinIO file storage service
│   │   │   ├── interfaces/    # Interface adapters
│   │   │   │   └── http/      # HTTP controllers & DTOs
│   │   │   │       ├── cv/    # CV endpoints
│   │   │   │       ├── emails/ # Email endpoints
│   │   │   │       ├── users/ # User endpoints
│   │   │   │       └── health/ # Health check endpoints
│   │   │   └── shared/        # Shared utilities
│   │   └── Dockerfile
│   │
│   └── frontend/         # React frontend application
│       ├── src/
│       │   ├── pages/         # Page components
│       │   ├── components/    # Reusable UI components
│       │   ├── containers/    # Container components
│       │   ├── widgets/       # Feature widgets
│       │   ├── forms/         # Form components
│       │   ├── hooks/         # Custom React hooks
│       │   ├── queries/       # React Query hooks & API calls
│       │   ├── router/        # Routing configuration
│       │   ├── theme/         # Theme configuration
│       │   ├── i18n/          # Internationalization setup
│       │   └── utils/         # Utility functions
│       └── vite.config.ts
│
├── packages/
│   ├── dto/              # Shared Data Transfer Objects
│   │   └── src/
│   │       ├── cv/       # CV-related DTOs
│   │       ├── email/    # Email-related DTOs
│   │       ├── user/     # User-related DTOs
│   │       └── enum/     # Shared enums
│   │
│   ├── eslint-config/    # Shared ESLint configurations
│   │   ├── base.js       # Base ESLint config
│   │   ├── nest.js       # NestJS-specific config
│   │   └── react-internal.js # React-specific config
│   │
│   └── typescript-config/ # Shared TypeScript configurations
│       ├── base.json     # Base TS config
│       ├── nestjs.json   # NestJS TS config
│       └── react-library.json # React library TS config
│
├── docker-compose.yaml   # Local development services
├── turbo.json           # Turborepo configuration
├── pnpm-workspace.yaml  # pnpm workspace configuration
└── package.json         # Root package.json
```

## 🏗️ Architecture

The backend follows **Clean Architecture** (also known as Hexagonal Architecture) principles, organizing code into distinct layers:

### Layer Structure

1. **Domain Layer** (`domain/`)
   - Contains business entities and value objects
   - Pure business logic with no external dependencies
   - Example: `UserDomainEntity` with business rules

2. **Application Layer** (`application/`)
   - Contains use cases (business operations)
   - Orchestrates domain entities and infrastructure services
   - Examples: `ExtractCvContentUseCase`, `GenerateEmailUseCase`

3. **Infrastructure Layer** (`infrastructure/`)
   - External service integrations
   - Database repositories and ORM entities
   - File storage services
   - Examples: `GptService`, `S3Service`, `UserRepository`

4. **Interface Layer** (`interfaces/http/`)
   - HTTP controllers and DTOs
   - API endpoints and request/response handling
   - Swagger documentation

### Benefits of This Architecture

- **Separation of Concerns**: Each layer has a clear responsibility
- **Testability**: Business logic is isolated from infrastructure
- **Maintainability**: Changes in one layer don't cascade to others
- **Flexibility**: Easy to swap implementations (e.g., different AI providers, databases)

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18
- **pnpm**: >= 8 (or install via `npm install -g pnpm@10.13.1`)
- **Docker** and **Docker Compose** (for local services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rcruit-flow
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Backend (create `apps/backend/.env`):
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_ORG_ID=your_openai_org_id
   OPENAI_MODEL=gpt-4
   
   # S3/MinIO
   S3_ENDPOINT=http://localhost:9000
   S3_ACCESS_KEY=minio
   S3_SECRET_KEY=minio123
   S3_BUCKET_NAME=your_bucket
   S3_REGION=us-east-1
   
   # Server
   PORT=3001
   ```

   Frontend (create `apps/frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. **Start local services** (PostgreSQL and MinIO)
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations** (if applicable)
   ```bash
   cd apps/backend
   # Run your migration commands here
   ```

### Development

**Run all applications in development mode:**
```bash
pnpm dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:3000`

**Run specific applications:**
```bash
# Backend only
cd apps/backend
pnpm dev

# Frontend only
cd apps/frontend
pnpm dev
```

### Building

**Build all packages and applications:**
```bash
pnpm build
```

Turborepo will automatically handle build dependencies and caching.

### Other Commands

```bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check all packages
pnpm check

# Format code
pnpm format

# Clean build artifacts and dependencies
pnpm clean
```

## 📦 Monorepo Management

### Turborepo

This project uses [Turborepo](https://turbo.build/) for:
- **Task Orchestration**: Efficiently runs tasks across packages
- **Build Caching**: Caches build outputs for faster subsequent builds
- **Task Dependencies**: Automatically handles build order (e.g., `@repo/dto` must build before apps that depend on it)
- **Parallel Execution**: Runs independent tasks in parallel

Key configuration in `turbo.json`:
- `build`: Depends on `^build` (builds dependencies first)
- `check`: Depends on `@repo/dto#build` (ensures DTOs are built before type checking)
- `dev`: Persistent task (doesn't cache, runs continuously)

### pnpm Workspaces

The project uses **pnpm workspaces** for:
- **Dependency Management**: Shared dependencies across packages
- **Internal Package References**: Packages reference each other via `workspace:*`
- **Hoisting**: Efficient node_modules structure

Workspace packages:
- `@repo/dto` - Shared DTOs
- `@repo/eslint-config` - ESLint configurations
- `@repo/typescript-config` - TypeScript configurations

### Vite

The frontend uses **Vite** for:
- **Fast HMR**: Lightning-fast hot module replacement
- **Optimized Builds**: Production builds with code splitting
- **TypeScript Support**: Built-in TypeScript support
- **Plugin Ecosystem**: SVGR, React, TypeScript path aliases

## 📝 API Documentation

Once the backend server is running, Swagger documentation is available at:
```
http://localhost:3001/api
```

## 🐳 Docker

### Development Services

The `docker-compose.yaml` file includes:
- **PostgreSQL 15**: Database server
- **MinIO**: S3-compatible object storage for local development

### Production Deployment

The backend includes a `Dockerfile` for containerized deployment. Build and run:

```bash
cd apps/backend
docker build -t rcruit-flow-backend .
docker run -p 3001:3001 rcruit-flow-backend
```

## ☁️ AWS Production Infrastructure

The production environment is hosted on **Amazon Web Services (AWS)** with the following services:

### Infrastructure Components

- **EC2**: Hosts the backend application server
  - Runs the containerized NestJS backend
  - Handles API requests and business logic processing

- **S3 (Simple Storage Service)**: Object storage for file management
  - Stores uploaded CV files (PDFs)
  - Provides durable and scalable file storage
  - Integrated with the backend via AWS SDK

- **CloudFront CDN**: Content Delivery Network
  - Serves static frontend assets with low latency
  - Distributes content globally for improved performance
  - Provides caching and edge location optimization

- **Route 53**: DNS and domain management
  - Manages domain name resolution
  - Handles DNS routing to the application
  - Provides domain zone configuration