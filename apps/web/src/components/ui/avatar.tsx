import * as React from "react";
import { cn } from "@/lib/ui/component.utils";
import { User } from "lucide-react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-caption",
      md: "h-10 w-10 text-small",
      lg: "h-14 w-14 text-body",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-surface-secondary items-center justify-center text-foreground-muted",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full object-cover"
          />
        ) : fallback ? (
          <span className="font-medium uppercase">{fallback}</span>
        ) : (
          <User className="h-1/2 w-1/2" />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
