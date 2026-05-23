"use client";

import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export interface AssignmentGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AssignmentGrid({ children, className, ...props }: AssignmentGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
