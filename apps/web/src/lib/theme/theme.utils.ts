import type { ThemeColor } from "./theme.types";

/**
 * Retrieve the computed CSS variable value of a design token at runtime.
 * Useful for canvas rendering or imperative style operations.
 */
export function getTokenValue(token: ThemeColor): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${token}`)
    .trim();
}

/**
 * Detect if the user's system prefers dark mode.
 */
export function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Detect if the user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
