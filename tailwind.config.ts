import type { Config } from "tailwindcss";
import { colors } from "./styles/theme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.primary.DEFAULT,
          light: colors.primary.light,
          dark: colors.primary.dark,
          50: colors.primary[50],
          100: colors.primary[100],
          200: colors.primary[200],
          300: colors.primary[300],
          400: colors.primary[400],
          500: colors.primary[500],
          600: colors.primary[600],
          700: colors.primary[700],
          800: colors.primary[800],
          900: colors.primary[900],
        },
        secondary: {
          DEFAULT: colors.secondary.DEFAULT,
          light: colors.secondary.light,
          dark: colors.secondary.dark,
          50: colors.secondary[50],
          100: colors.secondary[100],
          200: colors.secondary[200],
          300: colors.secondary[300],
          400: colors.secondary[400],
          500: colors.secondary[500],
          600: colors.secondary[600],
          700: colors.secondary[700],
          800: colors.secondary[800],
          900: colors.secondary[900],
        },
        accent: {
          DEFAULT: colors.accent.DEFAULT,
          light: colors.accent.light,
          dark: colors.accent.dark,
          50: colors.accent[50],
          100: colors.accent[100],
          200: colors.accent[200],
          300: colors.accent[300],
          400: colors.accent[400],
          500: colors.accent[500],
          600: colors.accent[600],
          700: colors.accent[700],
          800: colors.accent[800],
          900: colors.accent[900],
        },
        neutral: colors.neutral,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
        white: colors.white,
        black: colors.black,
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
