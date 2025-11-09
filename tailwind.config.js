/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    './ui_components/**/*.{js,jsx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Brand colors for A KI PRI SA YÉ
        primary: {
          DEFAULT: '#0f62fe',
          50: '#e6f0ff',
          100: '#b3d4ff',
          200: '#80b8ff',
          300: '#4d9cff',
          400: '#1a80ff',
          500: '#0f62fe',
          600: '#0c4ecb',
          700: '#093a98',
          800: '#062665',
          900: '#031332',
        },
        dark: {
          DEFAULT: '#0b0d17',
          50: '#1a1d2e',
          100: '#141729',
          200: '#0f1120',
          300: '#0b0d17',
          400: '#08090f',
          500: '#050507',
          600: '#020203',
          700: '#000000',
        },
        // DOM-COM territory colors
        territory: {
          guadeloupe: '#0066cc',
          martinique: '#cc0000',
          guyane: '#008844',
          reunion: '#ff6600',
          mayotte: '#9933cc',
          saintpierre: '#006699',
          saintbarth: '#ffcc00',
          saintmartin: '#ff3399',
          wallis: '#663399',
          polynesie: '#00cccc',
          nouvellecaledonie: '#cc6600',
          taaf: '#3366cc',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      minHeight: {
        '44': '2.75rem', // WCAG 2.1 AA minimum touch target
      },
      minWidth: {
        '44': '2.75rem', // WCAG 2.1 AA minimum touch target
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'hard': '0 8px 24px rgba(0, 0, 0, 0.2)',
        'dark': '0 4px 16px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      // Contrast ratios for WCAG 2.1 AA compliance (minimum 4.5:1)
      contrast: {
        '4.5': '4.5', // WCAG AA normal text
        '7': '7', // WCAG AAA normal text
      },
    },
  },
  plugins: [],
};
