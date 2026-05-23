import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export interface InformationCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function InformationCard({ title, description, icon, action, className }: InformationCardProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-xl border border-accent/20 bg-accent/5 p-5", className)}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            {icon}
          </div>
        )}
        <div>
          <h4 className="text-small font-semibold text-foreground">{title}</h4>
          <p className="mt-1 text-small text-foreground-muted">{description}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
