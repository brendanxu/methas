const { createConfig } = require('@eslint/eslintrc');

/** @type {import('eslint').Linter.Config} */
module.exports = createConfig({
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@next/next/no-img-element': 'warn',
  },
  ignorePatterns: [
    '.next/',
    'node_modules/',
    'out/',
    'public/',
  ],
});