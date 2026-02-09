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

export async function generateSingle(config: GeneratorConfig): Promise<void> {
  const projectPath = getProjectPath(config.projectName);

  logStep(`Creating single project at ${projectPath}`);
  await createDirectory(projectPath);

  await generateRootPackageJson(projectPath, config);
  await generateGitIgnore(projectPath);
  await generateReadme(projectPath, config);

  const srcPath = `${projectPath}/src`;
  await createDirectory(srcPath);

  switch (config.backend.framework) {
    case "elysia":
      await generateElysiaBackend(projectPath, config);
      break;
    case "fastapi":
      await generateFastAPIBackend(projectPath, config);
      break;
  }

  switch (config.frontend.framework) {
    case "astro":
      await generateAstroFrontend(projectPath, config);
      break;
    case "svelte":
      await generateSvelteFrontend(projectPath, config);
      break;
    case "nextjs":
      await generateNextJSFrontend(projectPath, config);
      break;
  }

  if (config.git) {
    await initializeGit(projectPath);
  }

  if (config.install) {
    await installDependencies(projectPath, config.frontend.packageManager);
  }

  logSuccess("Project created successfully");

  logInfo("\n📦 Next steps:");
  logInfo(`  cd ${config.projectName}`);
  logInfo(`  ${config.frontend.packageManager} install`);
  logInfo(`  ${config.frontend.packageManager} run dev`);
}

async function generateRootPackageJson(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  const packageManager = config.frontend.packageManager;

  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  if (config.frontend.framework === "astro") {
    dependencies["astro"] = "^4.0.0";
  } else if (config.frontend.framework === "svelte") {
    dependencies["@sveltejs/kit"] = "^2.0.0";
    dependencies["svelte"] = "^4.0.0";
  } else if (config.frontend.framework === "nextjs") {
    dependencies["next"] = "^14.0.0";
    dependencies["react"] = "^18.0.0";
    dependencies["react-dom"] = "^18.0.0";
  }

  if (config.backend.framework === "elysia") {
    dependencies["elysia"] = "^1.0.0";
    dependencies["@elysiajs/cors"] = "^1.0.0";
  }

  if (config.frontend.cssFramework === "tailwind") {
    dependencies["tailwindcss"] = "^3.4.0";
    dependencies["postcss"] = "^8.4.0";
    dependencies["autoprefixer"] = "^10.4.0";
  }

  if (config.frontend.uiComponents === "shadcn") {
    dependencies["class-variance-authority"] = "^0.7.0";
    dependencies["clsx"] = "^2.1.0";
    dependencies["tailwind-merge"] = "^2.2.0";
  } else if (config.frontend.uiComponents === "radix") {
    dependencies["@radix-ui/react-slot"] = "^1.0.0";
  }

  if (config.frontend.testing === "vitest" || config.frontend.testing === "both") {
    devDependencies["vitest"] = "^1.0.0";
    devDependencies["@vitest/ui"] = "^1.0.0";
  }

  if (config.frontend.testing === "playwright" || config.frontend.testing === "both") {
    devDependencies["@playwright/test"] = "^1.40.0";
  }

  if (config.frontend.eslint) {
    devDependencies["eslint"] = "^8.57.0";
    devDependencies["@typescript-eslint/parser"] = "^7.0.0";
    devDependencies["@typescript-eslint/eslint-plugin"] = "^7.0.0";
  }

  if (config.frontend.prettier) {
    devDependencies["prettier"] = "^3.2.0";
  }

  if (config.frontend.typescript) {
    devDependencies["typescript"] = "^5.3.0";
  }

  const scripts: Record<string, string> = {
    dev: "astro dev",
    build: "astro build",
    preview: "astro preview",
  };

  if (config.frontend.framework === "svelte") {
    scripts.dev = "vite dev";
    scripts.build = "vite build";
    scripts.preview = "vite preview";
  } else if (config.frontend.framework === "nextjs") {
    scripts.dev = "next dev";
    scripts.build = "next build";
    scripts.start = "next start";
    scripts.lint = "next lint";
  }

  if (config.frontend.testing === "vitest" || config.frontend.testing === "both") {
    scripts.test = "vitest";
  }

  if (config.frontend.testing === "playwright" || config.frontend.testing === "both") {
    scripts["test:e2e"] = "playwright test";
  }

  if (config.frontend.eslint) {
    scripts.lint = "eslint . --ext .js,.jsx,.ts,.tsx,.svelte";
  }

  if (config.frontend.prettier) {
    scripts.format = 'prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"';
  }

  const content = JSON.stringify(
    {
      name: config.projectName,
      version: "0.1.0",
      type: "module",
      scripts,
      dependencies,
      devDependencies,
    },
    null,
    2
  );

  await writeFile(`${projectPath}/package.json`, content);
  logSuccess("package.json created");
}

async function generateGitIgnore(projectPath: string): Promise<void> {
  const content = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.lcov
playwright-report/
playwright/.cache/

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
pnpm-debug.log*

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

# Astro
.astro/

# Svelte
.svelte-kit/

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

## Getting Started

\`\`\`bash
${config.frontend.packageManager} install
${config.frontend.packageManager} run dev
\`\`\`

## Available Scripts

- \`${config.frontend.packageManager} run dev\` - Start development server
- \`${config.frontend.packageManager} run build\` - Build for production
- \`${config.frontend.packageManager} run preview\` - Preview production build
${config.frontend.eslint ? `- \`${config.frontend.packageManager} run lint\` - Run ESLint\n` : ""}${config.frontend.prettier ? `- \`${config.frontend.packageManager} run format\` - Format code with Prettier\n` : ""}${config.frontend.testing !== "none" ? `- \`${config.frontend.packageManager} run test\` - Run tests\n` : ""}

## Tech Stack

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
