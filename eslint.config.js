
import js from '@eslint/js';
import react from 'eslint-plugin-react';

/**
 * ESLint Flat Config
 * Compatible :
 * - Browser / React (JSX)
 * - Node / Vite (ESM)
 * - Termux / Linux
 */

export default [
  // =====================================================
  // Base ESLint recommended
  // =====================================================
  js.configs.recommended,

  // =====================================================
  // Global ignores
  // =====================================================
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

  // =====================================================
  // Main Browser / React code
  // =====================================================
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
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Event: 'readonly',
        localStorage: 'readonly',

        // Timers
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',

        // Console (controlled by rule)
        console: 'readonly',
      },
    },
    plugins: {
      react,
    },
    rules: {
      // React 17+ JSX transform
      'react/react-in-jsx-scope': 'off',

      // Controlled console usage
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Unused vars: warnings only, ignore "_" prefixed args
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Debugger warning only
      'no-debugger': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // =====================================================
  // Node / Vite config (vite.config.js)
  // =====================================================
  {
    files: ['vite.config.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },
];