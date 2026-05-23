import { useDashboardStore } from "../stores/dashboard.store";
import type { AssignmentStatus } from "../types/dashboard.types";

export function useAssignmentFilters() {
  const activeFilters = useDashboardStore((s) => s.activeFilters);
  const setFilters = useDashboardStore((s) => s.setFilters);
  const clearFilters = useDashboardStore((s) => s.clearFilters);

  const activeFilterCount = activeFilters.status.length + activeFilters.subject.length;

  const setStatusFilters = (status: string[]) => {
    setFilters({ status: status as AssignmentStatus[] });
  };

  return {
    activeFilters,
    setFilters,
    clearFilters,
    setStatusFilters,
    activeFilterCount,
  };
}
