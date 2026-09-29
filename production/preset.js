// obix-config-eslint/production
// Production flat config — enforces maximum strictness for release builds.
// Extends the OBIX base config with production-hardened overrides.
//
// Usage:
//   import prodConfig from 'obix-config-eslint/production';
//   export default [...prodConfig, ...yourOverrides];

import base from '../base/preset.js';

export default [
  ...base,

  // Production-specific strict overrides
  {
    rules: {
      // No console output in production code
      'no-console': 'error',

      // No leftover debugger statements
      'no-debugger': 'error',

      // Disallow `any` — forces explicit typing
      '@typescript-eslint/no-explicit-any': 'error',

      // Require explicit return types on exported functions
      '@typescript-eslint/explicit-function-return-type': 'warn',

      // Prevent unintended boolean coercions
      '@typescript-eslint/strict-boolean-expressions': 'warn',

      // Enforce type imports for tree-shaking
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // No non-null assertions in production
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
];
