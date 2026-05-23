"use client";

import { SIDEBAR_NAV_ITEMS } from "@/constants/navigation.constants";
import { SidebarItem } from "./sidebar-item";

interface SidebarNavProps {
  collapsed: boolean;
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 px-3">
      {SIDEBAR_NAV_ITEMS.map((item) => (
        <SidebarItem key={item.id} item={item} collapsed={collapsed} />
      ))}
    </nav>
  );
}
