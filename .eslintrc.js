/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'no-unused-vars': 'off',
    '@next/next/no-img-element': 'warn',
  },
  ignorePatterns: [
    '.next/',
    'node_modules/',
    'out/',
    'public/',
  ],
};