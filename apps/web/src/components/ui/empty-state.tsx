import * as React from "react";
import { cn } from "@/lib/ui/component.utils";
import { Inbox } from "lucide-react";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-secondary/50 p-8 text-center",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface text-foreground-muted shadow-soft-sm">
        {icon || <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="text-h4 text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-small text-foreground-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
