import {
  createDirectory,
  copyTemplate,
  type GeneratorConfig,
  capitalize,
  getTemplatePath,
} from "@/utils/helpers.js";
import fs from "fs-extra";

async function removeFileIfExists(filePath: string): Promise<void> {
  try {
    if (await fs.pathExists(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (error) {}
}

export async function generateNestJSBackend(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  const srcPath = `${projectPath}/src`;
  await createDirectory(srcPath);

  const templatePath = getTemplatePath("backend/nestjs");
  const backendName = `${capitalize(config.projectName)}_Backend`;

  const templateData = {
    ...config,
    backendName,
  };

  await copyTemplate(templatePath, projectPath, templateData as unknown as Record<string, unknown>);

  if (!config.backend?.eslint) {
    await removeFileIfExists(`${projectPath}/.eslintrc.js`);
  }

  if (!config.backend?.prettier) {
    await removeFileIfExists(`${projectPath}/.prettierrc`);
  }
}
