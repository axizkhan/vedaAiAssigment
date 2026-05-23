import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DashboardFilters, ViewMode } from "../types/dashboard.types";

interface DashboardState {
  searchQuery: string;
  activeFilters: DashboardFilters;
  viewMode: ViewMode;
  
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  clearFilters: () => void;
  setViewMode: (mode: ViewMode) => void;
  reset: () => void;
}

const initialFilters: DashboardFilters = {
  status: [],
  subject: [],
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      searchQuery: "",
      activeFilters: initialFilters,
      viewMode: "grid",

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilters: (filters) =>
        set((state) => ({
          activeFilters: { ...state.activeFilters, ...filters },
        })),
      clearFilters: () => set({ activeFilters: initialFilters }),
      setViewMode: (viewMode) => set({ viewMode }),
      reset: () =>
        set({
          searchQuery: "",
          activeFilters: initialFilters,
        }),
    }),
    {
      name: "veda-dashboard-state",
      partialize: (state) => ({
        viewMode: state.viewMode,
        activeFilters: state.activeFilters,
      }),
    }
  )
);
