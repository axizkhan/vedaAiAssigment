import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LayoutState } from "@/types/layout.types";

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileDrawerOpen: false,

      setSidebarCollapsed: (collapsed: boolean) =>
        set({ sidebarCollapsed: collapsed }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setMobileDrawerOpen: (open: boolean) =>
        set({ mobileDrawerOpen: open }),

      toggleMobileDrawer: () =>
        set((state) => ({ mobileDrawerOpen: !state.mobileDrawerOpen })),

      closeMobileDrawer: () => set({ mobileDrawerOpen: false }),
    }),
    {
      name: "veda-layout-state",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
