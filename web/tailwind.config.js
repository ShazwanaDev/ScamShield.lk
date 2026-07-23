/** @type {import('tailwindcss').Config} */
// ScamShield LK design system — refined Sri Lankan cybersecurity palette.
// Single light theme (the product's deliberate visual identity). Colours are
// plain hex so Tailwind's opacity modifiers still work (e.g. `bg-scam/10`).
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        navy: { DEFAULT: "#0B1F33", deep: "#071524" },
        primary: {
          DEFAULT: "#175CD3",
          electric: "#2E90FA",
          foreground: "#FFFFFF",
        },
        teal: { DEFAULT: "#0E9384", light: "#5FE9D0" },
        info: { DEFAULT: "#6941C6", light: "#EBE9FE" },

        // Surfaces & text
        background: "#F6F8FB",
        "background-secondary": "#EEF2F6",
        surface: "#FFFFFF",
        "surface-dark": "#101828",
        foreground: "#101828",
        "foreground-secondary": "#475467",
        muted: "#EEF2F6",
        "muted-foreground": "#667085",
        border: "#D0D5DD",
        "border-strong": "#98A2B3",
        ring: "#84CAFF",

        // Semantic verdicts / states
        scam: { DEFAULT: "#D92D20", light: "#FEE4E2", foreground: "#FFFFFF" },
        spam: { DEFAULT: "#DC6803", light: "#FEF0C7", foreground: "#FFFFFF" },
        legit: { DEFAULT: "#079455", light: "#D1FADF", foreground: "#FFFFFF" },
        success: { DEFAULT: "#079455", light: "#D1FADF", foreground: "#FFFFFF" },
        warning: { DEFAULT: "#F79009", light: "#FEF0C7", foreground: "#101828" },
        error: { DEFAULT: "#D92D20", light: "#FEE4E2", foreground: "#FFFFFF" },

        // Back-compat aliases so pages mid-migration keep compiling
        card: "#FFFFFF",
        "card-foreground": "#101828",
        brand: { DEFAULT: "#0B1F33", 2: "#175CD3", accent: "#2E90FA", foreground: "#FFFFFF" },
        danger: { DEFAULT: "#D92D20", light: "#FEE4E2", foreground: "#FFFFFF" },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans Sinhala",
          "Noto Sans Tamil",
          "Noto Sans",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        sinhala: ["Noto Sans Sinhala", "Inter", "sans-serif"],
        tamil: ["Noto Sans Tamil", "Inter", "sans-serif"],
      },
      fontSize: {
        display: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-sm": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "800" }],
        "page-title": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "section-title": ["1.25rem", { lineHeight: "1.3", fontWeight: "700" }],
        "card-title": ["1.0625rem", { lineHeight: "1.35", fontWeight: "600" }],
        "data-value": ["1.75rem", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "700" }],
      },
      spacing: { 18: "4.5rem", 22: "5.5rem" },
      borderRadius: { sm: "8px", md: "12px", lg: "16px", xl: "20px", "2xl": "24px" },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(16 24 40 / 0.05)",
        sm: "0 1px 3px 0 rgb(16 24 40 / 0.10), 0 1px 2px -1px rgb(16 24 40 / 0.06)",
        md: "0 4px 8px -2px rgb(16 24 40 / 0.10), 0 2px 4px -2px rgb(16 24 40 / 0.06)",
        lg: "0 12px 16px -4px rgb(16 24 40 / 0.08), 0 4px 6px -2px rgb(16 24 40 / 0.03)",
        xl: "0 20px 24px -4px rgb(16 24 40 / 0.08), 0 8px 8px -4px rgb(16 24 40 / 0.03)",
        card: "0 1px 2px 0 rgb(16 24 40 / 0.05)",
        "card-hover": "0 12px 16px -4px rgb(16 24 40 / 0.10), 0 4px 6px -2px rgb(16 24 40 / 0.05)",
      },
      backgroundImage: {
        "gradient-navy": "linear-gradient(135deg, #0B1F33 0%, #071524 100%)",
        "gradient-hero":
          "radial-gradient(80% 80% at 100% 0%, rgba(46,144,250,0.10), transparent 60%), radial-gradient(70% 70% at 0% 100%, rgba(14,147,132,0.08), transparent 60%)",
        // Back-compat
        "gradient-brand": "linear-gradient(135deg, #0B1F33, #175CD3)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-up-sheet": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        scan: {
          "0%": { transform: "translateY(-120%)" },
          "100%": { transform: "translateY(320%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "fade-up": "fade-up 0.4s ease-out both",
        reveal: "reveal 0.55s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.2s ease-out both",
        "slide-in-right": "slide-in-right 0.28s cubic-bezier(0.16,1,0.3,1) both",
        "slide-up-sheet": "slide-up-sheet 0.3s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.4s linear infinite",
        scan: "scan 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
