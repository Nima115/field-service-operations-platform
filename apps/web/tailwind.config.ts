import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        field: "#f6f8fb",
        line: "#d9e1e8",
        brand: "#1f7a6f",
        accent: "#c0782f",
        danger: "#b42318"
      },
      boxShadow: {
        panel: "0 10px 30px rgba(23, 32, 38, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
