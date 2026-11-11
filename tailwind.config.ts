import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#06090e",
          dark: "#0a0e17",
          card: "#0f1624",
          panel: "#151e30",
          border: "rgba(0, 255, 102, 0.16)",
          borderSubtle: "rgba(255, 255, 255, 0.08)",
          green: "#00ff66",
          greenDim: "#059669",
          cyan: "#00f0ff",
          cyanDim: "#0284c7",
          purple: "#9d4edd",
          purpleDim: "#7928ca",
          amber: "#fbbf24",
          red: "#ff3366",
          muted: "#64748b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "neon-green": "0 0 20px rgba(0, 255, 102, 0.35)",
        "neon-cyan": "0 0 20px rgba(0, 240, 255, 0.35)",
        "neon-purple": "0 0 20px rgba(157, 78, 221, 0.35)",
        "card-cyber": "0 10px 30px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanline 6s linear infinite",
        "radar-sweep": "radarsweep 3s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        radarsweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
