# Changelog

All notable changes to Phos CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.3.2] - 2026-02-14

### Added
- **UI Component Library Implementation** - Complete UI library support for all frontend frameworks
  - Next.js: Ant Design, shadcn/ui, Radix UI, Material UI, HeroUI
  - Vue: Vuetify, Element Plus, Quasar, PrimeVue, Naive UI
  - Astro: daisyUI, fulldev/ui, shadcn/ui (via React integration)
  - Svelte: shadcn-svelte, Svelte Material UI, Headless UI, Agnostic UI
  - All UI library dependencies are automatically added to package.json via Handlebars templates
  - Framework-specific configuration included for each UI library

### Changed
- **Template-Based UI Library Support** - Moved from programmatic installation to template-based approach
  - UI library dependencies now handled in package.json templates using Handlebars conditionals
  - Simplified generator code by removing programmatic dependency installation
  - Cleaner separation between template configuration and generation logic
- **GeneratorConfig Type** - Updated to include all UI library options across all frameworks
  - Added 16 UI library options across 4 frontend frameworks
  - Each framework now has specific UI library options available
- **Documentation** - Updated version references to 1.3.2

## [1.3.1] - 2026-02-13

### Added

- **Vue Frontend Support** - Complete Vue frontend framework integration
  - Added Vue as a new frontend framework option alongside Astro, Svelte, and Next.js
  - Vue Router for client-side routing
  - Pinia for state management
  - TypeScript support with Vitest for testing
  - Playwright for E2E testing
  - ESLint and Prettier configuration
  - Comprehensive CLI generator for Vue projects
  - Updated CLI to include Vue in framework selection
  - Updated monorepo and single project generators to support Vue

### Changed

- **Documentation Updates**:
  - Updated README.md to reflect all supported frameworks (Elysia, FastAPI, NestJS for backend; Astro, Svelte, Next.js, Vue for frontend)
  - Removed UI component library references from documentation (feature not yet implemented)
  - Updated version references to 1.3.1 across all documentation files
  - Updated AGENTS.md to include Vue in supported frontends list
- **CLI Framework Selection** - Added Vue option to frontend framework selector for both monorepo and single project modes

### Fixed

- **Documentation Accuracy** - Corrected README.md to accurately reflect implemented features
  - Removed non-existent UI component library listings
  - Updated framework lists to match actual implementation

## [1.3.0] - 2026-02-13

### Added

- **NestJS Backend Support** - Complete NestJS backend framework integration
  - Added NestJS as a new backend framework option alongside Elysia and FastAPI
  - TypeORM integration with PostgreSQL database support
  - Swagger API documentation with automatic setup at `/api` endpoint
  - Complete user CRUD API implementation
  - User entity with fields: id, email, username, fullName, password, avatarUrl, bio, role, isActive, createdAt, updatedAt
  - Security features:
    - bcrypt password hashing (SALT_ROUNDS = 10)
    - JWT authentication support via @nestjs/jwt and passport-jwt
    - Request validation with class-validator
  - Configuration via environment variables (.env.example provided)
  - Comprehensive CLI generator for NestJS projects
  - Updated CLI to include NestJS in framework selection
  - Updated monorepo and single project generators to support NestJS

### Changed

- **CLI Framework Selection** - Added NestJS option to backend framework selector
- **Documentation** - Updated AGENTS.md with NestJS backend options and architecture
- **Dependencies** - Updated template package.json with required NestJS packages

## [1.2.1] - 2026-02-13

### Fixed

- **TypeScript Type Error**: Fixed type assertion for `uiComponents` variable in CLI
  - Changed from complex type expression to simple `as typeof uiComponents`
  - Fixed both monorepo and single project mode UI component selections
  - Resolved `Type 'string' is not assignable to union type` error

## [1.2.0] - 2026-02-13

### Added

- **Backend API Architecture**: Complete user CRUD API implementation for both Elysia and FastAPI
  - Added layered architecture with API, Service, SQL, Types, and Function layers
  - Data flow: API (validation) → Service (business logic) → SQL (queries) → Database
  - User entity with fields: id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
  - Create, Read, Update, Delete, Soft Delete, and Search operations
  - Password hashing with bcrypt (SALT_ROUNDS = 10)
  - Validation helpers for email, string, and boolean types
  - Proper error handling with appropriate HTTP status codes

### Changed

- **Backend Templates**: Enhanced both Elysia and FastAPI templates with user API example
  - Elysia: Uses `db` template literal syntax for SQL queries
  - FastAPI: Uses async/await with asyncpg for database operations
  - Both include comprehensive CRUD operations and validation

## [1.1.0] - 2026-02-10

### Changed

