import { createDirectory, writeFile, logSuccess, type GeneratorConfig } from "@/utils/helpers.js";

export async function generateElysiaBackend(
  projectPath: string,
  config: GeneratorConfig
): Promise<void> {
  const srcPath = `${projectPath}/src`;
  await createDirectory(srcPath);

  const indexExtension = config.backend.typescript ? "ts" : "js";
  const importType = config.backend.typescript ? "import" : "require";

  await generateIndexFile(srcPath, indexExtension, importType, config);
  await generatePackageJson(projectPath, config);
  await generateTsConfig(projectPath, config);
  await generateBunConfig(projectPath, config);

  if (config.backend.eslint) {
    await generateEslintConfig(projectPath, config);
  }

  if (config.backend.prettier) {
    await generatePrettierConfig(projectPath, config);
  }

  logSuccess(`Elysia backend generated`);
}

async function generateIndexFile(
  srcPath: string,
  extension: string,
  importType: string,
  config: GeneratorConfig
): Promise<void> {
  const typeAnnotations = config.backend.typescript ? ": string" : "";
  const returnType = config.backend.typescript ? ": Response" : "";

  const content = `import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const app = new Elysia()
  .use(cors())
  .get('/', () => 'Hello from Phos! 🚀')
  .get('/api/hello', () => ({
    message: 'Hello from the API!',
    timestamp: new Date().toISOString(),
  }))
  .listen(3000);

console.log(\`🦊 Elysia is running at http://\${app.server?.hostname}:\${app.server?.port}\`);
`;

  await writeFile(`${srcPath}/index.${extension}`, content);
}

async function generatePackageJson(projectPath: string, config: GeneratorConfig): Promise<void> {
  const dependencies: Record<string, string> = {
    elysia: "^1.0.0",
    "@elysiajs/cors": "^1.0.0",
  };

  const devDependencies: Record<string, string> = {};

  if (config.backend.eslint) {
    devDependencies["eslint"] = "^8.57.0";
    devDependencies["@typescript-eslint/parser"] = "^7.0.0";
    devDependencies["@typescript-eslint/eslint-plugin"] = "^7.0.0";
  }

  if (config.backend.prettier) {
    devDependencies["prettier"] = "^3.2.0";
  }

  if (config.backend.typescript) {
    devDependencies["typescript"] = "^5.3.0";
  }

  const content = JSON.stringify(
    {
      name: config.projectType === "monorepo" ? "backend" : config.projectName,
      version: "0.1.0",
      type: "module",
      scripts: {
        dev: "bun run src/index.ts",
        start: "bun run src/index.ts",
        ...(config.backend.eslint ? { lint: "eslint src --ext .ts" } : {}),
        ...(config.backend.prettier ? { format: 'prettier --write "src/**/*.ts"' } : {}),
      },
      dependencies,
      devDependencies,
    },
    null,
    2
  );

  await writeFile(`${projectPath}/package.json`, content);
}

async function generateTsConfig(projectPath: string, config: GeneratorConfig): Promise<void> {
  if (!config.backend.typescript) return;

  const content = JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ES2022",
        lib: ["ES2022"],
        moduleResolution: "bundler",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
      },
      include: ["src/**/*"],
    },
    null,
    2
  );

  await writeFile(`${projectPath}/tsconfig.json`, content);
}

async function generateBunConfig(projectPath: string, config: GeneratorConfig): Promise<void> {
  const content = JSON.stringify(
    {
      name: config.projectType === "monorepo" ? "backend" : config.projectName,
      scripts: {
        dev: "bun run src/index.ts",
        start: "bun run src/index.ts",
      },
    },
    null,
    2
  );

  await writeFile(`${projectPath}/bunfig.toml`, content);
}

async function generateEslintConfig(projectPath: string, config: GeneratorConfig): Promise<void> {
  if (!config.backend.eslint) return;

  const content = `module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};`;

  await writeFile(`${projectPath}/.eslintrc.js`, content);
}

async function generatePrettierConfig(projectPath: string, config: GeneratorConfig): Promise<void> {
  if (!config.backend.prettier) return;

  const content = JSON.stringify(
    {
      semi: false,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: "es5",
      printWidth: 80,
    },
    null,
    2
  );

  await writeFile(`${projectPath}/.prettierrc`, content);
}
