import {
  createDirectory,
  logSuccess,
  copyTemplate,
  type GeneratorConfig,
} from "@/utils/helpers.js";
import { resolve } from "path";
import fs from "fs-extra";

async function removeFileIfExists(filePath: string): Promise<void> {
  try {
    if (await fs.pathExists(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (error) {}
}

export async function generateElysiaBackend(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  const srcPath = `${projectPath}/src`;
  await createDirectory(srcPath);

  const templatePath = resolve(process.cwd(), "src/templates/backend/elysia");
  await copyTemplate(templatePath, projectPath, config as unknown as Record<string, unknown>);

  if (!config.backend.eslint) {
    await removeFileIfExists(`${projectPath}/.eslintrc.js`);
  }

  if (!config.backend.prettier) {
    await removeFileIfExists(`${projectPath}/.prettierrc`);
  }

  logSuccess(`Elysia backend generated`);
}
