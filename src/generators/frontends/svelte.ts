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

export async function generateSvelteFrontend(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  const srcPath = `${projectPath}/src`;
  await createDirectory(srcPath);

  const templatePath = resolve(process.cwd(), "src/templates/frontend/svelte");
  await copyTemplate(templatePath, projectPath, config as unknown as Record<string, unknown>);

  if (!config.frontend?.eslint) {
    await removeFileIfExists(`${projectPath}/eslint.config.js`);
  }

  if (!config.frontend?.prettier) {
    await removeFileIfExists(`${projectPath}/.prettierrc`);
    await removeFileIfExists(`${projectPath}/.prettierignore`);
  }

  logSuccess(`Svelte frontend generated`);
}
