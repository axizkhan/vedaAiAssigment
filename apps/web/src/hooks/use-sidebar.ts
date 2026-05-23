"use client";

import { useLayoutStore } from "@/stores/layout.store";

export function useSidebar() {
  const sidebarCollapsed = useLayoutStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);
  const setSidebarCollapsed = useLayoutStore((s) => s.setSidebarCollapsed);

  return { sidebarCollapsed, toggleSidebar, setSidebarCollapsed };
}
