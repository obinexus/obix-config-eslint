# obix-config-eslint

> Previous name: `@obinexusltd/obix-config-eslint` — OBIX packages are named without an npm scope since decision D-102 (2026-09-29); the package, its version and its exports are unchanged.

> ESLint v9 flat configuration for OBIX SDK packages — part of [OBIX](https://github.com/obinexus/obix).

Provides typed factory functions, ready-to-use flat config files, and environment-specific rule presets for linting OBIX SDK source code with ESLint 9 + typescript-eslint 8.

---

## Installation

Registered automatically as an npm workspace package:

```bash
# From monorepo root
npm install
```

To add it as a dependency in a consumer package:

```json
{
  "devDependencies": {
    "obix-config-eslint": "workspace:*"
  }
}
```

---

## Package Structure

```
packages/config/eslint/
├── flat.js                   ← Root flat config (./flat export)
├── base/
│   └── preset.js             ← Base TypeScript rules
├── development/
│   └── preset.js             ← Dev config (console allowed, any-type off)
├── production/
│   └── preset.js             ← Prod config (no-console error, strict types)
└── src/
    └── index.ts              ← TypeScript programmatic API (compiled to dist/)
```

---

## Requirements

This package targets **ESLint v9 flat config** only. The legacy `.eslintrc` format is not supported.

Your `eslint.config.js` (or `eslint.config.mjs`) must be present at the project root.

---

## Programmatic API

```ts
import {
  createBaseConfig,
  createDevConfig,
  createProdConfig,
  resolveConfig,
} from 'obix-config-eslint';

// Base — TypeScript-eslint recommended + OBIX core rules
const base = createBaseConfig();

// Development — relaxed console/any rules
const dev = createDevConfig({ typescript: true });

// Production — strict, no-console error, explicit return types
const prod = createProdConfig();

// Resolve by environment string
const config = resolveConfig('production', { files: ['src/**/*.ts'] });
```

### Factory Functions

| Function | Description |
|----------|-------------|
| `createBaseConfig(opts?)` | Base TypeScript rules, `no-console: warn` |
| `createDevConfig(opts?)` | Dev: `no-console: off`, `no-explicit-any: off` |
| `createProdConfig(opts?)` | Prod: `no-console: error`, `no-explicit-any: error`, strict types |
| `resolveConfig(env, opts?)` | Delegates by `'base' \| 'development' \| 'production'` |

All factories return `Array<Record<string, unknown>>` — a plain flat config array. Spread into your own `tseslint.config(...)` call or use directly.

### `ObixEsLintOptions`

```ts
interface ObixEsLintOptions {
  typescript?: boolean;        // default: true  — enable @typescript-eslint rules
  imports?: boolean;           // default: false — enable eslint-plugin-import
  unicorn?: boolean;           // default: false — enable eslint-plugin-unicorn
  files?: string[];            // default: ['**/*.ts', '**/*.tsx']
  ignores?: string[];          // default: ['dist/**', 'node_modules/**', '**/*.d.ts']
  rules?: Record<string, unknown>; // default: {} — merged on top of preset
}
```

### Static Descriptors

```ts
import {
  baseConfig,
  developmentConfig,
  productionConfig,
} from 'obix-config-eslint';
```

---

## Using Config Files Directly

### Root flat config (recommended)

Reference in your project's `eslint.config.js`:

```js
// eslint.config.js
import obixConfig from 'obix-config-eslint/flat';

export default [
  ...obixConfig,
  // your project-specific overrides
  {
    rules: {
      'no-console': 'off', // override for this project
    },
  },
];
```

Or with the `tseslint.config()` helper:

```js
import tseslint from 'typescript-eslint';
import obixConfig from 'obix-config-eslint/flat';

export default tseslint.config(
  ...obixConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
);
```

### Base config

```js
import base from 'obix-config-eslint/base';
export default [...base];
```

### Development config

```js
import devConfig from 'obix-config-eslint/development';
export default [...devConfig];
```

### Production config

```js
import prodConfig from 'obix-config-eslint/production';
export default [...prodConfig];
```

---

## Environment Rule Reference

| Rule | `base` | `development` | `production` |
|------|--------|---------------|--------------|
| `no-console` | `warn` | `off` | `error` |
| `no-debugger` | `error` | `warn` | `error` |
| `@typescript-eslint/no-explicit-any` | `warn` | `off` | `error` |
| `@typescript-eslint/no-unused-vars` | `error` | `error` | `error` |
| `@typescript-eslint/explicit-function-return-type` | — | — | `warn` |
| `@typescript-eslint/strict-boolean-expressions` | — | — | `warn` |
| `@typescript-eslint/consistent-type-imports` | `warn` | `off` | `error` |
| `@typescript-eslint/no-non-null-assertion` | `warn` | `warn` | `error` |
| `prefer-const` | `error` | `error` | `error` |
| `no-var` | `error` | `error` | `error` |
| `eqeqeq` | `error` | `error` | `error` |
| `curly` | `error` | `error` | `error` |

---

## Peer Dependencies

Required:

```json
{
  "devDependencies": {
    "@eslint/js": ">=9.0.0",
    "eslint": ">=9.0.0",
    "typescript-eslint": ">=8.0.0"
  }
}
```

Optional:

```json
{
  "devDependencies": {
    "eslint-plugin-import": "*",
    "eslint-plugin-unicorn": "*"
  }
}
```

---

## Comparison with Other OBIX Config Packages

| Feature | ESLint | TypeScript | Rollup | Webpack |
|---------|--------|------------|--------|---------|
| Primary role | Linting | Type checking | Library bundling | App bundling |
| TypeScript support | `typescript-eslint` | Native | `@rollup/plugin-typescript` | `ts-loader` |
| Output format | Report only | `.d.ts` + `.js` | ESM / CJS | Bundle |
| Best for | Code quality | Type safety | SDK packages | Browser apps |

Use ESLint **alongside** your build toolchain — not instead of it.

---

## Author

**Nnamdi Michael Okpala** — OBINexus &lt;okpalan@protonmail.com&gt;

Part of the [OBIX Heart/Soul UI/UX SDK](https://github.com/obinexus/obix); the source of this package is [github.com/obinexus/obix-config-eslint](https://github.com/obinexus/obix-config-eslint).

<!-- obix-release:begin — generated by scripts/release/prepare.mjs; edit the text above this line -->

## Installation

```bash
npm install obix-config-eslint
```

## API surface

- `obix-config-eslint` — 7 value exports: `baseConfig`, `createBaseConfig`, `createDevConfig`, `createProdConfig`, `developmentConfig`, `productionConfig`, `resolveConfig`
- `obix-config-eslint/base` — 1 value export: `default`
- `obix-config-eslint/development` — 1 value export: `default`
- `obix-config-eslint/production` — 1 value export: `default`
- `obix-config-eslint/flat` — 1 value export: `default`
- Type declarations: `./dist/index.d.ts` (and a declaration next to every JS entry point).

## Architecture role

`obix-config-eslint` is a **tool preset**: shared configuration for the tooling of an OBIX project (development-time only).

The architecture of OBIX — the package families and which packages are public API — is indexed in the umbrella: [docs/architecture.md](https://github.com/obinexus/obix/blob/main/docs/architecture.md).

## Package relationships

- Depends on (OBIX): no other OBIX package.
- Used by (OBIX): no other OBIX package.
- Third-party: `@eslint/js`, `eslint`, `typescript-eslint`.

## Testing

- 2 test files ship in the npm package (`test/`): the evidence of the package's contract, published so that its verification can be inspected — not runtime code (no entry point reaches them).
- **Standalone**: 2 of 2 — they read nothing outside the package.
- Run them with `npm test` (`node --test "test/*.test.mjs"`) in the OBIX monorepo, which provides the test tooling (Node's test runner, TypeScript) and the harness.

## Documentation

- [CHANGELOG.md](CHANGELOG.md)
- The OBIX architecture index: [obix/docs/architecture.md](https://github.com/obinexus/obix/blob/main/docs/architecture.md)

## Repository

- https://github.com/obinexus/obix-config-eslint — `git@github.com:obinexus/obix-config-eslint.git`
- Issues: https://github.com/obinexus/obix-config-eslint/issues
- The repository is a clean export of the package from the OBIX monorepo. Its lineage — the sources it was recovered from and its earlier names — is `PROVENANCE.json`, shipped in this package; the repository's copy also records the monorepo commit it was exported from.

## License

MIT — see [LICENSE](LICENSE).

<!-- obix-release:end -->
