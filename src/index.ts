// obix-config-eslint
// Programmatic ESLint configuration factory for OBIX SDK packages.
// NOTE: This module does NOT import eslint or typescript-eslint at compile time.
// All config objects are plain arrays matching ESLint v9 flat config shape.
// ESLint and typescript-eslint remain peerDependencies consumed at runtime.

// ─── Types ────────────────────────────────────────────────────────────────────

/** ESLint build environment */
export type ESLintEnv = 'base' | 'development' | 'production';

/** Options accepted by all factory functions */
export interface ObixEsLintOptions {
  /**
   * Enable TypeScript-specific rules via typescript-eslint.
   * Default: `true`
   */
  typescript?: boolean;
  /**
   * Enable import ordering rules (requires optional `eslint-plugin-import`).
   * Default: `false`
   */
  imports?: boolean;
  /**
   * Enable unicorn opinionated rules (requires optional `eslint-plugin-unicorn`).
   * Default: `false`
   */
  unicorn?: boolean;
  /**
   * Glob patterns for files to lint.
   * Default: `['**\/*.ts', '**\/*.tsx']`
   */
  files?: string[];
  /**
   * Glob patterns for files to ignore.
   * Default: `['dist/**', 'node_modules/**', '**\/*.d.ts']`
   */
  ignores?: string[];
  /**
   * Additional rule overrides merged on top of the environment preset.
   * Default: `{}`
   */
  rules?: Record<string, unknown>;
}

/** Fully-resolved options — all fields present */
export type ResolvedObixEsLintOptions = Required<ObixEsLintOptions>;

/** Static descriptor used by obix-cli to introspect the config package */
export interface ObixEsLintConfig {
  env: ESLintEnv;
  options: ResolvedObixEsLintOptions;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: ResolvedObixEsLintOptions = {
  typescript: true,
  imports: false,
  unicorn: false,
  files: ['**/*.ts', '**/*.tsx'],
  ignores: ['dist/**', 'node_modules/**', '**/*.d.ts'],
  rules: {},
};

function resolveOptions(overrides?: ObixEsLintOptions): ResolvedObixEsLintOptions {
  return {
    ...DEFAULT_OPTIONS,
    ...overrides,
    files: overrides?.files ?? DEFAULT_OPTIONS.files,
    ignores: overrides?.ignores ?? DEFAULT_OPTIONS.ignores,
    rules: { ...DEFAULT_OPTIONS.rules, ...overrides?.rules },
  };
}

// ─── Static descriptors (for obix-cli indexing) ───────────────────────────────

export const baseConfig: ObixEsLintConfig = {
  env: 'base',
  options: { ...DEFAULT_OPTIONS },
};

export const developmentConfig: ObixEsLintConfig = {
  env: 'development',
  options: {
    ...DEFAULT_OPTIONS,
    rules: {
      'no-console': 'off',
      'no-debugger': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
};

export const productionConfig: ObixEsLintConfig = {
  env: 'production',
  options: {
    ...DEFAULT_OPTIONS,
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
    },
  },
};

// ─── Internal helpers ──────────────────────────────────────────────────────────

/** Core TypeScript + best-practice rules for all environments */
function buildBaseRules(opts: ResolvedObixEsLintOptions): Record<string, unknown> {
  const rules: Record<string, unknown> = {
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
  };

  if (opts.typescript) {
    Object.assign(rules, {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
    });
  }

  return { ...rules, ...opts.rules };
}

/** Relaxed rule overrides for development */
function buildDevRules(opts: ResolvedObixEsLintOptions): Record<string, unknown> {
  return {
    ...buildBaseRules(opts),
    'no-console': 'off',
    'no-debugger': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    ...opts.rules,
  };
}

/** Strict rule overrides for production */
function buildProdRules(opts: ResolvedObixEsLintOptions): Record<string, unknown> {
  return {
    ...buildBaseRules(opts),
    'no-console': 'error',
    'no-debugger': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'warn',
    ...opts.rules,
  };
}

/** Build the files config object for a flat config entry */
function buildFilesEntry(
  opts: ResolvedObixEsLintOptions,
  rules: Record<string, unknown>,
): Record<string, unknown> {
  return { files: opts.files, rules };
}

/** Build the ignores config object for a flat config entry */
function buildIgnoresEntry(opts: ResolvedObixEsLintOptions): Record<string, unknown> {
  return { ignores: opts.ignores };
}

// ─── Factory functions ─────────────────────────────────────────────────────────

/**
 * Create a base ESLint flat config array.
 * Includes TypeScript-eslint recommended rules and OBIX base rules.
 * Suitable as a starting point — extends `typescript-eslint/recommended`.
 *
 * Returns a plain array shaped like an ESLint v9 flat config.
 * Consumer must spread with `@eslint/js` and `typescript-eslint` entries.
 */
export function createBaseConfig(opts?: ObixEsLintOptions): Array<Record<string, unknown>> {
  const o = resolveOptions(opts);
  return [
    buildFilesEntry(o, buildBaseRules(o)),
    buildIgnoresEntry(o),
  ];
}

/**
 * Create a development ESLint flat config array.
 * Relaxed rules: `no-console` off, `no-debugger` warn, `no-explicit-any` off.
 */
export function createDevConfig(opts?: ObixEsLintOptions): Array<Record<string, unknown>> {
  const o = resolveOptions(opts);
  return [
    buildFilesEntry(o, buildDevRules(o)),
    buildIgnoresEntry(o),
  ];
}

/**
 * Create a production ESLint flat config array.
 * Strict rules: `no-console` error, `no-debugger` error, `no-explicit-any` error,
 * `explicit-function-return-type` warn, `strict-boolean-expressions` warn.
 */
export function createProdConfig(opts?: ObixEsLintOptions): Array<Record<string, unknown>> {
  const o = resolveOptions(opts);
  return [
    buildFilesEntry(o, buildProdRules(o)),
    buildIgnoresEntry(o),
  ];
}

/**
 * Resolve an ESLint flat config array by environment name.
 * Delegates to `createBaseConfig`, `createDevConfig`, or `createProdConfig`.
 */
export function resolveConfig(
  env: ESLintEnv,
  opts?: ObixEsLintOptions,
): Array<Record<string, unknown>> {
  switch (env) {
    case 'production': return createProdConfig(opts);
    case 'development': return createDevConfig(opts);
    case 'base':
    default:           return createBaseConfig(opts);
  }
}
