import { useDashboardStore } from "../stores/dashboard.store";

export function useAssignmentSearch() {
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);

  return {
    searchQuery,
    setSearchQuery,
  };
}
