import {
  createDirectory,
  logSuccess,
  logInfo,
  copyTemplate,
  capitalize,
  type GeneratorConfig,
  getPackageManagerInstallCmd,
  getPackageManagerRunCmd,
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

async function copyAndRenameFile(srcPath: string, destPath: string): Promise<void> {
  const content = await fs.readFile(srcPath, "utf-8");
  await fs.writeFile(destPath, content, "utf-8");
}

export async function generateFastAPIBackend(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  const srcPath = `${projectPath}/src`;
  await createDirectory(srcPath);

  const templatePath = resolve(process.cwd(), "src/templates/backend/fastapi");
  const backendName = `${capitalize(config.projectName)}_Backend`;

  const templateData = {
    ...config,
    backendName,
  };

  await copyTemplate(templatePath, projectPath, templateData as unknown as Record<string, unknown>);

  if (!config.backend?.eslint) {
    await removeFileIfExists(`${projectPath}/.pylintrc`);
  }

  if (config.backend?.prettier) {
    await copyAndRenameFile(
      `${templatePath}/pyproject_prettier.toml`,
      `${projectPath}/pyproject.toml`
    );
  } else {
    await removeFileIfExists(`${projectPath}/pyproject_prettier.toml`);
  }

  const installCmd = getPackageManagerInstallCmd(config.backend?.packageManager || "pip");
  const runCmd = getPackageManagerRunCmd(config.backend?.packageManager || "pip", "dev");

  logSuccess(`FastAPI backend generated`);
  logInfo("");
  logInfo(`📦 Next steps:`);
  logInfo(`  cd ${backendName}`);
  if (config.backend?.packageManager === "venv") {
    logInfo(`  chmod +x setup.sh`);
    logInfo(`  ./setup.sh`);
  } else {
    logInfo(`  ${installCmd}`);
    logInfo(`  ${runCmd}`);
  }
}
