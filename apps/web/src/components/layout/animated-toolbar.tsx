"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/ui/component.utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface AnimatedToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  isVisible?: boolean;
}

export function AnimatedToolbar({ className, isVisible = true, children, ...props }: AnimatedToolbarProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={false}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={
        prefersReduced 
          ? { duration: 0.01 } 
          : { type: "spring", stiffness: 400, damping: 30 }
      }
      className={cn(
        "sticky top-0 z-30 w-full bg-surface border-b border-border px-4 py-2 flex items-center shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
