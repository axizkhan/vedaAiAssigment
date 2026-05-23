import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export interface MarksBadgeProps {
  marks: number;
  className?: string;
}

export function MarksBadge({ marks, className }: MarksBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center justify-center rounded-sm bg-surface-secondary px-2 py-1 text-xs font-semibold text-foreground-muted whitespace-nowrap",
      "print:bg-transparent print:border print:border-gray-300 print:text-black",
      className
    )}>
      {marks} {marks === 1 ? "Mark" : "Marks"}
    </div>
  );
}
