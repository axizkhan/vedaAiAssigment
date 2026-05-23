"use client";

import { motion } from "framer-motion";
import { DesktopSidebar } from "./sidebar/desktop-sidebar";
import { MobileDrawer } from "./mobile/mobile-drawer";
import { MobileBottomNav } from "./mobile/mobile-bottom-nav";
import { TopNavbar } from "./navbar/top-navbar";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  SIDEBAR_WIDTH_EXPANDED,
  SIDEBAR_WIDTH_COLLAPSED,
} from "@/constants/navigation.constants";
import type { BreadcrumbItem } from "@/types/layout.types";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  const { sidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed
    ? SIDEBAR_WIDTH_COLLAPSED
    : SIDEBAR_WIDTH_EXPANDED;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Main Content Area */}
      <motion.div
        animate={{ marginLeft: sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex min-h-screen flex-col lg:ml-0"
        style={{ marginLeft: 0 }}
      >
        <TopNavbar breadcrumbs={breadcrumbs} />

        <main className="flex-1">
          {children}
        </main>
      </motion.div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
