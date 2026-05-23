"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Profile menu"
        aria-expanded={open}
        aria-haspopup="true"
        className="flex h-10 w-10 items-center justify-center rounded-full
          bg-accent text-primary-foreground transition-transform
          duration-150 hover:scale-105 focus-ring"
      >
        <User className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-64 rounded-lg border border-border bg-surface p-2 shadow-soft-lg"
            role="menu"
          >
            {/* User info */}
            <div className="border-b border-border px-3 py-3">
              <p className="text-small font-semibold text-foreground">
                Admin User
              </p>
              <p className="text-caption text-foreground-muted">
                admin@veda.ai
              </p>
            </div>

            {/* Actions */}
            <div className="py-1">
              <Link
                href="/settings"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5
                  text-foreground-muted transition-colors duration-150
                  hover:bg-surface-secondary hover:text-foreground focus-ring"
              >
                <Settings className="h-4 w-4" />
                <span className="text-small">Settings</span>
              </Link>
            </div>

            {/* Theme */}
            <div className="border-t border-border px-3 py-3">
              <p className="mb-2 text-caption text-foreground-muted">Theme</p>
              <ThemeToggle />
            </div>

            {/* Logout */}
            <div className="border-t border-border pt-1">
              <button
                role="menuitem"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5
                  text-foreground-muted transition-colors duration-150
                  hover:bg-surface-secondary hover:text-danger focus-ring"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-small">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
