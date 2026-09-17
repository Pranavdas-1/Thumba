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
          50: '#faf8f4',
          100: '#f2eee8',
          200: '#e2dbd0',
          300: '#cfc4b5',
          400: '#aa9b88',
        },
        ink: {
          900: '#211e1a',
          800: '#312c26',
          700: '#5c554b',
          600: '#7c7367',
          500: '#a19789',
          400: '#b9afa1',
          300: '#d7cec3',
        },
        gold: {
          50: '#fbf7ef',
          100: '#f2e8d4',
          200: '#dfc79b',
          300: '#c7a969',
          400: '#b28b55',
          500: '#96703f',
          600: '#76552f',
          700: '#5b4225',
          800: '#3c2b18',
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
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'Arial', 'sans-serif'],
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
