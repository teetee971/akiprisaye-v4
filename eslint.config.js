import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'

export default [

  // =========================
  // GLOBAL IGNORES
  // =========================
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.firebase/**',
      'coverage/**',
    ],
  },

  // =========================
  // FRONTEND (VITE / REACT / BROWSER)
  // =========================
  {
    files: ['src/**/*.{js,jsx}', 'public/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: { react },
    rules: {
      ...js.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // =========================
  // SERVICE WORKERS / PWA
  // =========================
  {
    files: [
      '**/service-worker.js',
      '**/sw.js',
      'public/sw.js',
      'frontend/public/service-worker.js',
    ],
    languageOptions: {
      globals: {
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
      },
    },
  },

  // =========================
  // CHROME EXTENSION
  // =========================
  {
    files: ['extension/**/*.js'],
    languageOptions: {
      globals: {
        chrome: 'readonly',
        MutationObserver: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly',
      },
    },
  },

  // =========================
  // NODE / SCRIPTS / FIREBASE
  // =========================
  {
    files: [
      'scripts/**/*.{js,mjs}',
      'functions/**/*.js',
      '*.config.js',
      '*.mjs',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

]