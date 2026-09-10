import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Master Palette
        "obsidian-plum": "#100C12",
        "deep-aubergine": "#1D1420",
        "oxblood-burgundy": "#351D27",
        "burnished-copper": "#C47B5A",
        "burnished-copper-light": "#D88F6F",
        "muted-rose": "#B98A91",
        "warm-ivory": "#F1E9DC",
        "dusty-mauve": "#B7A9AE",
        "soft-champagne": "#D8B98A",
        "glass-border": "rgba(241, 233, 220, 0.08)",
        "glass-surface": "rgba(29, 20, 32, 0.72)",
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "float-subtle": "floatSubtle 8s ease-in-out infinite",
        "pulse-copper": "pulseCopper 4s ease-in-out infinite",
      },
      keyframes: {
        floatSubtle: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseCopper: {
          "0%, 100%": { opacity: "0.6", filter: "blur(12px)" },
          "50%": { opacity: "1", filter: "blur(20px)" },
        },
      },
      boxShadow: {
        "copper-glow": "0 0 25px -4px rgba(196, 123, 90, 0.35)",
        "copper-glow-lg": "0 0 45px -8px rgba(196, 123, 90, 0.45)",
        "champagne-glow": "0 0 30px -5px rgba(216, 185, 138, 0.3)",
        "luxury-glass": "0 20px 50px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};
export default config;