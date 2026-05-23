import * as React from "react";
import { cn } from "@/lib/ui/component.utils";
import { AlertCircle } from "lucide-react";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again.",
  action,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-danger/20 bg-danger/5 p-8 text-center",
        className
      )}
      {...props}
    >
      <AlertCircle className="mb-4 h-12 w-12 text-danger" />
      <h3 className="text-h5 font-semibold text-danger">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-small text-foreground-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
