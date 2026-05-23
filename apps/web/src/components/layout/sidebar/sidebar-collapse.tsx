"use client";

import { PanelLeftClose, PanelLeft } from "lucide-react";

interface SidebarCollapseProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarCollapse({ collapsed, onToggle }: SidebarCollapseProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="flex h-8 w-8 items-center justify-center rounded-md
        text-foreground-muted transition-colors duration-150
        hover:bg-surface-secondary hover:text-foreground focus-ring"
    >
      {collapsed ? (
        <PanelLeft className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </button>
  );
}
