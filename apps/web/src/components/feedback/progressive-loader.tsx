"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { fadeVariants } from "@/lib/motion/motion-variants";

export interface ProgressiveLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallbackMessage?: string;
}

export function ProgressiveLoader({ isLoading, children, fallbackMessage = "Loading..." }: ProgressiveLoaderProps) {
  return (
    <div className="relative min-h-[200px] w-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="mt-4 text-small text-foreground-muted animate-pulse">{fallbackMessage}</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            className="w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
