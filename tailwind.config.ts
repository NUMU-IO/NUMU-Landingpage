import type { Config } from "tailwindcss";

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
        primary: "#1e40af",
        "brand-start": "#0f172a",
        "brand-end": "#1e3a8a",
        "background-light": "#E0E5EC",
        "background-alt": "#DDE2E9",
        "background-dark": "#2a3b4c",
        "text-main": "#2D3748",
        "text-muted": "#718096",
        // Dark hero colors
        midnight: "#0a0f1e",
        navy: "#0f1629",
        deep: "#141b2d",
        surface: "#1a2235",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        "brand-gradient-hover":
          "linear-gradient(135deg, #1e293b 0%, #1e40af 100%)",
        "hero-gradient": "linear-gradient(180deg, #0f172a 0%, #0f1629 50%, #141b2d 100%)",
        "hero-radial": "radial-gradient(ellipse at 50% 0%, rgba(30,64,175,0.15) 0%, transparent 60%)",
      },
      fontFamily: {
        display: ["Outfit", "Alexandria", "sans-serif"],
        arabic: ["Alexandria", "Outfit", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        full: "9999px",
      },
      boxShadow: {
        "neu-flat":
          "9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)",
        "neu-flat-sm":
          "5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255, 0.5)",
        "neu-pressed":
          "inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)",
        "neu-pressed-sm":
          "inset 3px 3px 6px 0 rgba(163,177,198, 0.7), inset -3px -3px 6px 0 rgba(255,255,255, 0.8)",
        "neu-floating":
          "15px 15px 30px rgb(163,177,198,0.5), -15px -15px 30px rgba(255,255,255, 0.6)",
        "neu-primary":
          "5px 5px 10px rgba(15, 23, 42, 0.4), -5px -5px 10px rgba(30, 58, 138, 0.4)",
        "neu-glow":
          "inset 3px 3px 6px 0 rgba(163,177,198, 0.7), inset -3px -3px 6px 0 rgba(255,255,255, 0.8), 0 0 10px rgba(30, 58, 138, 0.3)",
        "neu-active-glow":
          "inset 2px 2px 5px 0 rgba(163,177,198, 0.7), inset -2px -2px 5px 0 rgba(255,255,255, 0.8), 0 0 15px rgba(30, 58, 138, 0.6)",
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
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "slide-down": "slide-down 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
} satisfies Config;
