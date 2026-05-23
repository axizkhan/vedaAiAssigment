"use client";

import { Building2 } from "lucide-react";

interface SchoolCardProps {
  collapsed: boolean;
}

export function SchoolCard({ collapsed }: SchoolCardProps) {
  return (
    <div
      className={`
        flex items-center gap-3 rounded-md bg-surface-secondary px-3 py-3 mx-3
        ${collapsed ? "justify-center" : ""}
      `}
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent text-primary-foreground">
        <Building2 className="h-5 w-5" />
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-small font-semibold text-foreground">
            Veda Academy
          </p>
          <p className="truncate text-caption text-foreground-muted">
            Administrator
          </p>
        </div>
      )}
    </div>
  );
}
