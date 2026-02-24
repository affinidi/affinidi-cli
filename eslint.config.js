import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import mochaPlugin from 'eslint-plugin-mocha'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: ['**/*.js', '**/*.d.ts', 'node_modules/**', 'coverage/**'],
  },
  // Disable formatting-related ESLint rules that would conflict with Prettier.
  prettierConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig-test.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      mocha: mochaPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'mocha/no-mocha-arrows': 0,
      'mocha/no-setup-in-describe': 0,
      'mocha/max-top-level-suites': ['warn', { limit: 2 }],
      'prettier/prettier': ['error'],

      '@typescript-eslint/no-require-imports': ['error'],

      'no-duplicate-imports': ['error'],
      'no-shadow': ['off'],
      '@typescript-eslint/no-shadow': ['error'],
      'key-spacing': ['error'],
      'no-multiple-empty-lines': ['error'],
      '@typescript-eslint/no-floating-promises': ['error'],
      'no-return-await': ['off'],
      '@typescript-eslint/return-await': ['error'],
      'no-trailing-spaces': ['error'],
      'dot-notation': ['error'],
      'no-bitwise': ['error'],
    },
  },
]
