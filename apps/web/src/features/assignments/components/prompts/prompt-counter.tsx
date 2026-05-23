"use client";

import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export interface PromptCounterProps {
  current: number;
  max: number;
}

export function PromptCounter({ current, max }: PromptCounterProps) {
  const ratio = current / max;
  const isWarning = ratio > 0.8;
  const isDanger = ratio >= 1;

  return (
    <span
      className={cn(
        "text-caption transition-colors",
        isDanger ? "text-danger font-semibold" : isWarning ? "text-warning" : "text-foreground-muted"
      )}
      aria-live="polite"
      aria-label={`${current} of ${max} characters used`}
    >
      {current}/{max}
    </span>
  );
}
