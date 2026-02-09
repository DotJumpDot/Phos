#!/usr/bin/env node

import { Command } from "commander";
import { intro, outro, select, text, confirm, multiselect, note } from "@clack/prompts";
import pc from "picocolors";
import { existsSync } from "fs";
import { resolve } from "path";
import { generateMonorepo } from "@/generators/monorepo.js";
import { generateSingle } from "@/generators/single.js";

const program = new Command();

program.name("phos").description("Full-stack interactive project generator CLI").version("0.1.0");

program
  .command("create")
  .description("Create a new project")
  .action(async () => {
    intro(pc.bgCyan(pc.black(" Phos ")));

    const projectName = await text({
      message: "Project name",
      placeholder: "my-awesome-app",
      validate: (value) => {
        if (!value) return "Project name is required";
        if (!/^[a-z0-9-]+$/.test(value)) {
          return "Project name must be lowercase letters, numbers, and hyphens only";
        }
        const projectPath = resolve(process.cwd(), value);
        if (existsSync(projectPath)) {
          return `Directory "${value}" already exists`;
        }
        return undefined;
      },
    });

    if (typeof projectName !== "string" || !projectName) {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const projectType = await select({
      message: "Select project type",
      options: [
        { value: "monorepo", label: "Monorepo" },
        { value: "single", label: "Single repo" },
      ],
    });

    if (typeof projectType !== "string") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const projectTypeTyped = projectType as "monorepo" | "single";

    const backendFramework = await select({
      message: "Select Backend Framework",
      options: [
        { value: "elysia", label: "Elysia" },
        { value: "fastapi", label: "FastAPI" },
      ],
    });

    if (typeof backendFramework !== "string") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const backendPackageManager = await select({
      message: "Select Backend package manager",
      options: [
        { value: "npm", label: "npm" },
        { value: "yarn", label: "yarn" },
        { value: "pnpm", label: "pnpm" },
        { value: "bun", label: "bun" },
      ],
    });

    if (typeof backendPackageManager !== "string") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const backendUseTypeScript = await confirm({
      message: "Backend: Use TypeScript?",
      initialValue: true,
    });

    if (typeof backendUseTypeScript !== "boolean") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const backendAddESLint = await confirm({
      message: "Backend: Add ESLint?",
      initialValue: true,
    });

    if (typeof backendAddESLint !== "boolean") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const backendAddPrettier = await confirm({
      message: "Backend: Add Prettier?",
      initialValue: true,
    });

    if (typeof backendAddPrettier !== "boolean") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const frontendFramework = await select({
      message: "Select Frontend Framework",
      options: [
        { value: "astro", label: "Astro" },
        { value: "svelte", label: "Svelte" },
        { value: "nextjs", label: "NextJS" },
      ],
    });

    if (typeof frontendFramework !== "string") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const frontendPackageManager = await select({
      message: "Select Frontend package manager",
      options: [
        { value: "npm", label: "npm" },
        { value: "yarn", label: "yarn" },
        { value: "pnpm", label: "pnpm" },
        { value: "bun", label: "bun" },
      ],
    });

    if (typeof frontendPackageManager !== "string") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const frontendUseTypeScript = await confirm({
      message: "Frontend: Use TypeScript?",
      initialValue: true,
    });

    if (typeof frontendUseTypeScript !== "boolean") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const frontendAddESLint = await confirm({
      message: "Frontend: Add ESLint?",
      initialValue: true,
    });

    if (typeof frontendAddESLint !== "boolean") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const frontendAddPrettier = await confirm({
      message: "Frontend: Add Prettier?",
      initialValue: true,
    });

    if (typeof frontendAddPrettier !== "boolean") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const cssFramework = await select({
      message: "Select CSS Framework",
      options: [
        { value: "none", label: "No" },
        { value: "tailwind", label: "Tailwind CSS" },
        { value: "scss", label: "SCSS" },
        { value: "css-modules", label: "CSS Modules" },
      ],
    });

    if (typeof cssFramework !== "string") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const uiComponents = await select({
      message: "Add UI Components?",
      options: [
        { value: "none", label: "No" },
        { value: "shadcn", label: "shadcn/ui" },
        { value: "radix", label: "Radix UI" },
      ],
    });

    if (typeof uiComponents !== "string") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const testing = await select({
      message: "Add Testing?",
      options: [
        { value: "none", label: "No" },
        { value: "vitest", label: "Vitest" },
        { value: "playwright", label: "Playwright" },
        { value: "both", label: "Vitest + Playwright" },
      ],
    });

    if (typeof testing !== "string") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const initGit = await confirm({
      message: "Initialize Git?",
      initialValue: false,
    });

    if (typeof initGit !== "boolean") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const installDeps = await confirm({
      message: "Install dependencies?",
      initialValue: false,
    });

    if (typeof installDeps !== "boolean") {
      outro(pc.red("Project creation cancelled"));
      process.exit(0);
    }

    const backendFrameworkTyped = backendFramework as "elysia" | "fastapi";
    const backendPackageManagerTyped = backendPackageManager as "npm" | "yarn" | "pnpm" | "bun";
    const frontendFrameworkTyped = frontendFramework as "astro" | "svelte" | "nextjs";
    const frontendPackageManagerTyped = frontendPackageManager as "npm" | "yarn" | "pnpm" | "bun";
    const cssFrameworkTyped = cssFramework as "none" | "tailwind" | "scss" | "css-modules";
    const uiComponentsTyped = uiComponents as "none" | "shadcn" | "radix";
    const testingTyped = testing as "none" | "vitest" | "playwright" | "both";

    const config = {
      projectName,
      projectType: projectTypeTyped,
      backend: {
        framework: backendFrameworkTyped,
        packageManager: backendPackageManagerTyped,
        typescript: backendUseTypeScript,
        eslint: backendAddESLint,
        prettier: backendAddPrettier,
      },
      frontend: {
        framework: frontendFrameworkTyped,
        packageManager: frontendPackageManagerTyped,
        typescript: frontendUseTypeScript,
        eslint: frontendAddESLint,
        prettier: frontendAddPrettier,
        cssFramework: cssFrameworkTyped,
        uiComponents: uiComponentsTyped,
        testing: testingTyped,
      },
      git: initGit,
      install: installDeps,
    };

    note(
      `${pc.bold("Configuration Summary")}\n\n` +
        `${pc.cyan("Project:")} ${projectName}\n` +
        `${pc.cyan("Type:")} ${projectTypeTyped}\n` +
        `${pc.cyan("Backend:")} ${backendFrameworkTyped} (${backendPackageManagerTyped})\n` +
        `${pc.cyan("Frontend:")} ${frontendFrameworkTyped} (${frontendPackageManagerTyped})\n` +
        `${pc.cyan("TypeScript:")} ${backendUseTypeScript || frontendUseTypeScript ? "Yes" : "No"}\n` +
        `${pc.cyan("CSS:")} ${cssFrameworkTyped}\n` +
        `${pc.cyan("UI Components:")} ${uiComponentsTyped}\n` +
        `${pc.cyan("Testing:")} ${testingTyped}\n` +
        `${pc.cyan("Git:")} ${initGit ? "Yes" : "No"}\n` +
        `${pc.cyan("Install:")} ${installDeps ? "Yes" : "No"}`,
      "Configuration"
    );

    try {
      if (projectTypeTyped === "monorepo") {
        await generateMonorepo(config);
      } else {
        await generateSingle(config);
      }
      outro(pc.green("✨ Project created successfully!"));
    } catch (error) {
      outro(pc.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

program.parse();
