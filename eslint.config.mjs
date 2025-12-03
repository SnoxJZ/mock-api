
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

const commonTsRules = {
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
};

export default defineConfig([
    { ignores: ['.next', 'out', 'node_modules', 'coverage', 'dist', 'build'] },

    ...tseslint.configs.recommended,

    {
      plugins: {
        '@next/next': nextPlugin,
      },
      rules: {
        ...nextPlugin.configs.recommended.rules,
        ...nextPlugin.configs['core-web-vitals'].rules,
      },
    },

    {
      files: ['**/*.{ts,tsx}'],
      extends: [prettier],
      plugins: {
        'simple-import-sort': eslintPluginSimpleImportSort,
        'unused-imports': eslintPluginUnusedImports,
        'react-hooks': eslintPluginReactHooks,
        prettier: eslintPluginPrettier,
      },
      rules: {
        ...commonTsRules,
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'quotes': ['error', 'single', { avoidEscape: true }],
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              ['^react'],
              ['^next'],
              ['^\\u0000'], // Side effects
              ['^[^@]', '^@?\\w'], // External packages
              ['^(@|components)(/.*|$)'], // Internal packages с @ и components
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent imports
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Other relative imports
              ['^.+\\.?(css)$'], // Style imports
            ],
          },
        ],
        'simple-import-sort/exports': 'error',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
      },
    },

    {
      files: ['*.config.{js,ts}', 'tailwind.config.{js,ts}'],
      extends: [prettier],
      rules: {
        ...commonTsRules,
        'no-console': 'off',
      },
    }
]);