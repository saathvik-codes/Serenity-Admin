import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ["Public Sans", "system-ui", "sans-serif"], display: ["Lora", "Georgia", "serif"] },
      colors: {
        // brand-remap
        // warm-grey
        gray: {
          "50": "#faf8f4",
          "100": "#f3efe8",
          "200": "#e6e0d5",
          "300": "#d0c9bb",
          "400": "#a39c8e",
          "500": "#7a746a",
          "600": "#5c574f",
          "700": "#44403a",
          "800": "#2d2a26",
          "900": "#1f1d1a",
        },
        purple: {"50": "#f3f6f3", "100": "#e4ebe5", "200": "#c9d7cc", "300": "#a5bcaa", "400": "#7f9d86", "500": "#5d7a66", "600": "#4d6655", "700": "#3f5446", "800": "#33443a", "900": "#2a3830"},
        indigo: {"50": "#f3f6f3", "100": "#e4ebe5", "200": "#c9d7cc", "300": "#a5bcaa", "400": "#7f9d86", "500": "#5d7a66", "600": "#4d6655", "700": "#3f5446", "800": "#33443a", "900": "#2a3830"},
        violet: {"50": "#f3f6f3", "100": "#e4ebe5", "200": "#c9d7cc", "300": "#a5bcaa", "400": "#7f9d86", "500": "#5d7a66", "600": "#4d6655", "700": "#3f5446", "800": "#33443a", "900": "#2a3830"},
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
