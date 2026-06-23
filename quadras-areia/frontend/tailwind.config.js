/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0ff',
          100: '#c5d9ff',
          200: '#8eb4ff',
          300: '#5a8fe8',
          400: '#2d6bc9',
          500: '#0d47a1',
          600: '#0a3d8a',
          700: '#083270',
          800: '#062858',
          900: '#041d40',
          DEFAULT: '#0d47a1',
        },
        lime: {
          50: '#f4fde8',
          100: '#e4f9c5',
          200: '#c8f28a',
          300: '#a8e635',
          400: '#9acd32',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          DEFAULT: '#9acd32',
        },
        sand: {
          50: '#f8faf5',
          100: '#eef2e8',
          200: '#dde5d0',
          300: '#c9d4b8',
          DEFAULT: '#eef2e8',
        },
        success: {
          light: '#e4f9c5',
          DEFAULT: '#9acd32',
          dark: '#4d7c0f',
        },
        danger: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        muted: {
          light: '#94a3b8',
          DEFAULT: '#64748b',
          dark: '#334155',
        },
        dark: {
          DEFAULT: '#0f172a',
          800: '#1e293b',
          900: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 14px -2px rgba(13, 71, 161, 0.12)',
        'card-hover': '0 12px 28px -6px rgba(13, 71, 161, 0.2)',
        glow: '0 0 24px rgba(154, 205, 50, 0.35)',
        'glow-blue': '0 0 32px rgba(13, 71, 161, 0.4)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #041d40 0%, #0d47a1 45%, #083270 100%)',
        'lime-glow': 'radial-gradient(ellipse at top right, rgba(154, 205, 50, 0.15), transparent 60%)',
      },
    },
  },
  plugins: [],
};
