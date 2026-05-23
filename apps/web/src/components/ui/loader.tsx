import { Loader2 } from "lucide-react";
import { cn } from "@/lib/ui/component.utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

export function Loader({ size = "md", className, fullScreen = false }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const loaderIcon = (
    <Loader2
      className={cn("animate-spin text-accent", sizeClasses[size], className)}
      aria-label="Loading"
      role="status"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {loaderIcon}
      </div>
    );
  }

  return loaderIcon;
}
