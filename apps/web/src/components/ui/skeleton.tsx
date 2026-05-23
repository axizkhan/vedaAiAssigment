import { cn } from "@/lib/ui/component.utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-secondary", className)}
      {...props}
    />
  );
}

export { Skeleton };
