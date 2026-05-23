"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut } from "lucide-react";

interface SidebarFooterProps {
  collapsed: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-border px-3 pt-3">
      {!collapsed && <ThemeToggle />}
      <button
        aria-label="Logout"
        title={collapsed ? "Logout" : undefined}
        className={`
          flex items-center gap-3 rounded-md px-3 py-2.5
          text-foreground-muted transition-colors duration-150
          hover:bg-surface-secondary hover:text-danger focus-ring
          ${collapsed ? "justify-center" : ""}
        `}
      >
        <LogOut className="h-5 w-5 flex-shrink-0" />
        {!collapsed && (
          <span className="text-small font-medium">Logout</span>
        )}
      </button>
    </div>
  );
}
