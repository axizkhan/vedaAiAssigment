"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { staggerContainerVariants, createReducedMotionVariants } from "@/lib/motion/motion-variants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface StaggeredSkeletonProps {
  count?: number;
  renderItem: (index: number) => React.ReactNode;
  className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export function StaggeredSkeleton({ count = 3, renderItem, className }: StaggeredSkeletonProps) {
  const prefersReduced = useReducedMotion();
  const activeVariants = createReducedMotionVariants(staggerContainerVariants, prefersReduced);
  const activeItemVariants = createReducedMotionVariants(itemVariants, prefersReduced);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={activeVariants}
      className={className}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} variants={activeItemVariants}>
          {renderItem(i)}
        </motion.div>
      ))}
    </motion.div>
  );
}
