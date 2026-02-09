# AGENTS Guidelines for This Repository

## Project Name: Phos CLI

Full-stack interactive project generator CLI that scaffolds modern web applications with configurable backends and frontends.

**Version:** 1.0.0 (Production Release)

### Core Features:

1. **Interactive CLI** - Beautiful prompts using @clack/prompts
2. **Multiple Backends** - Elysia (Bun), FastAPI (Python)
3. **Multiple Frontends** - Astro, Svelte, Next.js
4. **Monorepo Support** - Workspace configuration for scalable projects
5. **Configurable Tooling** - TypeScript, ESLint, Prettier options
6. **CSS Frameworks** - Tailwind, SCSS, CSS Modules
7. **UI Components** - shadcn/ui, Radix UI
8. **Testing Support** - Vitest, Playwright

### Technology Stack:

- **CLI**: Node.js + TypeScript
- **CLI Framework**: Commander.js
- **Interactive Prompts**: @clack/prompts
- **File Operations**: fs-extra
- **Template Engine**: Handlebars
- **Terminal Colors**: picocolors
- **Backend**: Elysia (Bun), FastAPI (Python)
- **Frontend**: Astro, SvelteKit, Next.js
- **Package Managers**: npm, yarn, pnpm, bun

## 1. Development Workflow

### CLI Tool (Phos)

- Use Commander.js for CLI argument parsing
- Use @clack/prompts for beautiful interactive UI
- Use fs-extra for file system operations
- Use Handlebars for template rendering
- Use picocolors for terminal colors

## 2. Architecture

### Core Components

```
src/
├── cli.ts                  # Main CLI entry point
├── generators/
│   ├── monorepo.ts         # Monorepo scaffold generator
│   ├── single.ts           # Single project generator
│   ├── backends/
│   │   ├── elysia.ts       # Elysia (Bun) backend generator
│   │   └── fastapi.ts      # FastAPI (Python) backend generator
│   └── frontends/
│       ├── astro.ts        # Astro frontend generator
│       ├── svelte.ts       # Svelte frontend generator
│       └── nextjs.ts       # Next.js frontend generator
├── templates/              # Project templates
└── utils/
    └── helpers.ts          # Helper functions
```

### File Naming Conventions

| Layer        | Pattern          | Example                 |
| ------------ | ---------------- | ----------------------- |
| CLI Commands | `*.ts`           | `cli.ts`, `monorepo.ts` |
| Generators   | `{framework}.ts` | `elysia.ts`, `astro.ts` |
| Utils        | `*.ts`           | `helpers.ts`            |

**Rules:**

- Use **PascalCase** for generator files
- Use **camelCase** for utility functions
- Export generators as named exports

## 3. Keep Dependencies in Sync

When adding/updating packages:

```bash
bun install <package>
# OR
npm install <package>
```

## 4. Coding Conventions

### TypeScript

- Use modern TypeScript with strict mode enabled
- Import using `@/` alias for internal modules
- Use ES modules with `.js` extensions

### Project Templates

- Use Handlebars for dynamic content
- Include TypeScript/ESLint/Prettier options as needed
- Generate complete project structures

## 5. Key Technologies

### CLI Framework

- **Commander.js** - Command-line interface framework
- **@clack/prompts** - Interactive prompts
- **fs-extra** - Enhanced file system operations
- **Handlebars** - Template engine
- **picocolors** - Terminal colors

### Supported Backends

- **Elysia** - Fast and elegant Bun web framework
- **FastAPI** - Modern Python web framework

### Supported Frontends

- **Astro** - Modern static site generator
- **SvelteKit** - Full-stack Svelte framework
- **Next.js** - React framework with server components

## 6. Configuration Options

### Backend Options

- **TypeScript** - Enable/disable TypeScript
- **ESLint** - Add ESLint configuration
- **Prettier** - Add Prettier configuration

### Frontend Options

- **TypeScript** - Enable/disable TypeScript
- **ESLint** - Add ESLint configuration
- **Prettier** - Add Prettier configuration
- **CSS Framework** - Tailwind, SCSS, CSS Modules
- **UI Components** - shadcn/ui, Radix UI
- **Testing** - Vitest, Playwright, or both

## 7. Available Commands

| Command                   | Purpose                        |
| ------------------------- | ------------------------------ |
| `bun run dev create`      | Run CLI in development mode    |
| `bun run build`           | Build TypeScript to JavaScript |
| `bun run start`           | Run built CLI                  |
| `node dist/cli.js create` | Run CLI directly               |
| `bun link`                | Link CLI globally              |
| `phos create`             | Run CLI (after linking)        |

## 8. Versioning

Phos CLI follows semantic versioning:

- **x.y.z (Patch/Bugfix)**: `0.0.x`, `1.0.x`, `2.0.x`
  - Bug fixes
  - Documentation updates
  - Small improvements

- **x.y.0 (Minor/Feature)**: `0.x.0`, `1.x.0`, `2.x.0`
  - New features
  - Breaking changes (when < 1.0.0)
  - Significant updates

- **x.0.0 (Major/Milestone)**: `1.0.0`, `2.0.0`, `3.0.0`
  - Major architectural changes
  - Complete rewrites
  - Production-ready releases

**Current Version: 1.0.0** - Production Release

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.
