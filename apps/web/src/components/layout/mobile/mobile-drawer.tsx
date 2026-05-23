"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useMobileNav } from "@/hooks/use-mobile-nav";
import { SidebarNav } from "../sidebar/sidebar-nav";
import { SchoolCard } from "../sidebar/school-card";
import { SidebarFooter } from "../sidebar/sidebar-footer";

export function MobileDrawer() {
  const { mobileDrawerOpen, closeMobileDrawer } = useMobileNav();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileDrawer();
    };
    if (mobileDrawerOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen, closeMobileDrawer]);

  // Focus trap: focus the drawer when it opens
  useEffect(() => {
    if (mobileDrawerOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [mobileDrawerOpen]);

  return (
    <AnimatePresence>
      {mobileDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileDrawer}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface shadow-soft-lg lg:hidden outline-none"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-body font-bold text-foreground">
                  Veda AI
                </span>
              </div>
              <button
                onClick={closeMobileDrawer}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-md
                  text-foreground-muted hover:bg-surface-secondary hover:text-foreground
                  transition-colors duration-150 focus-ring"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* School Card */}
            <div className="py-3">
              <SchoolCard collapsed={false} />
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-2">
              <SidebarNav collapsed={false} />
            </div>

            {/* Footer */}
            <div className="pb-4">
              <SidebarFooter collapsed={false} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
