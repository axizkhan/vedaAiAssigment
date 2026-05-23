import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/ui/component.utils";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number; // percentage, positive or negative
  trendLabel?: string;
  className?: string;
}

export function StatsCard({ title, value, icon, trend, trendLabel, className }: StatsCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className={cn("rounded-xl border border-border bg-surface p-5 shadow-soft-sm", className)}>
      <div className="flex items-center justify-between">
        <p className="text-small font-medium text-foreground-muted">{title}</p>
        {icon && <div className="text-foreground-muted opacity-70">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-h2 font-bold text-foreground">{value}</h3>
      </div>
      {(trend !== undefined || trendLabel) && (
        <div className="mt-2 flex items-center gap-1.5 text-caption">
          {trend !== undefined && (
            <span
              className={cn(
                "flex items-center font-medium",
                isPositive ? "text-success" : isNegative ? "text-danger" : "text-foreground-muted"
              )}
            >
              {isPositive && <TrendingUp className="mr-1 h-3.5 w-3.5" />}
              {isNegative && <TrendingDown className="mr-1 h-3.5 w-3.5" />}
              {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span className="text-foreground-muted">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
