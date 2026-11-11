import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2B2115",
        muted: "#7B6E5B",
        kraft: { DEFAULT: "#DDB47D", hi: "#E9C894", lo: "#CDA066" },
        foil: { dark: "#7A5118", DEFAULT: "#A07434", light: "#E2C47F" },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        script: ["var(--font-allura)", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
