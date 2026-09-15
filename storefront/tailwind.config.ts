import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    '../shared/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#f7f4ef',
          100: '#eee9e1',
          200: '#ded6ca',
          300: '#c7bdaf',
          400: '#a99d8b',
        },
        ink: {
          900: '#1c1b19',
          800: '#2c2b28',
          700: '#55514a',
          600: '#746d63',
          500: '#968d80',
          400: '#b8afa3',
          300: '#d6cec4',
        },
        gold: {
          50: '#faf6ed',
          100: '#f2e6cb',
          200: '#dfc797',
          300: '#c8a96b',
          400: '#b79657',
          500: '#9d7c40',
          600: '#7b6032',
          700: '#614b2a',
          800: '#3f2f1b',
        },
        brand: {
          50: '#fbf5f2',
          100: '#f5e7e0',
          200: '#eccdc0',
          600: '#8e4e3e',
          700: '#723d30',
          800: '#542b22',
          900: '#381a14',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Baskerville', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      transitionTimingFunction: {
        'out-cubic': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-cubic': 'cubic-bezier(0.77, 0, 0.175, 1)',
        drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        '160': '160ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
      },
      scale: {
        '97': '0.97',
      },
      letterSpacing: {
        editorial: '0.22em',
        subtle: '0.08em',
      },
    },
  },
  plugins: [],
};

export default config;
