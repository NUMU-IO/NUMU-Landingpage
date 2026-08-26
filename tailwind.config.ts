import type { Config } from "tailwindcss";

/**
 * Numu brand kit v1.0 (2026) — Navy palette, canonical for marketing.
 * Source of truth: .claude/skills/numu-design/colors_and_type.css
 * Navy on cream, flat/editorial. Typography matches the merchant dashboard:
 * IBM Plex Sans Arabic for both scripts, JetBrains Mono for figures.
 */
export default {
  content: [
    "./index.html",
    "./*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Brand palette (Navy) ──
        navy: {
          DEFAULT: "#003366",
          900: "#001F3F",
          800: "#002952",
          600: "#1F4A7A",
          500: "#3B6593",
          300: "#8AA5C2",
          100: "#D6E0EC",
        },
        violet: {
          DEFAULT: "#6B46C1",
          600: "#553C9A",
          300: "#B5A3E0",
        },
        // Neutrals hoisted flat so `bg-paper`, `bg-bone`, `bg-cream` all
        // resolve cleanly. (Previously `paper` / `bone` were nested under
        // `cream.*` and only produced `bg-cream-paper` / `bg-cream-bone`.)
        cream: "#F5EFE6",
        paper: "#FBF6ED",
        bone: "#EAE0CE",
        ink: {
          DEFAULT: "#0F1624",
          soft: "#2B3344",
        },
        saffron: "#E8A430",
        terracotta: "#C14A1C",
        sage: "#6B8E68",

        // ── Semantic aliases kept for backwards compat while sections migrate ──
        primary: "#003366",
        "background-light": "#F5EFE6",
        "background-alt": "#FBF6ED",
        "background-dark": "#001F3F",
        "text-main": "#0F1624",
        "text-muted": "#2B3344",
      },
      backgroundImage: {
        // Only allowed gradient is navy→violet, and only inside the logo mark.
        "numu-logo-gradient":
          "linear-gradient(135deg, #003366 0%, #6B46C1 100%)",
      },
      fontFamily: {
        display: ["IBM Plex Sans Arabic", "Cairo", "system-ui", "sans-serif"],
        arabic: ["IBM Plex Sans Arabic", "Cairo", "system-ui", "sans-serif"],
        latin: ["IBM Plex Sans Arabic", "Cairo", "system-ui", "sans-serif"],
        // JetBrains Mono carries no Arabic glyphs. Fallback is resolved per
        // glyph, so naming the Arabic face second keeps Latin and digits
        // monospaced while Arabic inside the same label renders in the brand
        // face — instead of dropping through to whatever the OS picks, which
        // is what every Arabic eyebrow on the site was doing.
        // Keep in step with `--ff-mono` in index.css.
        mono: ['"JetBrains Mono"', '"IBM Plex Sans Arabic"', "ui-monospace", "Menlo", "monospace"],
      },
      letterSpacing: {
        tight: "-0.02em",
        wide: "0.08em",
        xwide: "0.18em",
      },
      borderRadius: {
        // Brand / editorial radii — paper-like, square-ish
        none: "0",
        xs: "2px",
        sm: "4px",
        DEFAULT: "4px",
        md: "8px",
        lg: "10px",
        xl: "14px",
        "2xl": "14px",
        full: "9999px",
      },
      boxShadow: {
        // Flat / editorial — no neumorphic.
        xs: "0 1px 2px 0 hsl(0 0% 0% / 0.03)",
        sm: "0 1px 3px 0 hsl(0 0% 0% / 0.06), 0 1px 2px -1px hsl(0 0% 0% / 0.06)",
        md: "0 4px 6px -1px hsl(0 0% 0% / 0.05), 0 2px 4px -2px hsl(0 0% 0% / 0.05)",
        lg: "0 10px 15px -3px hsl(0 0% 0% / 0.05), 0 4px 6px -4px hsl(0 0% 0% / 0.05)",
        card: "0 1px 3px hsl(0 0% 0% / 0.04), 0 4px 12px hsl(0 0% 0% / 0.03)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        "slide-down": "slide-down 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up": "fade-in-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      transitionTimingFunction: {
        numu: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
} satisfies Config;
