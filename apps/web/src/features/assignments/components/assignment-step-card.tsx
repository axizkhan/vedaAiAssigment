import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export function AssignmentStepCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-surface border border-border rounded-2xl p-5 md:p-8 shadow-soft-sm", className)}>
      {children}
    </div>
  );
}
