import {
  createDirectory,
  writeFile,
  getProjectPath,
  logStep,
  logSuccess,
  logInfo,
  installDependencies,
  initializeGit,
  type GeneratorConfig,
} from '@/utils/helpers.js';
import { generateElysiaBackend } from "@/generators/backends/elysia.js";
import { generateFastAPIBackend } from "@/generators/backends/fastapi.js";
import { generateAstroFrontend } from "@/generators/frontends/astro.js";
import { generateSvelteFrontend } from "@/generators/frontends/svelte.js";
import { generateNextJSFrontend } from "@/generators/frontends/nextjs.js";

export async function generateMonorepo(config: GeneratorConfig): Promise<void> {
  const projectPath = getProjectPath(config.projectName);

  logStep(`Creating monorepo at ${projectPath}`);
  await createDirectory(projectPath);

  const appsPath = `${projectPath}/apps`;
  const packagesPath = `${projectPath}/packages`;
  await createDirectory(appsPath);
  await createDirectory(packagesPath);

  await generateRootPackageJson(projectPath, config);
  await generateWorkspaceConfig(projectPath, config);
  await generateSharedTsConfig(projectPath);
  await generateSharedEslintConfig(projectPath, config);
  await generateSharedPrettierConfig(projectPath, config);
  await generateGitIgnore(projectPath);
  await generateReadme(projectPath, config);

  const backendPath = `${appsPath}/backend`;
  await createDirectory(backendPath);

  switch (config.backend.framework) {
    case "elysia":
      await generateElysiaBackend(backendPath, config);
      break;
    case "fastapi":
      await generateFastAPIBackend(backendPath, config);
      break;
  }

  const frontendPath = `${appsPath}/frontend`;
  await createDirectory(frontendPath);

  switch (config.frontend.framework) {
    case "astro":
      await generateAstroFrontend(frontendPath, config);
      break;
    case "svelte":
      await generateSvelteFrontend(frontendPath, config);
      break;
    case "nextjs":
      await generateNextJSFrontend(frontendPath, config);
      break;
  }

  await createDirectory(`${packagesPath}/shared`);
  await generateSharedPackage(`${packagesPath}/shared`, config);

  logSuccess("Backend created at apps/backend");
  logSuccess("Frontend created at apps/frontend");
  logSuccess("Shared packages configured");
  logSuccess("Workspace configured");

  if (config.git) {
    await initializeGit(projectPath);
  }

  if (config.install) {
    await installDependencies(projectPath, config.frontend.packageManager);
  }

  logInfo("\n📦 Next steps:");
  logInfo(`  cd ${config.projectName}`);
  logInfo(`  # Backend`);
  logInfo(
    `  cd apps/backend && ${config.backend.packageManager} install && ${config.backend.packageManager} run dev`
  );
  logInfo(`  # Frontend`);
  logInfo(
    `  cd apps/frontend && ${config.frontend.packageManager} install && ${config.frontend.packageManager} run dev`
  );
}

async function generateRootPackageJson(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  const packageManager = config.frontend.packageManager;

  const content = JSON.stringify(
    {
      name: config.projectName,
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: `${packageManager} run --filter "apps/*" dev`,
        build: `${packageManager} run --filter "apps/*" build`,
        lint: `${packageManager} run --filter "*" lint`,
        format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"',
      },
      workspaces: ["apps/*", "packages/*"],
      devDependencies: {
        ...(config.backend.eslint || config.frontend.eslint
          ? {
              eslint: "^8.57.0",
              "@typescript-eslint/parser": "^7.0.0",
              "@typescript-eslint/eslint-plugin": "^7.0.0",
            }
          : {}),
        ...(config.backend.prettier || config.frontend.prettier ? { prettier: "^3.2.0" } : {}),
        ...(config.backend.typescript || config.frontend.typescript
          ? { typescript: "^5.3.0" }
          : {}),
      },
    },
    null,
    2
  );

  await writeFile(`${projectPath}/package.json`, content);
  logSuccess("Root package.json created");
}

async function generateWorkspaceConfig(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  let content = "";

  switch (config.frontend.packageManager) {
    case "pnpm":
      content = `packages:\n  - 'apps/*'\n  - 'packages/*'\n`;
      await writeFile(`${projectPath}/pnpm-workspace.yaml`, content);
      break;
    case "yarn":
      content = JSON.stringify({ workspaces: ["apps/*", "packages/*"] }, null, 2);
      await writeFile(`${projectPath}/package.json`, content);
      break;
    case "npm":
    case "bun":
      await writeFile(`${projectPath}/.npmrc`, "workspaces=apps/* packages/*");
      break;
  }

  logSuccess("Workspace configuration created");
}

