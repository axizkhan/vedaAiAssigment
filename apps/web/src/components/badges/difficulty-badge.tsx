import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/ui/component.utils";

export type DifficultyLevel = "easy" | "moderate" | "hard";

export interface DifficultyBadgeProps {
  level: DifficultyLevel;
  className?: string;
}

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  const map: Record<DifficultyLevel, { label: string; cn: string }> = {
    easy: { label: "Easy", cn: "bg-success/10 text-success-foreground border-success/20 print:border-none print:text-black print:bg-gray-100" },
    moderate: { label: "Moderate", cn: "bg-warning/10 text-warning-foreground border-warning/20 print:border-none print:text-black print:bg-gray-100" },
    hard: { label: "Hard", cn: "bg-danger/10 text-danger-foreground border-danger/20 print:border-none print:text-black print:bg-gray-100" },
  };

  const { label, cn: badgeCn } = map[level];

  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium px-2 py-0.5 rounded-sm uppercase tracking-wide", badgeCn, className)}>
      {label}
    </Badge>
  );
}

