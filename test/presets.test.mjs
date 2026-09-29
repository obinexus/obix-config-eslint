import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { importModule, packageDir, presetExports } from './support/preset-contract.mjs';

const dir = packageDir(import.meta.url);
const require = createRequire(import.meta.url);
const { ESLint } = require('eslint');
const exportsMap = Object.fromEntries(presetExports(dir));

test('base, development, production and flat presets load as flat-config arrays', async () => {
  for (const sub of ['./base', './development', './production', './flat']) {
    const { default: cfg } = await importModule(exportsMap[sub]);
    assert.ok(Array.isArray(cfg) && cfg.length > 0, sub);
    assert.ok(cfg.every((c) => c && typeof c === 'object'), `${sub}: every entry is a config object`);
  }
});

test('ESLint accepts the base preset and resolves rules for a TypeScript file', async () => {
  const { default: base } = await importModule(exportsMap['./base']);
  const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: base, cwd: dir });
  const resolved = await eslint.calculateConfigForFile(path.join(dir, 'sample.ts'));
  assert.ok(resolved && Object.keys(resolved.rules ?? {}).length > 0, 'rules resolved for sample.ts');
  // The type-aware parser only lints files that belong to a tsconfig project, so lint the package's own real source file.
  const [result] = await eslint.lintFiles([path.join(dir, 'src', 'index.ts')]);
  assert.equal(result.fatalErrorCount, 0, `no fatal (parse/config) errors linting the package's own TypeScript: ${JSON.stringify(result.messages.filter((m) => m.fatal))}`);
});

test('programmatic factories return flat-config arrays', async () => {
  const api = await importModule(path.join(dir, 'dist', 'index.js'));
  for (const make of [api.createBaseConfig, api.createDevConfig, api.createProdConfig, api.resolveConfig]) assert.ok(Array.isArray(make()));
});

test('regression: a consumer eslint.config.js that also reads tseslint.configs can spread the base preset (fresh process, no tsconfigRootDir error)', async () => {
  // typescript-eslint registers the directory of every file named eslint.config.* that reads tseslint.configs.* as a candidate
  // tsconfigRootDir; two candidates make every .ts file fail to parse. The presets must therefore not carry that file name.
  const { spawnSync } = await import('node:child_process');
  const fs = await import('node:fs');
  const { pathToFileURL } = await import('node:url');
  const tmp = path.join(dir, '.obix-tmp', 'consumer');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const preset = pathToFileURL(exportsMap['./base']).href;
  fs.writeFileSync(path.join(tmp, 'eslint.config.js'), `import tseslint from 'typescript-eslint';\nimport base from '${preset}';\nexport default [...tseslint.configs.recommended, ...base];\n`);
  fs.writeFileSync(path.join(tmp, 'sample.ts'), 'export const x: number = 1;\n');
  fs.writeFileSync(path.join(tmp, 'run.mjs'), `import { ESLint } from 'eslint';\nconst e = new ESLint({ cwd: process.cwd() });\nconst [r] = await e.lintFiles(['sample.ts']);\nconsole.log(JSON.stringify(r.messages.filter((m) => m.fatal).map((m) => m.message)));\n`);
  const run = spawnSync(process.execPath, ['run.mjs'], { cwd: tmp, encoding: 'utf8' });
  fs.rmSync(path.join(dir, '.obix-tmp'), { recursive: true, force: true });
  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(JSON.parse(run.stdout), []);
});
