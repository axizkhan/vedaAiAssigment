import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/ui/component.utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gesturePresets } from "@/lib/motion/gesture.utils";

export interface AnimatedCardProps extends HTMLMotionProps<"div"> {}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, whileHover, ...props }, ref) => {
    const prefersReduced = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        className={cn("bg-surface border border-border rounded-xl shadow-soft-sm", className)}
        whileHover={prefersReduced ? undefined : (whileHover || gesturePresets.hoverCard)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
AnimatedCard.displayName = "AnimatedCard";
