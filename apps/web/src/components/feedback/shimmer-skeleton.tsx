import * as React from "react";
import { cn } from "@/lib/ui/component.utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface ShimmerSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ShimmerSkeleton({ className, ...props }: ShimmerSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-secondary",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.5s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 dark:before:via-white/5 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}
