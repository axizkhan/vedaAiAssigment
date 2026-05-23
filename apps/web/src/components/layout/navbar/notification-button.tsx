"use client";

import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button
      aria-label="Notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-md
        text-foreground-muted transition-colors duration-150
        hover:bg-surface-secondary hover:text-foreground focus-ring"
    >
      <Bell className="h-5 w-5" />
      {/* Future: badge indicator */}
    </button>
  );
}
