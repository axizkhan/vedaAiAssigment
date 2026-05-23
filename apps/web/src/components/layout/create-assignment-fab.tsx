"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gesturePresets } from "@/lib/motion/gesture.utils";

export interface CreateAssignmentFabProps {
  onClick: () => void;
  isVisible?: boolean;
}

export function CreateAssignmentFab({ onClick, isVisible = true }: CreateAssignmentFabProps) {
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 md:hidden"
        >
          <motion.div
            whileHover={prefersReduced ? undefined : gesturePresets.hoverButton}
            whileTap={prefersReduced ? undefined : gesturePresets.tapButton}
          >
            <Button
              size="icon"
              className="w-14 h-14 rounded-full shadow-soft-lg flex items-center justify-center bg-primary text-primary-foreground"
              onClick={onClick}
            >
              <Plus className="w-6 h-6" />
              <span className="sr-only">Create Assignment</span>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
