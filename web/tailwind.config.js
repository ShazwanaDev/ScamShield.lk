/** @type {import('tailwindcss').Config} */
// ScamShield LK design system: the "signal" dark theme.
// Off-black neutrals with one accent: signal red. Colours are plain hex so
// Tailwind's opacity modifiers still work (e.g. `bg-scam/10`).
//
// Contrast notes (WCAG 2.2 AA):
// - `primary` / `scam` (bright red) are for text, icons and strokes on dark
//   surfaces (≥ 4.8:1 on `surface`).
// - White text never sits on the bright reds. Filled controls use the `strong`
//   shades or `bg-gradient-cta`, which keep white text at ≥ 4.5:1.
// - Amber and green fills carry dark text (`*-foreground`).
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: "#FF3B30", // signal red (text, icons, strokes)
          strong: "#D42C24", // filled controls with white text
          deep: "#7A0E13", // deep red (gradients, earlier-period cells)
          electric: "#FF6A60",
          soft: "#FF9C94",
          foreground: "#FFFFFF",
        },
        // Legacy slots, folded into the dark/red system so older pages keep compiling.
        navy: { DEFAULT: "#111114", deep: "#0B0B0C" },
        teal: { DEFAULT: "#FF5A4F", light: "#FF9C94" },
        info: { DEFAULT: "#AEB6C4", light: "#1C1E23" },

        // Surfaces & text
        background: "#0B0B0C",
        "background-secondary": "#1C1C21",
        surface: "#141417",
        "surface-raised": "#1A1A1E",
        "surface-dark": "#0B0B0C",
        foreground: "#E6E6E8",
        "foreground-secondary": "#B4B4BB",
        muted: "#1C1C21",
        "muted-foreground": "#8C8C95",
        border: "#26262B",
        "border-strong": "#3A3A41",
        ring: "#FF6A60",

        // Chart cells
        cell: { DEFAULT: "#1E1E23", hover: "#2A2A30" },

        // Semantic verdicts / states
        scam: { DEFAULT: "#FF4F45", strong: "#C8231B", light: "#2A1314", foreground: "#FFFFFF" },
        spam: { DEFAULT: "#F5A524", strong: "#F5A524", light: "#272012", foreground: "#1A1206" },
        legit: { DEFAULT: "#3DD68C", strong: "#14824F", light: "#10231A", foreground: "#04140B" },
        success: { DEFAULT: "#3DD68C", strong: "#14824F", light: "#10231A", foreground: "#04140B" },
        warning: { DEFAULT: "#F5B740", light: "#272012", foreground: "#1A1206" },
        error: { DEFAULT: "#FF4F45", strong: "#C8231B", light: "#2A1314", foreground: "#FFFFFF" },

        // Back-compat aliases
        card: "#141417",
        "card-foreground": "#E6E6E8",
        brand: { DEFAULT: "#141417", 2: "#FF3B30", accent: "#FF6A60", foreground: "#FFFFFF" },
        danger: { DEFAULT: "#FF4F45", strong: "#C8231B", light: "#2A1314", foreground: "#FFFFFF" },
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
        display: ["Manrope", "Inter", "Noto Sans Sinhala", "Noto Sans Tamil", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
        sinhala: ["Noto Sans Sinhala", "Inter", "sans-serif"],
        tamil: ["Noto Sans Tamil", "Inter", "sans-serif"],
      },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.04", letterSpacing: "-0.035em", fontWeight: "700" }],
        "display-sm": ["2.5rem", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "700" }],
        "page-title": ["1.875rem", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "600" }],
        "section-title": ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" }],
        "card-title": ["1rem", { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "600" }],
        "data-value": ["2rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "600" }],
        "data-hero": ["4.5rem", { lineHeight: "0.95", letterSpacing: "-0.045em", fontWeight: "700" }],
        eyebrow: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.14em", fontWeight: "600" }],
      },
      spacing: { 18: "4.5rem", 22: "5.5rem" },
      borderRadius: { sm: "6px", md: "10px", lg: "14px", xl: "18px", "2xl": "24px" },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.4)",
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.4)",
        md: "0 6px 16px -4px rgb(0 0 0 / 0.6)",
        lg: "0 16px 32px -8px rgb(0 0 0 / 0.7), 0 0 0 1px rgb(255 255 255 / 0.04)",
        xl: "0 24px 48px -12px rgb(0 0 0 / 0.8), 0 0 0 1px rgb(255 255 255 / 0.05)",
        card: "inset 0 1px 0 0 rgb(255 255 255 / 0.035)",
        "card-hover": "inset 0 1px 0 0 rgb(255 255 255 / 0.06), 0 18px 36px -16px rgb(0 0 0 / 0.9)",
        glow: "0 0 0 1px rgb(255 59 48 / 0.35), 0 10px 30px -8px rgb(255 59 48 / 0.55)",
        "glow-sm": "0 6px 18px -6px rgb(255 59 48 / 0.6)",
      },
      backgroundImage: {
        // Red-to-black wash used by heroes and promo cards (name kept for back-compat)
        "gradient-navy":
          "radial-gradient(90% 70% at 80% 0%, rgba(255,59,48,0.22) 0%, rgba(122,14,19,0.30) 32%, rgba(11,11,12,0) 68%), linear-gradient(180deg, #140B0C 0%, #0B0B0C 100%)",
        "gradient-hero":
          "radial-gradient(55% 45% at 50% 0%, rgba(255,59,48,0.16), transparent 70%)",
        "gradient-risk": "linear-gradient(180deg, #2A1113 0%, #1B0E0F 100%)",
        "gradient-cta": "linear-gradient(180deg, #EC3A31 0%, #BB1F18 100%)",
        "gradient-scan": "linear-gradient(180deg, transparent 0%, rgba(255,59,48,0.16) 50%, transparent 100%)",
        "gradient-brand": "linear-gradient(135deg, #7A0E13, #FF3B30)",
        "dot-grid": "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
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
        "cell-in": {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
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
        "cell-in": "cell-in 0.35s cubic-bezier(0.16,1,0.3,1) both",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
