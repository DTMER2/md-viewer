import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Hiragino Sans", "Yu Gothic", "sans-serif"],
      },
      colors: {
        ink: "#1f1f1f",
        paper: "#f8f5ef",
        accent: "#d97706",
      },
      boxShadow: {
        card: "0 18px 40px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
