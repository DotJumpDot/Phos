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

async function copyAndRenameFile(
  srcPath: string,
  destPath: string
): Promise<void> {
  const content = await fs.readFile(srcPath, 'utf-8');
  await fs.writeFile(destPath, content, 'utf-8');
}

export async function generateFastAPIBackend(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  const srcPath = `${projectPath}/src`;
  await createDirectory(srcPath);

  const templatePath = resolve(process.cwd(), "src/templates/backend/fastapi");
  await copyTemplate(templatePath, projectPath, config as unknown as Record<string, unknown>);

  if (!config.backend.eslint) {
    await removeFileIfExists(`${projectPath}/.pylintrc`);
  }

  if (config.backend.prettier) {
    await copyAndRenameFile(
      `${templatePath}/pyproject_prettier.toml`,
      `${projectPath}/pyproject.toml`
    );
  } else {
    await removeFileIfExists(`${projectPath}/pyproject_prettier.toml`);
  }

  logSuccess(`FastAPI backend generated`);
}
