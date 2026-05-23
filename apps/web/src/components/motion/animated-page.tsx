"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { fadeVariants, createReducedMotionVariants } from "@/lib/motion/motion-variants";

export interface AnimatedPageProps extends HTMLMotionProps<"main"> {}

export const AnimatedPage = React.forwardRef<HTMLElement, AnimatedPageProps>(
  ({ children, variants, ...props }, ref) => {
    const prefersReduced = useReducedMotion();
    const activeVariants = variants || createReducedMotionVariants(fadeVariants, prefersReduced);

    return (
      <motion.main
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={activeVariants}
        {...props}
      >
        {children}
      </motion.main>
    );
  }
);
AnimatedPage.displayName = "AnimatedPage";
