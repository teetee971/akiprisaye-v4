/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    './ui_components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Civic Glass Design System
        background: 'rgb(var(--bg-main) / <alpha-value>)',
        foreground: 'rgb(var(--text-main) / <alpha-value>)',
        
        glass: {
          DEFAULT: 'rgba(var(--bg-glass), var(--glass-opacity))',
          hover: 'rgba(var(--bg-glass), var(--glass-opacity-hover))',
          strong: 'rgba(var(--bg-glass), var(--glass-opacity-strong))',
          border: 'rgba(var(--border-glass), var(--border-opacity))',
          'border-hover': 'rgba(var(--border-glass), var(--border-opacity-hover))',
        },

        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        subtle: 'rgb(var(--text-subtle) / <alpha-value>)',
        
        accent: {
          DEFAULT: 'rgb(var(--accent-primary) / <alpha-value>)',
          primary: 'rgb(var(--accent-primary) / <alpha-value>)',
          secondary: 'rgb(var(--accent-secondary) / <alpha-value>)',
        },

        info: 'rgb(var(--info) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',

        // Legacy civic colors (kept for compatibility)
        civic: {
          background: '#0B1220',
          glass: 'rgba(255, 255, 255, 0.08)',
          'glass-hover': 'rgba(255, 255, 255, 0.12)',
          primary: '#4AA3FF',
          'primary-dark': '#3B8FE6',
          'primary-light': '#5CB3FF',
          secondary: '#6EE7B7',
          'secondary-dark': '#5DD4A4',
          'secondary-light': '#7FFACA',
          text: '#E5E7EB',
          'text-secondary': '#9CA3AF',
          'text-muted': '#6B7280',
        },

        // Legacy brand colors for A KI PRI SA YÉ (kept for compatibility)
        primary: {
          DEFAULT: '#4AA3FF',
          50: '#e6f4ff',
          100: '#b3ddff',
          200: '#80c6ff',
          300: '#4dafff',
          400: '#1a98ff',
          500: '#4AA3FF',
          600: '#3B8FE6',
          700: '#2C7BCC',
          800: '#1D67B3',
          900: '#0E5399',
        },
        
        dark: {
          DEFAULT: '#0B1220',
          50: '#1a2332',
          100: '#141b28',
          200: '#0f141e',
          300: '#0B1220',
          400: '#080d16',
          500: '#05080c',
          600: '#020304',
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
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      
      backdropBlur: {
        civic: '14px',
        glass: 'var(--blur-civic)',
        strong: 'var(--blur-strong)',
      },
      
      borderRadius: {
        xl: 'var(--radius)',
        '2xl': 'calc(var(--radius) + 4px)',
        civic: 'var(--radius)',
        '4xl': '2rem',
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
