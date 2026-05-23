"use client";

import { useLayoutStore } from "@/stores/layout.store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useMobileNav() {
  const mobileDrawerOpen = useLayoutStore((s) => s.mobileDrawerOpen);
  const toggleMobileDrawer = useLayoutStore((s) => s.toggleMobileDrawer);
  const closeMobileDrawer = useLayoutStore((s) => s.closeMobileDrawer);

  const pathname = usePathname();

  // Auto-close drawer on route change
  useEffect(() => {
    closeMobileDrawer();
  }, [pathname, closeMobileDrawer]);

  return { mobileDrawerOpen, toggleMobileDrawer, closeMobileDrawer };
}
