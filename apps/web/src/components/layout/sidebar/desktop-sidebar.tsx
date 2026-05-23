"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { SidebarNav } from "./sidebar-nav";
import { SchoolCard } from "./school-card";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarCollapse } from "./sidebar-collapse";
import {
  SIDEBAR_WIDTH_EXPANDED,
  SIDEBAR_WIDTH_COLLAPSED,
} from "@/constants/navigation.constants";

export function DesktopSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();

  const width = sidebarCollapsed
    ? SIDEBAR_WIDTH_COLLAPSED
    : SIDEBAR_WIDTH_EXPANDED;

  return (
    <motion.aside
      aria-label="Sidebar"
      animate={{ width }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-surface lg:flex"
    >
      {/* Logo & Collapse */}
      <div className="flex h-16 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="text-body font-bold text-foreground whitespace-nowrap"
            >
              Veda AI
            </motion.span>
          )}
        </div>
        <SidebarCollapse
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* School Card */}
      <div className="py-3">
        <SchoolCard collapsed={sidebarCollapsed} />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarNav collapsed={sidebarCollapsed} />
      </div>

      {/* Footer */}
      <div className="pb-4">
        <SidebarFooter collapsed={sidebarCollapsed} />
      </div>
    </motion.aside>
  );
}
