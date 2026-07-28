/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: "#22ff88",
          dim: "#16a34a",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(34, 255, 136, 0.35)",
      },
    },
  },
  plugins: [],
}
