import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        "ink-soft": "var(--color-ink-soft)",
        "ink-faint": "var(--color-ink-faint)",
        paper: "var(--color-paper)",
        "paper-raised": "var(--color-paper-raised)",
        "paper-line": "var(--color-paper-line)",
        amber: {
          DEFAULT: "#b9883f",
          soft: "#e9d8b0",
        },
        sage: {
          DEFAULT: "#8a9a5b",
          soft: "#dde3c9",
        },
        brick: {
          DEFAULT: "#4f5e3c",
          soft: "#d6dac9",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "ledger-rule":
          "repeating-linear-gradient(to bottom, transparent, transparent 39px, #D2B48C 39px, #D2B48C 40px)",
      },
    },
  },
  plugins: [],
};

export default config;
