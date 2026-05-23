import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-secondary": "var(--surface-secondary)",

        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",

        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",

        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",

        border: "var(--border)",
        input: "var(--input)",

        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",

        ring: "var(--ring)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        "soft-sm": "var(--shadow-sm)",
        "soft-md": "var(--shadow-md)",
        "soft-lg": "var(--shadow-lg)",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "16": "64px",
      },
      fontSize: {
        h1: ["3rem", { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.02em" }],
        h2: ["2.25rem", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.015em" }],
        h3: ["1.75rem", { lineHeight: "1.25", fontWeight: "600", letterSpacing: "-0.01em" }],
        h4: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        h5: ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0.01em" }],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
        "scale-in": "scale-in 0.25s ease-out forwards",
        "slide-up": "slide-up 0.35s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