- **CLI UX**: Improve UX with spinner and recommended package managers
  - Replace verbose log messages with spinner for better user experience
  - Add framework-specific recommended package managers in CLI prompts
  - Remove redundant success logs from individual generator functions
  - Update version to 1.1.0 in package.json and documentation

## [1.0.3] - 2026-02-10

### Fixed

- **Template Path Resolution**: Fixed issue where generators were looking for templates relative to the current working directory instead of the package installation directory.
- **npx Support**: Improved support for running via `npx` by using absolute paths relative to the package root for template resolution.

## [1.0.2] - 2026-02-10

### Fixed

- **Template Inclusion**: Fixed missing template files in the published npm package by adding `src/templates` to the `files` field in `package.json`.

## [1.0.1] - 2026-02-10

### Fixed

- **Path Alias Resolution**: Fixed TypeScript path alias (`@/`) not being converted to relative paths during compilation
- **Module Import Error**: Fixed `ERR_MODULE_NOT_FOUND` error when running published package via `npx phos create`
- **Build Process**: Added `tsc-alias` package to properly convert path aliases to relative paths
- **Template Compilation**: Excluded template files from TypeScript compilation to prevent missing dependency errors

### Changed

- **Build Script**: Updated build script to `tsc && tsc-alias` for proper path alias resolution
- **tsconfig.json**: Added `src/templates/**/*` to exclude list to prevent template compilation errors

### Dependencies

- Added `tsc-alias: ^1.8.16` to devDependencies

## [1.0.0] - 2026-02-09

### Added

- **Production Release**: Phos CLI is now production-ready with full feature support
- **Interactive CLI**: Beautiful command-line interface powered by @clack/prompts
- **Project Types**: Support for both Monorepo and Single repository structures
- **Backend Frameworks**:
  - Elysia - Fast and elegant Bun web framework with TypeScript support
  - FastAPI - Modern Python web framework with type hints
- **Frontend Frameworks**:
  - Astro - Modern static site generator
  - SvelteKit - Full-stack Svelte framework
  - Next.js - React framework with server components and App Router
- **Monorepo Features**:
  - Organized workspace structure with `{ProjectName}_Backend` and `{ProjectName}_Frontend` folders
  - `Docs/` folder with `Feature` and `DatabaseSetup` subfolders
  - Root-level documentation: `AGENTS.md`, `LICENSE`, `env.example`
  - Independent project configurations without workspace dependencies
- **Single Project Mode**: Generate standalone backend or frontend projects
- **Package Manager Support**:
  - Node.js: npm, yarn, pnpm, bun
  - Python: venv (virtual environment), pip (system)
- **Configurable Tooling**:
  - TypeScript support for backend (Elysia only) and frontend frameworks
  - ESLint configuration with custom rules
  - Prettier code formatting
- **CSS Framework Options**: Tailwind CSS, SCSS, CSS Modules, or no framework
- **UI Component Libraries**: shadcn/ui, Radix UI, or no components
- **Testing Frameworks**: Vitest, Playwright, or both for unit and E2E testing
- **Git Integration**: Optional Git repository initialization
- **Dependency Installation**: Optional automatic dependency installation
- **Template System**: Handlebars-based template engine with dynamic configuration
- **Binary File Support**: Proper handling of images, fonts, and other binary files
- **Helper Functions**:
  - `eq` helper for equality checks in templates
  - `or` helper for OR conditions in templates
- **Configuration Summary**: Interactive summary display before project generation
- **Project Validation**: Directory existence checks and project name validation
- **Complete Documentation**: Auto-generated README.md, AGENTS.md, and schema docs

### Fixed

- **Binary File Handling**: Fixed `copyTemplate` function to properly handle binary files
- **Template Processing**: Binary files (PNG, JPG, fonts, archives) are now copied directly without Handlebars processing
- **Error Handling**: Improved error messages and cancellation handling throughout the CLI

### Changed

- **Monorepo Structure**: Updated from `apps/backend` and `apps/frontend` to capitalized `{ProjectName}_Backend` and `{ProjectName}_Frontend`
- **Folder Naming**: Backend and frontend folder names now have capitalized first letters
- **Default Configuration**: TypeScript, ESLint, and Prettier now default to `true`
- **User Experience**: Users must manually deselect options they don't want instead of selecting them

### Dependencies

- @clack/prompts: ^1.0.0
- commander: ^14.0.2
- fs-extra: ^11.3.3
- handlebars: ^4.7.8
- picocolors: ^1.1.1
- typescript: ^5.7.3
- tsx: ^4.19.2 (dev)
- @types/fs-extra: ^11.0.4 (dev)
- @types/node: ^20.11.0 (dev)

### Project Structure

