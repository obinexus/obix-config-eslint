// obix-config-eslint/development
// Development flat config — relaxes console/debugger and any-type rules.
// Extends the OBIX base config with developer-friendly overrides.
//
// Usage:
//   import devConfig from 'obix-config-eslint/development';
//   export default [...devConfig, ...yourOverrides];

import base from '../base/preset.js';

export default [
  ...base,

  // Development-specific rule relaxations
  {
    rules: {
      // Allow console during development
      'no-console': 'off',

      // Downgrade debugger from error to warning
      'no-debugger': 'warn',

      // Allow `any` during active development
      '@typescript-eslint/no-explicit-any': 'off',

      // Type imports not enforced during development
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
];
