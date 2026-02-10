import {
  createDirectory,
  logSuccess,
  copyTemplate,
  getTemplatePath,
  type GeneratorConfig,
} from "@/utils/helpers.js";
import fs from "fs-extra";

async function removeFileIfExists(filePath: string): Promise<void> {
  try {
    if (await fs.pathExists(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (error) {}
}

export async function generateAstroFrontend(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  const srcPath = `${projectPath}/src`;
  await createDirectory(srcPath);

  const templatePath = getTemplatePath("frontend/astro");
  await copyTemplate(templatePath, projectPath, config as unknown as Record<string, unknown>);

  if (!config.frontend?.eslint) {
    await removeFileIfExists(`${projectPath}/eslint.config.js`);
  }

  if (!config.frontend?.prettier) {
    await removeFileIfExists(`${projectPath}/.prettierrc`);
  }

  logSuccess(`Astro frontend generated`);
}
