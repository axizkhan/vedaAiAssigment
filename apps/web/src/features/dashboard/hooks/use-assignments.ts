import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "../services/dashboard.service";
import { useDashboardStore } from "../stores/dashboard.store";
import { DASHBOARD_CONSTANTS } from "../constants/dashboard.constants";
import type { FetchAssignmentsParams } from "../types/dashboard.types";

export function useAssignments(page = 1) {
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const activeFilters = useDashboardStore((s) => s.activeFilters);

  const params: FetchAssignmentsParams = {
    page,
    limit: DASHBOARD_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
    search: searchQuery,
    status: activeFilters.status,
    subject: activeFilters.subject,
  };

  return useQuery({
    queryKey: ["assignments", params],
    queryFn: () => DashboardService.fetchAssignments(params),
    placeholderData: (prev) => prev, // keeps old data visible while fetching new
  });
}
