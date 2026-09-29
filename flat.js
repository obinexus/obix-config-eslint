// obix-config-eslint — root flat config (./flat export)
// Ready-to-use ESLint v9 flat config with OBIX TypeScript defaults.
//
// Usage:
//   // eslint.config.js in consumer package
//   import obixConfig from 'obix-config-eslint/flat';
//   export default [...obixConfig, ...yourOverrides];
//
// Or with tseslint.config():
//   import tseslint from 'typescript-eslint';
//   import obixConfig from 'obix-config-eslint/flat';
//   export default tseslint.config(...obixConfig, { rules: { ... } });

import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // ESLint recommended baseline
  js.configs.recommended,

  // typescript-eslint recommended rules (flat config array)
  ...tseslint.configs.recommended,

  // OBIX standard TypeScript rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Best practices
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
    },
  },

  // Global ignores
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.d.ts'],
  },
);
