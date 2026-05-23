"use client";

import { MOBILE_NAV_ITEMS } from "@/constants/navigation.constants";
import { MobileNavItem } from "./mobile-nav-item";

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {MOBILE_NAV_ITEMS.map((item) => (
        <MobileNavItem key={item.id} item={item} />
      ))}
    </nav>
  );
}
