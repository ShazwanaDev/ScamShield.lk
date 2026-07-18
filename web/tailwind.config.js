/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        brand: {
          DEFAULT: "hsl(var(--brand) / <alpha-value>)",
          2: "hsl(var(--brand-2) / <alpha-value>)",
          accent: "hsl(var(--brand-accent) / <alpha-value>)",
          foreground: "hsl(var(--brand-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "hsl(var(--danger) / <alpha-value>)",
          foreground: "hsl(var(--danger-foreground) / <alpha-value>)",
        },
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
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.08)",
        elegant: "0 20px 40px -18px rgb(10 27 48 / 0.35)",
      },
      backgroundImage: {
        "gradient-hero":
          "radial-gradient(85% 100% at 100% 0%, hsl(var(--brand-accent) / 0.16), transparent 60%), radial-gradient(60% 90% at 0% 100%, hsl(var(--brand) / 0.14), transparent 60%)",
        "gradient-brand": "linear-gradient(135deg, hsl(var(--brand)), hsl(var(--brand-2)))",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "reveal": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "fade-in": "fade-in 0.5s ease-out both",
        reveal: "reveal 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
