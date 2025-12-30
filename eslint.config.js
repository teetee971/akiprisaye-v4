import js from '@eslint/js';
import react from 'eslint-plugin-react';

/**
 * ESLint flat config
 * Compatible Termux / Node / Browser / React / Cloudflare
 */

export default [
  // =========================
  // Base ESLint recommended
  // =========================
  js.configs.recommended,

  // =========================
  // Global ignores
  // =========================
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.firebase/**',
      '*.min.js',
      'public/assets/**',
      'Assets/**',
      'akiprisaye_web/**',
      'akiprisaye_web_final_full_*/**',
      'test_extract/**',
      'SentinelQuantumVanguardAIPro/**',
    ],
  },

  // =========================
  // Main browser / React code
  // =========================
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      react,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
