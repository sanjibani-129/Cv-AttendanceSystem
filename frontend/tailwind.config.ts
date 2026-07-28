import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        "secondary-bg": "#101010",
        card: "#181818",
        border: "#2A2A2A",
        matrix: {
          primary: "#39FF14",
          secondary: "#00FF66",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#C0C0C0",
          muted: "#808080",
        },
        status: {
          success: "#00FF66",
          warning: "#FFD54F",
          error: "#FF4D4F",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        'neon': '0 0 15px rgba(57, 255, 20, 0.25)',
        'neon-strong': '0 0 25px rgba(57, 255, 20, 0.5)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(57, 255, 20, 0.6)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
