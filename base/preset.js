// obix-config-eslint/base
// Base flat config — TypeScript-eslint recommended + OBIX core rules.
// Environment-neutral: suitable as a common foundation for dev and prod configs.
//
// Usage:
//   import base from 'obix-config-eslint/base';
//   export default [...base, { rules: { 'no-console': 'off' } }];

import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // ESLint recommended baseline
  js.configs.recommended,

  // typescript-eslint recommended rules (flat config array)
  ...tseslint.configs.recommended,

  // OBIX base TypeScript rules
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
