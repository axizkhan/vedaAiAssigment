import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export interface DashboardSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function DashboardSection({ children, className, ...props }: DashboardSectionProps) {
  return (
    <section className={cn("mt-6 md:mt-8 space-y-6", className)} {...props}>
      {children}
    </section>
  );
}
