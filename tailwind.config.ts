import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: "var(--coral)",
        "coral-light": "var(--coral-light)",
        paper: "var(--paper)",
        ink: "var(--ink)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        pop: "5px 5px 0 0 var(--ink)",
        "pop-sm": "3px 3px 0 0 var(--ink)",
        "pop-coral": "5px 5px 0 0 var(--coral)",
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
  plugins: [],
};

export default config;
