import fs from "fs-extra";
import Handlebars from "handlebars";
import pc from "picocolors";
import { execSync } from "child_process";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

export function getTemplatePath(relativeTemplatePath: string): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // Phos/src/utils/helpers.ts -> Phos/
  // Phos/dist/utils/helpers.js -> Phos/
  const root = resolve(__dirname, "../../");
  return resolve(root, "src/templates", relativeTemplatePath);
}

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

Handlebars.registerHelper("or", function (...args) {
  return args.slice(0, -1).some(Boolean);
});

export interface GeneratorConfig {
  projectName: string;
  projectType: "monorepo" | "single";
  backend?: {
    framework: "elysia" | "fastapi";
    packageManager: "npm" | "yarn" | "pnpm" | "bun" | "venv" | "pip";
    typescript: boolean;
    eslint: boolean;
    prettier: boolean;
  };
  frontend?: {
    framework: "astro" | "svelte" | "nextjs";
    packageManager: "npm" | "yarn" | "pnpm" | "bun";
    typescript: boolean;
    eslint: boolean;
    prettier: boolean;
    cssFramework: "none" | "tailwind" | "scss" | "css-modules";
    uiComponents: "none" | "shadcn" | "radix";
    testing: "none" | "vitest" | "playwright" | "both";
  };
  git: boolean;
  install: boolean;
}

export async function createDirectory(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.ensureFile(filePath);
  await fs.writeFile(filePath, content, "utf-8");
}

export async function copyTemplate(
  templatePath: string,
  outputPath: string,
  data: Record<string, unknown>
): Promise<void> {
  const files = await fs.readdir(templatePath, { withFileTypes: true });

  const binaryExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".webp",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".eot",
    ".pdf",
    ".zip",
    ".tar",
    ".gz",
    ".7z",
    ".bin",
    ".exe",
    ".dll",
    ".so",
    ".dylib",
  ];

  for (const file of files) {
    const srcPath = join(templatePath, file.name);
    const destPath = join(outputPath, file.name);

    if (file.isDirectory()) {
      await createDirectory(destPath);
      await copyTemplate(srcPath, destPath, data);
    } else {
      const ext = file.name.toLowerCase();
      const isBinary = binaryExtensions.some((binExt) => ext.endsWith(binExt));

      if (isBinary) {
        await fs.copy(srcPath, destPath);
      } else {
        let content = await fs.readFile(srcPath, "utf-8");
        const template = Handlebars.compile(content);
        const rendered = template(data);
        await writeFile(destPath, rendered);
      }
    }
  }
}

export function getPackageManagerInstallCmd(packageManager: string): string {
  switch (packageManager) {
    case "npm":
      return "npm install";
    case "yarn":
      return "yarn";
    case "pnpm":
      return "pnpm install";
    case "bun":
      return "bun install";
    case "venv":
      return "source venv/bin/activate && pip install -r requirements.txt";
    case "pip":
      return "pip install -r requirements.txt";
    default:
      return "npm install";
  }
}

export function getPackageManagerRunCmd(packageManager: string, script: string): string {
  switch (packageManager) {
    case "npm":
      return `npm run ${script}`;
    case "yarn":
      return `yarn ${script}`;
    case "pnpm":
      return `pnpm run ${script}`;
    case "bun":
      return `bun run ${script}`;
    case "venv":
      return `source venv/bin/activate && python src/main.py`;
    case "pip":
      return `python src/main.py`;
    default:
      return `npm run ${script}`;
  }
}

export function logStep(message: string): void {
  console.log(pc.cyan(`  ${message}`));
}

export function logSuccess(message: string): void {
  console.log(pc.green(`  ✅ ${message}`));
}

export function logInfo(message: string): void {
  console.log(pc.blue(`  ℹ️  ${message}`));
}

export async function installDependencies(
  projectPath: string,
  packageManager: string
): Promise<void> {
  try {
    logStep(`Installing dependencies with ${packageManager}...`);
    execSync(getPackageManagerInstallCmd(packageManager), {
      cwd: projectPath,
      stdio: "inherit",
    });
    logSuccess("Dependencies installed");
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error}`);
  }
}

export async function initializeGit(projectPath: string): Promise<void> {
  try {
    execSync("git init", { cwd: projectPath, stdio: "inherit" });
    execSync("git add .", { cwd: projectPath, stdio: "inherit" });
    execSync('git commit -m "Initial commit from Phos"', {
      cwd: projectPath,
      stdio: "inherit",
    });
  } catch (error) {
    throw new Error(`Failed to initialize Git: ${error}`);
  }
}

export function getProjectPath(projectName: string): string {
  return resolve(process.cwd(), projectName);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function toPascalCase(str: string): string {
  return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (c) => c.toUpperCase());
}
