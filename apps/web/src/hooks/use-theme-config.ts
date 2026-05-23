"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";
import type { ThemeMode } from "@/lib/theme";

/**
 * Extended theme hook wrapping next-themes with hydration safety
 * and typed mode helpers.
 */
export function useThemeConfig() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentMode: ThemeMode = (theme as ThemeMode) ?? "system";
  const isDark = mounted ? resolvedTheme === "dark" : false;

  const cycleTheme = useCallback(() => {
    const order: ThemeMode[] = ["light", "dark", "system"];
    const currentIndex = order.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % order.length;
    setTheme(order[nextIndex]);
  }, [currentMode, setTheme]);

  return {
    mounted,
    theme: currentMode,
    resolvedTheme: mounted ? resolvedTheme : undefined,
    systemTheme: mounted ? systemTheme : undefined,
    isDark,
    setTheme: setTheme as (mode: ThemeMode) => void,
    cycleTheme,
  };
}
