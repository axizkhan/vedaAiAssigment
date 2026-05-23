import type { ThemeMode, ThemeColor, ThemeRadius, ThemeShadow } from "./theme.types";

export const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];

export const THEME_COLORS: Record<ThemeColor, string> = {
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
};

export const THEME_RADII: Record<ThemeRadius, string> = {
  "radius-sm": "var(--radius-sm)",
  "radius-md": "var(--radius-md)",
  "radius-lg": "var(--radius-lg)",
  "radius-xl": "var(--radius-xl)",
};

export const THEME_SHADOWS: Record<ThemeShadow, string> = {
  "shadow-sm": "var(--shadow-sm)",
  "shadow-md": "var(--shadow-md)",
  "shadow-lg": "var(--shadow-lg)",
};
