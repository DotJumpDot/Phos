import {
  createDirectory,
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

export async function generateVueFrontend(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  const srcPath = `${projectPath}/src`;
  await createDirectory(srcPath);

  const templatePath = getTemplatePath("frontend/vue");
  await copyTemplate(templatePath, projectPath, config as unknown as Record<string, unknown>);

  if (!config.frontend?.eslint) {
    await removeFileIfExists(`${projectPath}/eslint.config.ts`);
  }

  if (!config.frontend?.prettier) {
    await removeFileIfExists(`${projectPath}/.prettierrc.json`);
  }
}
