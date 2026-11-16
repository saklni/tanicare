import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      green: { 50: "#F1F8F2", 100: "#DCF0E1", 600: "#2E8B4A", 700: "#1F6B3A", 800: "#17542D", 900: "#0F3D20" },
      cream: { 50: "#FFFDF8", 100: "#FBF7EC", 200: "#F3EBD6" },
      ink: { 900: "#1B2A1F", 700: "#4A5A4E", 500: "#5E6B61" },
      danger: "#B42318", warning: "#7A4B00", wa: "#0B6B5F",
    },
    fontFamily: { display: ["var(--font-display)", "system-ui", "sans-serif"], sans: ["var(--font-body)", "system-ui", "sans-serif"] },
  } },
  plugins: [],
} satisfies Config;
