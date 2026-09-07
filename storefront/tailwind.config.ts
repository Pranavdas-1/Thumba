import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#fbf8f2",
          100: "#f4eee3",
          200: "#e8dcc8",
        },
        ink: {
          700: "#3f3428",
          800: "#2c2416",
          900: "#1a140c",
        },
        gold: {
          400: "#d4b483",
          500: "#c4a574",
          600: "#a48452",
          700: "#7c6238",
        },
        brand: {
          50: "#f7f0ea",
          100: "#ead9cc",
          600: "#8a4a3a",
          700: "#6e382c",
          900: "#3d1f18",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
