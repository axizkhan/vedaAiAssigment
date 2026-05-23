"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { NavigationItem } from "@/types/layout.types";
import { isNavItemActive } from "@/lib/layout/navigation.utils";

interface SidebarItemProps {
  item: NavigationItem;
  collapsed: boolean;
}

export function SidebarItem({ item, collapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = isNavItemActive(item, pathname);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      className={`
        group relative flex items-center gap-3 rounded-md px-3 py-2.5
        transition-colors duration-150 focus-ring
        ${collapsed ? "justify-center" : ""}
        ${
          isActive
            ? "bg-accent-soft text-accent"
            : "text-foreground-muted hover:bg-surface-secondary hover:text-foreground"
        }
      `}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute inset-0 rounded-md bg-accent-soft"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          style={{ zIndex: 0 }}
        />
      )}
      <Icon className="relative z-10 h-5 w-5 flex-shrink-0" />
      {!collapsed && (
        <span className="relative z-10 text-small font-medium truncate">
          {item.label}
        </span>
      )}
      {!collapsed && item.badge && (
        <span className="relative z-10 ml-auto rounded-full bg-accent px-2 py-0.5 text-caption font-medium text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
