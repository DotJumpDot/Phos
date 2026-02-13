#!/usr/bin/env node

import { Command } from "commander";
import { intro, outro, select, text, confirm, multiselect, note } from "@clack/prompts";
import pc from "picocolors";
import { existsSync } from "fs";
import { resolve } from "path";
import { generateMonorepo } from "@/generators/monorepo.js";
import { generateSingle } from "@/generators/single.js";

const program = new Command();

program.name("phos").description("Full-stack interactive project generator CLI").version("1.0.0");

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

    let backendFramework: "elysia" | "fastapi" | "nestjs" | undefined;
    let frontendFramework: "astro" | "svelte" | "nextjs" | "vue" | undefined;
    let selectedFramework: "elysia" | "fastapi" | "nestjs" | "astro" | "svelte" | "nextjs" | "vue" | undefined;
    let packageManager: "npm" | "yarn" | "pnpm" | "bun" | "venv" | "pip";
    let frontendPackageManager;
    let useTypeScript: boolean;
    let addESLint: boolean;
    let addPrettier: boolean;
    let cssFramework: "none" | "tailwind" | "scss" | "css-modules" = "none";
    let uiComponents: 
      | "none"
      | "ant-design"
      | "shadcn"
      | "radix"
      | "mui"
      | "heroui"
      | "vuetify"
      | "element-plus"
      | "quasar"
      | "primevue"
      | "naive-ui"
      | "daisyui"
      | "fulldev-ui"
      | "shadcn-svelte"
      | "smui"
      | "headless-ui"
      | "agnostic-ui" = "none";
    let testing: "none" | "vitest" | "playwright" | "both" = "none";

    if (projectTypeTyped === "monorepo") {
      backendFramework = (await select({
        message: "Select Backend Framework",
        options: [
          { value: "elysia", label: "Elysia" },
          { value: "fastapi", label: "FastAPI" },
          { value: "nestjs", label: "NestJS" },
        ],
      })) as "elysia" | "fastapi" | "nestjs";

      if (typeof backendFramework !== "string") {
        outro(pc.red("Project creation cancelled"));
        process.exit(0);
      }

      packageManager = (await select({
        message:
          backendFramework === "fastapi"
            ? "Select Python Environment"
            : "Select Backend package manager",
        options:
          backendFramework === "fastapi"
            ? [
                { value: "venv", label: "venv (virtual environment)" },
                { value: "pip", label: "pip (system)" },
              ]
            : backendFramework === "elysia" || backendFramework === "nestjs"
              ? [
                  { value: "bun", label: "bun (Recommended)" },
                  { value: "npm", label: "npm" },
                  { value: "yarn", label: "yarn" },
                  { value: "pnpm", label: "pnpm" },
                ]
              : [
                  { value: "npm", label: "npm" },
                  { value: "yarn", label: "yarn" },
                  { value: "pnpm", label: "pnpm" },
                  { value: "bun", label: "bun" },
                ],
      })) as "npm" | "yarn" | "pnpm" | "bun" | "venv" | "pip";

      if (typeof packageManager !== "string") {
        outro(pc.red("Project creation cancelled"));
        process.exit(0);
      }

      useTypeScript =
        backendFramework === "fastapi"
          ? false
          : ((await confirm({
              message: "Backend: Use TypeScript?",
              initialValue: true,
            })) as boolean);

      if (typeof useTypeScript !== "boolean") {
        outro(pc.red("Project creation cancelled"));
        process.exit(0);
      }

      addESLint = (await confirm({
        message: "Backend: Add ESLint?",
        initialValue: true,
      })) as boolean;

      if (typeof addESLint !== "boolean") {
        outro(pc.red("Project creation cancelled"));
        process.exit(0);
      }

      addPrettier =
        backendFramework === "fastapi"
          ? false
          : ((await confirm({
              message: "Backend: Add Prettier?",
              initialValue: true,
            })) as boolean);

      if (typeof addPrettier !== "boolean") {
        outro(pc.red("Project creation cancelled"));
        process.exit(0);
      }

      frontendFramework = (await select({
        message: "Select Frontend Framework",
        options: [
          { value: "astro", label: "Astro" },
          { value: "svelte", label: "Svelte" },
          { value: "nextjs", label: "NextJS" },
          { value: "vue", label: "Vue" },
        ],
      })) as "astro" | "svelte" | "nextjs" | "vue";

      if (typeof frontendFramework !== "string") {
        outro(pc.red("Project creation cancelled"));
        process.exit(0);
      }

      frontendPackageManager = await select({
        message: "Select Frontend package manager",
        options:
          frontendFramework === "astro"
            ? [
                { value: "npm", label: "npm (Recommended)" },
                { value: "yarn", label: "yarn" },
                { value: "pnpm", label: "pnpm" },
                { value: "bun", label: "bun" },
              ]
            : frontendFramework === "svelte"
              ? [
                  { value: "pnpm", label: "pnpm (Recommended)" },
                  { value: "npm", label: "npm" },
                  { value: "yarn", label: "yarn" },
                  { value: "bun", label: "bun" },
                ]
              : frontendFramework === "nextjs"
                ? [
                    { value: "yarn", label: "yarn (Recommended)" },
                    { value: "npm", label: "npm" },
                    { value: "pnpm", label: "pnpm" },
                    { value: "bun", label: "bun" },
                  ]
                : frontendFramework === "vue"
                  ? [
                      { value: "npm", label: "npm (Recommended)" },
                      { value: "yarn", label: "yarn" },
                      { value: "pnpm", label: "pnpm" },
                      { value: "bun", label: "bun" },
                    ]
                  : [
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

      cssFramework = (await select({
        message: "Select CSS Framework",
        options: [
          { value: "none", label: "No" },
          { value: "tailwind", label: "Tailwind CSS" },
          { value: "scss", label: "SCSS" },
          { value: "css-modules", label: "CSS Modules" },
        ],
      })) as "none" | "tailwind" | "scss" | "css-modules";

      if (typeof cssFramework !== "string") {
        outro(pc.red("Project creation cancelled"));
        process.exit(0);
      }

      const uiComponentOptions = 
        frontendFramework === "nextjs"
          ? [
              { value: "none", label: "No" },
              { value: "ant-design", label: "Ant Design (Recommended)" },
              { value: "shadcn", label: "shadcn/ui" },
              { value: "radix", label: "Radix UI" },
              { value: "mui", label: "Material UI (MUI)" },
              { value: "heroui", label: "HeroUI" },
            ]
          : frontendFramework === "vue"
            ? [
                { value: "none", label: "No" },
                { value: "vuetify", label: "Vuetify (Recommended)" },
                { value: "element-plus", label: "Element Plus" },
                { value: "quasar", label: "Quasar" },
                { value: "primevue", label: "PrimeVue" },
                { value: "naive-ui", label: "Naive UI" },
              ]
            : frontendFramework === "astro"
              ? [
                  { value: "none", label: "No" },
                  { value: "daisyui", label: "daisyUI (Recommended)" },
                  { value: "fulldev-ui", label: "fulldev/ui" },
                  { value: "shadcn", label: "shadcn/ui" },
                ]
              : frontendFramework === "svelte"
                ? [
                    { value: "none", label: "No" },
                    { value: "shadcn-svelte", label: "shadcn-svelte (Recommended)" },
                    { value: "smui", label: "Svelte Material UI (SMUI)" },
                    { value: "headless-ui", label: "Svelte Headless UI" },
                    { value: "agnostic-ui", label: "Agnostic UI" },
                  ]
                : [
                    { value: "none", label: "No" },
                  ];

      uiComponents = (await select({
        message: "Add UI Components?",
        options: uiComponentOptions,
      })) as typeof uiComponents;

      if (typeof uiComponents !== "string") {
        outro(pc.red("Project creation cancelled"));
        process.exit(0);
      }

      testing = (await select({
        message: "Add Testing?",
        options: [
          { value: "none", label: "No" },
          { value: "vitest", label: "Vitest" },
          { value: "playwright", label: "Playwright" },
          { value: "both", label: "Vitest + Playwright" },
        ],
      })) as "none" | "vitest" | "playwright" | "both";

      if (typeof testing !== "string") {
        outro(pc.red("Project creation cancelled"));
        process.exit(0);
      }
    } else {
      selectedFramework = (await select({
        message: "Select What Framework u want to set up?",
        options: [
          { value: "elysia", label: "ElysiaJS" },
          { value: "fastapi", label: "FastAPI" },
          { value: "nestjs", label: "NestJS" },
          { value: "svelte", label: "Svelte" },
          { value: "nextjs", label: "NextJS" },
          { value: "astro", label: "Astro" },
          { value: "vue", label: "Vue" },
        ],
      })) as "elysia" | "fastapi" | "nestjs" | "svelte" | "nextjs" | "astro" | "vue";

      if (typeof selectedFramework !== "string") {
        outro(pc.red("Project creation cancelled"));
        process.exit(0);
      }

      if (selectedFramework === "elysia" || selectedFramework === "fastapi" || selectedFramework === "nestjs") {
        backendFramework = selectedFramework as "elysia" | "fastapi" | "nestjs";
        packageManager = (await select({
          message:
            selectedFramework === "fastapi"
              ? "Select Python Environment"
              : "Select Backend package manager",
          options:
            selectedFramework === "fastapi"
              ? [
                  { value: "venv", label: "venv (virtual environment)" },
                  { value: "pip", label: "pip (system)" },
                ]
              : selectedFramework === "elysia"
                ? [
                    { value: "bun", label: "bun (Recommended)" },
                    { value: "npm", label: "npm" },
                    { value: "yarn", label: "yarn" },
                    { value: "pnpm", label: "pnpm" },
                  ]
                : [
                    { value: "npm", label: "npm" },
                    { value: "yarn", label: "yarn" },
                    { value: "pnpm", label: "pnpm" },
                    { value: "bun", label: "bun" },
                  ],
        })) as "npm" | "yarn" | "pnpm" | "bun" | "venv" | "pip";

        if (typeof packageManager !== "string") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }

        useTypeScript =
          selectedFramework === "fastapi"
            ? false
            : ((await confirm({
                message: "Backend: Use TypeScript?",
                initialValue: true,
              })) as boolean);

        if (typeof useTypeScript !== "boolean") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }

        addESLint = (await confirm({
          message: "Backend: Add ESLint?",
          initialValue: true,
        })) as boolean;

        if (typeof addESLint !== "boolean") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }

        addPrettier =
          selectedFramework === "fastapi"
            ? false
            : ((await confirm({
                message: "Backend: Add Prettier?",
                initialValue: true,
              })) as boolean);

        if (typeof addPrettier !== "boolean") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }
      } else {
        frontendFramework = selectedFramework as "astro" | "svelte" | "nextjs" | "vue";
        packageManager = (await select({
          message: "Select package manager",
          options:
            selectedFramework === "astro"
              ? [
                  { value: "npm", label: "npm (Recommended)" },
                  { value: "yarn", label: "yarn" },
                  { value: "pnpm", label: "pnpm" },
                  { value: "bun", label: "bun" },
                ]
              : selectedFramework === "svelte"
                ? [
                    { value: "pnpm", label: "pnpm (Recommended)" },
                    { value: "npm", label: "npm" },
                    { value: "yarn", label: "yarn" },
                    { value: "bun", label: "bun" },
                  ]
                : selectedFramework === "nextjs"
                  ? [
                      { value: "yarn", label: "yarn (Recommended)" },
                      { value: "npm", label: "npm" },
                      { value: "pnpm", label: "pnpm" },
                      { value: "bun", label: "bun" },
                    ]
                : selectedFramework === "vue"
                  ? [
                      { value: "npm", label: "npm (Recommended)" },
                      { value: "yarn", label: "yarn" },
                      { value: "pnpm", label: "pnpm" },
                      { value: "bun", label: "bun" },
                    ]
                  : [
                      { value: "npm", label: "npm" },
                      { value: "yarn", label: "yarn" },
                      { value: "pnpm", label: "pnpm" },
                      { value: "bun", label: "bun" },
                    ],
        })) as "npm" | "yarn" | "pnpm" | "bun";

        if (typeof packageManager !== "string") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }

        useTypeScript = (await confirm({
          message: "Use TypeScript?",
          initialValue: true,
        })) as boolean;

        if (typeof useTypeScript !== "boolean") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }

        addESLint = (await confirm({
          message: "Add ESLint?",
          initialValue: true,
        })) as boolean;

        if (typeof addESLint !== "boolean") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }

        addPrettier = (await confirm({
          message: "Add Prettier?",
          initialValue: true,
        })) as boolean;

        if (typeof addPrettier !== "boolean") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }

        cssFramework = (await select({
          message: "Select CSS Framework",
          options: [
            { value: "none", label: "No" },
            { value: "tailwind", label: "Tailwind CSS" },
            { value: "scss", label: "SCSS" },
            { value: "css-modules", label: "CSS Modules" },
          ],
        })) as "none" | "tailwind" | "scss" | "css-modules";

        if (typeof cssFramework !== "string") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }

        const singleUiComponentOptions =
          selectedFramework === "nextjs"
            ? [
                { value: "none", label: "No" },
                { value: "ant-design", label: "Ant Design (Recommended)" },
                { value: "shadcn", label: "shadcn/ui" },
                { value: "radix", label: "Radix UI" },
                { value: "mui", label: "Material UI (MUI)" },
                { value: "heroui", label: "HeroUI" },
              ]
            : selectedFramework === "vue"
              ? [
                  { value: "none", label: "No" },
                  { value: "vuetify", label: "Vuetify (Recommended)" },
                  { value: "element-plus", label: "Element Plus" },
                  { value: "quasar", label: "Quasar" },
                  { value: "primevue", label: "PrimeVue" },
                  { value: "naive-ui", label: "Naive UI" },
                ]
              : selectedFramework === "astro"
                ? [
                    { value: "none", label: "No" },
                    { value: "daisyui", label: "daisyUI (Recommended)" },
                    { value: "fulldev-ui", label: "fulldev/ui" },
                    { value: "shadcn", label: "shadcn/ui" },
                  ]
                : selectedFramework === "svelte"
                  ? [
                      { value: "none", label: "No" },
                      { value: "shadcn-svelte", label: "shadcn-svelte (Recommended)" },
                      { value: "smui", label: "Svelte Material UI (SMUI)" },
                      { value: "headless-ui", label: "Svelte Headless UI" },
                      { value: "agnostic-ui", label: "Agnostic UI" },
                    ]
                  : [
                      { value: "none", label: "No" },
                    ];

        uiComponents = (await select({
          message: "Add UI Components?",
          options: singleUiComponentOptions,
        })) as typeof uiComponents;

        if (typeof uiComponents !== "string") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }

        testing = (await select({
          message: "Add Testing?",
          options: [
            { value: "none", label: "No" },
            { value: "vitest", label: "Vitest" },
            { value: "playwright", label: "Playwright" },
            { value: "both", label: "Vitest + Playwright" },
          ],
        })) as "none" | "vitest" | "playwright" | "both";

        if (typeof testing !== "string") {
          outro(pc.red("Project creation cancelled"));
          process.exit(0);
        }
      }
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

    const config = {
      projectName,
      projectType: projectTypeTyped,
      backend: backendFramework
        ? {
            framework: backendFramework,
            packageManager: packageManager as "npm" | "yarn" | "pnpm" | "bun" | "venv" | "pip",
            typescript: useTypeScript,
            eslint: addESLint,
            prettier: addPrettier,
          }
        : undefined,
      frontend: frontendFramework
        ? {
            framework: frontendFramework,
            packageManager: frontendPackageManager as "npm" | "yarn" | "pnpm" | "bun",
            typescript: useTypeScript,
            eslint: addESLint,
            prettier: addPrettier,
            cssFramework,
            uiComponents,
            testing,
          }
        : undefined,
      git: initGit,
      install: installDeps,
    };

    const summaryLines = [
      `${pc.cyan("Project:")} ${projectName}`,
      `${pc.cyan("Type:")} ${projectTypeTyped}`,
      projectTypeTyped === "monorepo"
        ? `${pc.cyan("Backend:")} ${backendFramework} (${packageManager})`
        : "",
      projectTypeTyped === "monorepo"
        ? `${pc.cyan("Frontend:")} ${frontendFramework} (${frontendPackageManager})`
        : "",
      projectTypeTyped === "single"
        ? `${pc.cyan("Framework:")} ${selectedFramework} (${packageManager})`
        : "",
      `${pc.cyan("TypeScript:")} ${useTypeScript ? "Yes" : "No"}`,
      `${pc.cyan("ESLint:")} ${addESLint ? "Yes" : "No"}`,
      `${pc.cyan("Prettier:")} ${addPrettier ? "Yes" : "No"}`,
      frontendFramework ? `${pc.cyan("CSS:")} ${cssFramework}` : "",
      frontendFramework ? `${pc.cyan("UI Components:")} ${uiComponents}` : "",
      frontendFramework ? `${pc.cyan("Testing:")} ${testing}` : "",
      `${pc.cyan("Git:")} ${initGit ? "Yes" : "No"}`,
      `${pc.cyan("Install:")} ${installDeps ? "Yes" : "No"}`,
    ].filter(Boolean);

    note(`${pc.bold("Configuration Summary")}\n\n` + summaryLines.join("\n"), "Configuration");

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
