import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'

export default [
  // =========================
  // GLOBAL IGNORE
  // =========================
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.firebase/**',
      '**/coverage/**',
    ],
  },

  // =========================
  // BASE RULES
  // =========================
  {
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // =====================================================
  // FRONTEND — VITE / REACT / PUBLIC / ROOT JS
  // =====================================================
  {
    files: [
      'src/**/*.{js,jsx}',
      'public/**/*.js',
      '*.js',
      '*.jsx',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,

        // Browser explicites
        localStorage: 'readonly',
        alert: 'readonly',
        location: 'readonly',
        Event: 'readonly',
        Blob: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
      },
    },
    plugins: { react },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // =====================================================
  // SERVICE WORKERS / PWA (public, root, frontend)
  // =====================================================
  {
    files: [
      '**/service-worker.js',
      '**/sw.js',
    ],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // =====================================================
  // CHROME EXTENSION
  // =====================================================
  {
    files: ['extension/**/*.{js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        chrome: 'readonly',
        MutationObserver: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly',
      },
    },
  },

  // =====================================================
  // FIREBASE / CLOUD FUNCTIONS (EDGE STYLE)
  // =====================================================
  {
    files: ['functions/**/*.{js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
        Request: 'readonly',
        Response: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // =====================================================
  // NODE SCRIPTS / TERMUX / CLI
  // =====================================================
  {
    files: ['scripts/**/*.{js,mjs}', '*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // =====================================================
  // GOOGLE MAPS
  // =====================================================
  {
    files: ['scripts/**/*map*.js', 'scripts/**/*google*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        google: 'readonly',
        alert: 'readonly',
      },
    },
  },

  // =====================================================
  // VITE CONFIG (Node ESM)
  // =====================================================
  {
    files: ['vite.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },
]