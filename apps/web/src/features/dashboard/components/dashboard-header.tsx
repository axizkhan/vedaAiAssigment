import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export interface DashboardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({ title, description, action, className }: DashboardHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between", className)}>
      <div>
        <h1 className="text-h3 font-bold text-foreground lg:text-h2">{title}</h1>
        {description && <p className="mt-1 text-small text-foreground-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
