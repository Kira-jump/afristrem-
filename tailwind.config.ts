import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080808",
        surface: "#101010",
        elevated: "#161616",
        gold: {
          DEFAULT: "#E8B84B",
          50: "#FBF4DD",
          100: "#F8ECC4",
          200: "#F2DC95",
          300: "#EDCB66",
          400: "#E8B84B",
          500: "#D9A52E",
          600: "#B58722",
          700: "#84621A",
          800: "#553F12",
          900: "#2C200A",
        },
        forest: {
          DEFAULT: "#065F46",
          50: "#D7F2E8",
          100: "#A9E2CC",
          200: "#73CCAB",
          300: "#3FB58A",
          400: "#15966B",
          500: "#0E7A55",
          600: "#065F46",
          700: "#054937",
          800: "#033326",
          900: "#021F17",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 10px 40px -10px rgba(232,184,75,0.45)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg,#F2DC95 0%,#E8B84B 40%,#B58722 100%)",
        "fade-bottom": "linear-gradient(180deg,rgba(8,8,8,0) 0%,rgba(8,8,8,0.85) 70%,#080808 100%)",
        "fade-left": "linear-gradient(90deg,#080808 0%,rgba(8,8,8,0.85) 35%,rgba(8,8,8,0) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
