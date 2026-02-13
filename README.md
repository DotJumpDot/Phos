<div align="center">

  <h1>Phos ✨</h1>

Full-stack interactive project generator CLI

[![npm version](https://badge.fury.io/js/phos.svg)](https://www.npmjs.com/package/phos)
[![Downloads](https://img.shields.io/npm/dm/phos)](https://www.npmjs.com/package/phos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/phos)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**Version 1.2.0 - Production Release** 🎉

[View on npmjs.com](https://www.npmjs.com/package/phos)

</div>

---

## About

Phos is a powerful CLI tool that scaffolds modern full-stack web applications with configurable backends and frontends. Get started in seconds with interactive prompts and pre-configured templates.

## Features

- ✨ Interactive CLI with beautiful prompts
- 🚀 Multiple backend frameworks (Elysia, FastAPI)
- 🎨 Multiple frontend frameworks (Astro, Svelte, Next.js)
- 📦 Monorepo support with workspace configuration
- 🛠️ Configurable tooling (TypeScript, ESLint, Prettier)
- 🎨 CSS framework options (Tailwind, SCSS, CSS Modules)
- 🧩 UI component library support (shadcn/ui, Radix UI)
- 🧪 Testing framework options (Vitest, Playwright)
- 🔤 Multiple package manager support (npm, yarn, pnpm, bun)
- 📝 Automatic README generation
- 🌳 Git initialization
- 🎯 Single project mode for standalone applications
- 📚 Comprehensive documentation auto-generation

## Tech Stack

### Core

<div align="center">

| Technology                                                                                                          | Description          | Version |
| ------------------------------------------------------------------------------------------------------------------- | -------------------- | ------- |
| ![Node.js](https://img.shields.io/badge/Node.js-20+-43853D?style=flat-square&logo=node.js&logoColor=white)          | Runtime Environment  | 20+     |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white) | Programming Language | 5.7+    |
| ![Commander.js](https://img.shields.io/badge/Commander.js-14.0-000000?style=flat-square)                            | CLI Framework        | 14.0+   |
| ![Clack](https://img.shields.io/badge/@clack/prompts-1.0-8B5CF6?style=flat-square)                                  | Interactive Prompts  | 1.0+    |
| ![fs-extra](https://img.shields.io/badge/fs--extra-11.3-0288D1?style=flat-square)                                   | File Operations      | 11.3+   |
| ![Handlebars](https://img.shields.io/badge/Handlebars-4.7-F0772E?style=flat-square)                                 | Template Engine      | 4.7+    |
| ![Picocolors](https://img.shields.io/badge/Picocolors-1.1-E67E22?style=flat-square)                                 | Terminal Colors      | 1.1+    |

</div>

### Supported Frameworks

#### Backend

| Framework                                | Runtime | Description                        |
| ---------------------------------------- | ------- | ---------------------------------- |
| [Elysia](https://elysiajs.com/)          | Bun     | Fast and elegant Bun web framework |
| [FastAPI](https://fastapi.tiangolo.com/) | Python  | Modern Python web framework        |

#### Frontend

| Framework                            | Description                            |
| ------------------------------------ | -------------------------------------- |
| [Astro](https://astro.build/)        | Modern static site generator           |
| [SvelteKit](https://kit.svelte.dev/) | Full-stack Svelte framework            |
| [Next.js](https://nextjs.org/)       | React framework with server components |

## Quick Start

<div align="center">

### Choose Your Package Manager

| npm               | yarn                   | bun                |
| ----------------- | ---------------------- | ------------------ |
| `npx phos create` | `yarn dlx phos create` | `bunx phos create` |

</div>

Follow the interactive prompts to configure your project, and Phos will generate a production-ready scaffold in seconds.

## Installation

### From NPM

<div align="center">

```bash
npx phos create
```

</div>

#### Alternative Package Managers

```bash
bunx phos create
yarn dlx phos create
```

### Local Development

```bash
git clone https://github.com/DotJumpDot/Phos.git
cd phos
bun install
bun link
phos create
```

## Usage

```bash
phos create
```

Phos will guide you through a series of questions to configure your project:

1. **Project Name** - Name of your new project
2. **Project Type** - Monorepo or Single repo
3. **Backend Framework** - Elysia or FastAPI (Monorepo mode)
4. **Backend Package Manager** - npm, yarn, pnpm, bun, venv, or pip
5. **Backend: Use TypeScript?** - Enable TypeScript for backend
6. **Backend: Add ESLint?** - Add ESLint configuration
7. **Backend: Add Prettier?** - Add Prettier configuration
8. **Frontend Framework** - Astro, Svelte, or Next.js
9. **Frontend Package Manager** - npm, yarn, pnpm, or bun
10. **Frontend: Use TypeScript?** - Enable TypeScript for frontend
11. **Frontend: Add ESLint?** - Add ESLint configuration
12. **Frontend: Add Prettier?** - Add Prettier configuration
13. **Select CSS Framework** - No, Tailwind CSS, SCSS, or CSS Modules
14. **Add UI Components?** - No, shadcn/ui, or Radix UI
15. **Add Testing?** - No, Vitest, Playwright, or both
16. **Initialize Git?** - Initialize a Git repository
17. **Install Dependencies?** - Auto-install dependencies after generation

## Project Types

### Monorepo Mode

Generates a full-stack monorepo with separate backend and frontend projects:

```
my-project/
├── MyProject_Backend/    # Backend application
├── MyProject_Frontend/   # Frontend application
├── Docs/                 # Documentation folder
│   ├── Feature/          # Feature documentation
│   └── DatabaseSetup/    # Database setup scripts
├── AGENTS.md             # Agent guidelines
├── LICENSE               # License file
├── env.example           # Environment variables template
└── README.md             # Project README
```

### Single Project Mode

Generates a standalone backend or frontend project:

```
my-project/
├── src/                  # Source code
├── public/               # Static assets (frontend)
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md             # Project documentation
```

## Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev create

# Build project
bun run build

# Run the built CLI
node dist/cli.js create
```

## Examples

### Create a Monorepo with Elysia and Next.js

```bash
npx phos create
# Project name: my-awesome-app
# Project type: Monorepo
# Backend Framework: Elysia
# Backend package manager: bun
# Backend: Use TypeScript? Yes
# Backend: Add ESLint? Yes
# Backend: Add Prettier? Yes
# Frontend Framework: NextJS
# Frontend package manager: bun
# Frontend: Use TypeScript? Yes
# Frontend: Add ESLint? Yes
# Frontend: Add Prettier? Yes
# CSS Framework: Tailwind CSS
# UI Components: shadcn/ui
# Testing: Vitest + Playwright
# Initialize Git? Yes
# Install dependencies? No
```

### Create a Single Astro Project

```bash
bunx phos create
# Project name: my-astro-site
# Project type: Single repo
# Framework: Astro
# Package manager: bun
# Use TypeScript? Yes
# Add ESLint? Yes
# Add Prettier? Yes
# CSS Framework: Tailwind CSS
# UI Components: No
# Testing: Vitest
# Initialize Git? Yes
# Install dependencies? No
```

## Generated Projects Include

### Backend (Elysia/FastAPI)

- Pre-configured framework setup
- Example API endpoints
- Service layer architecture
- Database connection setup
- TypeScript/Python type definitions
- ESLint/Pylint configuration
- Prettier/Black configuration

### Frontend (Astro/Svelte/Next.js)

- Pre-configured framework setup
- Example components and pages
- Responsive layout
- CSS framework integration
- TypeScript configuration
- ESLint configuration
- Prettier configuration
- Testing setup (Vitest/Playwright)

### Documentation

- Comprehensive README.md
- AGENTS.md with project guidelines
- Database schema documentation
- Feature documentation templates
- Environment variable templates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Versioning

Phos follows [semantic versioning](https://semver.org/).

- **1.2.0** - Minor release (backend API architecture)
- **1.1.0** - Minor release (new features, non-breaking changes)
- **1.0.3** - Patch release (template path fix)
- **1.0.2** - Patch release (template missing fix)
- **1.0.1** - Patch release (bug fixes)
- **1.0.0** - Production release with full feature support
- **1.x.0** - Minor releases (new features, non-breaking changes)
- **x.0.0** - Major releases (breaking changes)

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## Acknowledgments

- [Clack](https://github.com/natemoo-re/clack) - Beautiful CLI prompts
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Picocolors](https://github.com/alexeyraspopov/picocolors) - Tiny color library

## License

[MIT](LICENSE)

---

<div align="center">

Made with ❤️ by the Phos Team

</div>
