<div align="center">

  <h1>Phos ✨</h1>

Full-stack interactive project generator CLI

[![npm version](https://badge.fury.io/js/phos.svg)](https://www.npmjs.com/package/phos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/phos)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

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

## Quick Start

```bash
bun create phos
```

Follow the interactive prompts to configure your project, and Phos will generate a production-ready scaffold in seconds.

## Installation

### From NPM

```bash
bun create phos
npm create phos
yarn create phos
```

### Local Development

```bash
git clone <repository-url>
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
3. **Backend Framework** - Elysia or FastAPI
4. **Backend Package Manager** - npm, yarn, pnpm, or bun
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

## Tech Stack

### Core

- **Runtime**: Node.js + TypeScript
- **CLI Framework**: Commander.js
- **Interactive Prompts**: @clack/prompts
- **File Operations**: fs-extra
- **Template Engine**: Handlebars
- **Colors**: picocolors

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

## Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev create

# Build the project
bun run build

# Run the built CLI
node dist/cli.js create
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [Clack](https://github.com/natemoo-re/clack) - Beautiful CLI prompts
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Picocolors](https://github.com/alexeyraspopov/picocolors) - Tiny color library

## License

[MIT](LICENSE)

---

<div align="center">

Made with ❤️ by the Phos team

</div>
