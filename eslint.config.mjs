// @ts-check
import nestjsSecurity from 'eslint-plugin-nestjs-security';
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: { 'nestjs-security': nestjsSecurity },
    rules: {
      // Catches the missing `whitelist: true` this PR fixes, so it cannot come
      // back: without it, properties absent from the DTO survive validation and
      // reach the Dynamoose write.
      'nestjs-security/require-validation-pipe-whitelist': 'error',

      // Runtime risks that are already absent from this template today — kept
      // that way for every project generated from it.
      'nestjs-security/no-missing-validation-pipe': 'error',
      'nestjs-security/require-throttler': 'warn',
      'nestjs-security/no-exposed-private-fields': 'warn',
      'nestjs-security/no-res-bypass-serialization': 'error',
      'nestjs-security/no-unguarded-swagger': 'warn',
      'nestjs-security/no-hybrid-app-config-loss': 'error',
      'nestjs-security/no-unsafe-multer-filename': 'error',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },
);