```
phos/
├── src/
│   ├── cli.ts                  # Main CLI entry point
│   ├── generators/
│   │   ├── monorepo.ts         # Monorepo generator
│   │   ├── single.ts           # Single project generator
│   │   ├── backends/
│   │   │   ├── elysia.ts       # Elysia backend generator
│   │   │   └── fastapi.ts      # FastAPI backend generator
│   │   └── frontends/
│   │       ├── astro.ts        # Astro frontend generator
│   │       ├── svelte.ts       # Svelte frontend generator
│   │       └── nextjs.ts       # Next.js frontend generator
│   ├── templates/              # Project templates
│   │   ├── backend/
│   │   │   ├── elysia/         # Elysia template files
│   │   │   └── fastapi/        # FastAPI template files
│   │   └── frontend/
│   │       ├── astro/          # Astro template files
│   │       ├── nextjs/         # Next.js template files
│   │       └── svelte/         # Svelte template files
│   └── utils/
│       └── helpers.ts          # Helper functions
├── package.json                 # Package configuration
├── tsconfig.json               # TypeScript configuration
├── .gitignore                 # Git ignore rules
├── AGENTS.md                  # Project guidelines
├── CHANGELOG.md               # Version history
└── README.md                  # Documentation
```

## [0.3.0] - 2026-02-09

### Changed

- **Monorepo Structure Update**:
  - Changed from `apps/backend` and `apps/frontend` to `{ProjectName}_Backend` and `{ProjectName}_Frontend`
  - Added `Docs` folder with `Feature` and `DatabaseSetup` subfolders
  - Added root level files: `AGENTS.md`, `LICENSE`, `env.example`
  - Removed root `package.json` and workspace config files
  - Each project now manages its own configurations independently
- **Folder Naming**:
  - Backend and frontend folder names now have capitalized first letter
  - Example: `Colorful_Backend` and `Colorful_Frontend` instead of `colorful_Backend`
- **Default Configuration**:
  - TypeScript, ESLint, and Prettier now default to `true`
  - Users must manually deselect options they don't want

### Fixed

- **Binary File Handling**:
  - Fixed `copyTemplate` function to properly handle binary files
  - Binary files (PNG, JPG, fonts, archives, etc.) are now copied directly
  - No longer attempts to process binary files as Handlebars templates
  - Fixes "IHDR" error when copying image files

## [0.2.0] - 2025-02-09

### Changed

- **Template System Refactor**:
  - All generators now use template files instead of dynamic generation
  - Handlebars templating with conditional logic
  - Dynamic configuration support (projectName, projectType, tooling options)
  - Clean separation between generators and templates
- **Template Structure**:
  - Backend templates: Elysia, FastAPI with full project structures
  - Frontend templates: Astro, Svelte, Next.js with proper configs
  - All templates use Handlebars variables for customization
- **Helper Functions**:
  - `eq` helper for equality checks in templates
  - `or` helper for OR conditions in templates
  - `copyTemplate` function for template copying and rendering
- **ESLint Configuration**:
  - Added `.eslintignore` to exclude template folder
  - Prevents false positives from Handlebars syntax in templates

## [0.1.0] - 2025-02-09

### Added

- **Initial Release**: Complete project generator CLI
  - Interactive prompts using @clack/prompts
  - Multiple backend frameworks (Elysia, FastAPI)
  - Multiple frontend frameworks (Astro, Svelte, Next.js)
  - Monorepo and single project support
  - Configurable tooling (TypeScript, ESLint, Prettier)
  - CSS framework options (Tailwind, SCSS, CSS Modules)
  - UI component library support (shadcn/ui, Radix UI)
  - Testing framework options (Vitest, Playwright)
  - Multiple package manager support (npm, yarn, pnpm, bun)
- **Project Structure**:
  - Well-organized codebase with generators, templates, and utilities
  - TypeScript path aliases configured (@/\*)
  - Comprehensive documentation (AGENTS.md, CHANGELOG.md, README.md)
- **Configuration**:
  - TypeScript strict mode enabled
  - Module resolution set to bundler
  - Path aliases for clean imports
- **Dependencies Updated**:
  - @clack/prompts: ^0.7.0 → ^1.0.0
  - commander: ^12.0.0 → ^14.0.3
  - fs-extra: ^11.2.0 → ^11.3.3
  - handlebars: ^4.7.8 (unchanged)
  - picocolors: ^1.0.0 → ^1.1.1
  - tsx: ^4.7.0 → ^4.19.2
  - typescript: ^5.3.0 → ^5.7.3
  - @types/fs-extra: ^11.0.4 (unchanged)
  - @types/node: ^20.11.0 (kept for Node 20 compatibility)
