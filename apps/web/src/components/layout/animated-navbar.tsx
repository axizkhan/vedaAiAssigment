"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/ui/component.utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface AnimatedNavbarProps extends React.HTMLAttributes<HTMLElement> {}

export function AnimatedNavbar({ className, children, ...props }: AnimatedNavbarProps) {
  const { scrollY } = useScroll();
  const prefersReduced = useReducedMotion();

  // Create a subtle shadow and backdrop blur that increases as we scroll down
  const shadowOpacity = useTransform(scrollY, [0, 50], [0, 0.05]);
  const backdropBlur = useTransform(scrollY, [0, 50], [0, 8]);
  
  return (
    <motion.header
      style={
        prefersReduced 
          ? {} 
          : { 
              boxShadow: useTransform(shadowOpacity, (val) => `0 4px 6px -1px rgba(0, 0, 0, ${val})`),
              backdropFilter: useTransform(backdropBlur, (val) => `blur(${val}px)`)
            }
      }
      className={cn(
        "sticky top-0 z-40 w-full bg-surface/80 border-b border-border transition-colors duration-300",
        className
      )}
      {...props}
    >
      {children}
    </motion.header>
  );
}
