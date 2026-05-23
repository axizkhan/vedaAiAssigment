"use client";

import { Menu } from "lucide-react";
import { useMobileNav } from "@/hooks/use-mobile-nav";

export function MobileMenuToggle() {
  const { toggleMobileDrawer } = useMobileNav();

  return (
    <button
      onClick={toggleMobileDrawer}
      aria-label="Open menu"
      className="flex h-10 w-10 items-center justify-center rounded-md
        text-foreground-muted transition-colors duration-150
        hover:bg-surface-secondary hover:text-foreground
        focus-ring lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