async function generateSharedTsConfig(projectPath: string): Promise<void> {
  const content = JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ES2022",
        lib: ["ES2022"],
        moduleResolution: "bundler",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        composite: true,
      },
      references: [
        { path: "./apps/backend" },
        { path: "./apps/frontend" },
        { path: "./packages/shared" },
      ],
    },
    null,
    2
  );

  await writeFile(`${projectPath}/tsconfig.json`, content);
  logSuccess("Shared TypeScript configuration created");
}

async function generateSharedEslintConfig(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  if (!config.backend.eslint && !config.frontend.eslint) return;

  const content = `module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};`;

  await writeFile(`${projectPath}/.eslintrc.js`, content);
  logSuccess("Shared ESLint configuration created");
}

async function generateSharedPrettierConfig(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  if (!config.backend.prettier && !config.frontend.prettier) return;

  const content = JSON.stringify(
    {
      semi: false,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: "es5",
      printWidth: 80,
    },
    null,
    2
  );

  await writeFile(`${projectPath}/.prettierrc`, content);
  logSuccess("Shared Prettier configuration created");
}

async function generateGitIgnore(projectPath: string): Promise<void> {
  const content = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.lcov

# Next.js
.next/
out/

# Production
build/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo

# IDE
.idea/
.vscode/
*.swp
*.swo
*~
`;

  await writeFile(`${projectPath}/.gitignore`, content);
  logSuccess(".gitignore created");
}

async function generateReadme(projectPath: string, config: GeneratorConfig): Promise<void> {
  const content = `# ${config.projectName}

This project was generated by [Phos](https://github.com/yourusername/phos).

## Project Structure

\`\`\`
.
├── apps/
│   ├── backend/     # ${config.backend.framework} backend
│   └── frontend/    # ${config.frontend.framework} frontend
├── packages/
│   └── shared/      # Shared utilities and types
└── package.json     # Root package.json with workspace config
\`\`\`

## Getting Started

### Backend

\`\`\`bash
cd apps/backend
${config.backend.packageManager} install
${config.backend.packageManager} run dev
\`\`\`

### Frontend

\`\`\`bash
cd apps/frontend
${config.frontend.packageManager} install
${config.frontend.packageManager} run dev
\`\`\`

## Available Scripts

- \`${config.frontend.packageManager} run dev\` - Start development servers
- \`${config.frontend.packageManager} run build\` - Build for production
- \`${config.frontend.packageManager} run lint\` - Run ESLint
- \`${config.frontend.packageManager} run format\` - Format code with Prettier

## Tech Stack

### Backend
- Framework: ${config.backend.framework}
- Package Manager: ${config.backend.packageManager}
- TypeScript: ${config.backend.typescript ? "Yes" : "No"}
- ESLint: ${config.backend.eslint ? "Yes" : "No"}
- Prettier: ${config.backend.prettier ? "Yes" : "No"}

### Frontend
- Framework: ${config.frontend.framework}
- Package Manager: ${config.frontend.packageManager}
- TypeScript: ${config.frontend.typescript ? "Yes" : "No"}
- ESLint: ${config.frontend.eslint ? "Yes" : "No"}
- Prettier: ${config.frontend.prettier ? "Yes" : "No"}
- CSS Framework: ${config.frontend.cssFramework}
- UI Components: ${config.frontend.uiComponents}
- Testing: ${config.frontend.testing}
`;

  await writeFile(`${projectPath}/README.md`, content);
  logSuccess("README.md created");
}

async function generateSharedPackage(packagePath: string, config: GeneratorConfig): Promise<void> {
  const content = JSON.stringify(
    {
      name: "@phos/shared",
      version: "0.1.0",
      type: "module",
      main: "./dist/index.js",
      types: "./dist/index.d.ts",
      exports: {
        ".": {
          types: "./dist/index.d.ts",
          import: "./dist/index.js",
        },
      },
      scripts: {
        build: "tsc",
        dev: "tsc --watch",
      },
      devDependencies: {
        typescript: "^5.3.0",
      },
    },
    null,
    2
  );

  await writeFile(`${packagePath}/package.json`, content);

  const tsConfigContent = JSON.stringify(
    {
      extends: "../../tsconfig.json",
      compilerOptions: {
        composite: true,
        outDir: "./dist",
        rootDir: "./src",
      },
      include: ["src/**/*"],
    },
    null,
    2
  );

  await writeFile(`${packagePath}/tsconfig.json`, tsConfigContent);

  await createDirectory(`${packagePath}/src`);
  await writeFile(
    `${packagePath}/src/index.ts`,
    `export function hello(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n`
  );

  logSuccess("Shared package created");
}
