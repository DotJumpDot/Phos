# Changelog

All notable changes to Phos CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
  - TypeScript path aliases configured (@/*)
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

### Project Structure

```
phos/
├── src/
│   ├── cli.ts                  # Main CLI entry point
│   ├── generators/
│   │   ├── monorepo.ts         # Monorepo generator
│   │   ├── single.ts           # Single project generator
│   │   ├── backends/
│   │   │   ├── elysia.ts       # Elysia backend
│   │   │   └── fastapi.ts      # FastAPI backend
│   │   └── frontends/
│   │       ├── astro.ts        # Astro frontend
│   │       ├── svelte.ts       # Svelte frontend
│   │       └── nextjs.ts       # Next.js frontend
│   ├── templates/              # Template files
│   └── utils/
│       └── helpers.ts          # Helper functions
├── package.json                 # Package configuration
├── tsconfig.json               # TypeScript configuration
├── .gitignore                 # Git ignore rules
├── AGENTS.md                  # Project guidelines
├── CHANGELOG.md               # Version history
└── README.md                  # Documentation
```

## [Future Versions]

### Planned Features

- Additional backend frameworks (Express, NestJS, etc.)
- Additional frontend frameworks (React, Vue, etc.)
- More template customization options
- Plugin system for custom generators
- Better error handling and validation
- Progress indicators during generation
- Configuration file support (.phosrc)
