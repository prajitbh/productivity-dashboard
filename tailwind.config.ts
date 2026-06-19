import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B3A4B",
        "ink-soft": "#5C7080",
        "ink-faint": "#8FA0A8",
        paper: "#F7F3E9",
        "paper-raised": "#FCFAF4",
        "paper-line": "#E3DCC8",
        amber: {
          DEFAULT: "#D98E3B",
          soft: "#F0D9B5",
        },
        sage: {
          DEFAULT: "#7C9885",
          soft: "#DCE6DF",
        },
        brick: {
          DEFAULT: "#B5533C",
          soft: "#EAD2C8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "ledger-rule":
          "repeating-linear-gradient(to bottom, transparent, transparent 39px, #E3DCC8 39px, #E3DCC8 40px)",
      },
    },
  },
  plugins: [],
};

export default config;
