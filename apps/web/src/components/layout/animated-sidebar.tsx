"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/ui/component.utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface AnimatedSidebarProps {
  isExpanded: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedSidebar({ isExpanded, children, className }: AnimatedSidebarProps) {
  const prefersReduced = useReducedMotion();

  // For absolute best performance, we avoid animating width via Framer Motion's layout prop
  // unless necessary. Instead, we transition width via CSS and fade the content.
  
  return (
    <motion.aside
      className={cn(
        "relative flex flex-col h-screen border-r border-border bg-surface flex-shrink-0",
        "transition-[width] duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16",
        className
      )}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col no-scrollbar relative w-full h-full">
        {/* We use an AnimatePresence wrapper for text labels inside if needed, 
            or just let CSS opacity transitions handle it. */}
        {children}
      </div>
    </motion.aside>
  );
}

export function SidebarItemText({ isExpanded, children }: { isExpanded: boolean; children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();
  
  return (
    <AnimatePresence mode="wait">
      {isExpanded && (
        <motion.span
          initial={{ opacity: 0, width: 0, display: "none" }}
          animate={{ opacity: 1, width: "auto", display: "inline-block" }}
          exit={{ opacity: 0, width: 0, display: "none" }}
          transition={{ duration: prefersReduced ? 0.01 : 0.2 }}
          className="ml-3 whitespace-nowrap overflow-hidden"
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function SidebarActiveIndicator({ isActive }: { isActive: boolean }) {
  const prefersReduced = useReducedMotion();
  
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          initial={prefersReduced ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
        />
      )}
    </AnimatePresence>
  );
}
