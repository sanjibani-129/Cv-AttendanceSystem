import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#060807",
          900: "#0a0d0b",
          850: "#0e1310",
          800: "#131a16",
          700: "#1c2620",
          600: "#2a362f",
        },
        brand: {
          DEFAULT: "#39ff8a",
          dim: "#22c55e",
          glow: "#7dffb8",
          muted: "#1a3d2a",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Space Mono'", "ui-monospace", "monospace"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(57, 255, 138, 0.25)",
        "glow-sm": "0 0 12px rgba(57, 255, 138, 0.2)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(57,255,138,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,138,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        scan: "scan 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
