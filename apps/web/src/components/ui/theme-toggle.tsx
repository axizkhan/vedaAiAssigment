"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const THEME_OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch — render nothing until client-side
  if (!mounted) {
    return (
      <div
        className="flex items-center gap-1 rounded-lg bg-surface-secondary p-1"
        aria-hidden="true"
      >
        {THEME_OPTIONS.map(({ value }) => (
          <div
            key={value}
            className="h-8 w-8 rounded-md"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg bg-surface-secondary p-1"
      role="radiogroup"
      aria-label="Theme selection"
    >
      {THEME_OPTIONS.map(({ value, label, Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} theme`}
            onClick={() => setTheme(value)}
            className={`
              flex h-8 w-8 items-center justify-center rounded-md
              transition-colors duration-150 focus-ring
              ${
                isActive
                  ? "bg-surface text-foreground shadow-soft-sm"
                  : "text-foreground-muted hover:text-foreground"
              }
            `}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
