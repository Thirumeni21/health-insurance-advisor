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
        // Style Reference Core Palette
        ink: "#18151F",
        "ink-soft": "#4A4556",
        muted: "#928DA0",
        hairline: "#E7E2EF",
        "bg-soft": "#FAF9FC",
        "lavender-100": "#EEE6FB",
        "lavender-300": "#D9C8F3",
        "lavender-600": "#8B68CF",
        "sage-100": "#E9F0DA",
        "sage-500": "#9CB974",
        "cream-100": "#F6F1E6",

        // Aliases to seamlessly restyle any legacy references
        "obsidian-plum": "#FFFFFF",
        "deep-aubergine": "#FAF9FC",
        "oxblood-burgundy": "#EEE6FB",
        "burnished-copper": "#18151F",
        "burnished-copper-light": "#8B68CF",
        "muted-rose": "#928DA0",
        "warm-ivory": "#18151F",
        "dusty-mauve": "#4A4556",
        "soft-champagne": "#8B68CF",
        "glass-border": "#E7E2EF",
        "glass-surface": "#FFFFFF",
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
        pill: "999px",
      },
      boxShadow: {
        subtle: "0 8px 20px rgba(24, 21, 31, 0.06)",
        elevated: "0 20px 40px rgba(24, 21, 31, 0.08)",
        "copper-glow": "0 8px 20px rgba(24, 21, 31, 0.06)",
        "champagne-glow": "0 8px 20px rgba(139, 104, 207, 0.12)",
        "luxury-glass": "0 8px 24px rgba(24, 21, 31, 0.06)",
      },
      maxWidth: {
        editorial: "1240px",
      },
    },
  },
  plugins: [],
};
export default config;