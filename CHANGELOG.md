# Changelog

All notable changes to Phos CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
