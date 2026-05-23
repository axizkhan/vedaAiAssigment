import { useInfiniteQuery } from "@tanstack/react-query";
import { DashboardService } from "../services/dashboard.service";
import { useDashboardStore } from "../stores/dashboard.store";
import { DASHBOARD_CONSTANTS } from "../constants/dashboard.constants";
import type { FetchAssignmentsParams } from "../types/dashboard.types";

export function useInfiniteAssignments() {
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const activeFilters = useDashboardStore((s) => s.activeFilters);

  return useInfiniteQuery({
    queryKey: ["assignments-infinite", { search: searchQuery, filters: activeFilters }],
    queryFn: ({ pageParam = 1 }) => {
      const params: FetchAssignmentsParams = {
        page: pageParam,
        limit: DASHBOARD_CONSTANTS.PAGINATION.INFINITE_SCROLL_LIMIT,
        search: searchQuery,
        status: activeFilters.status,
        subject: activeFilters.subject,
      };
      return DashboardService.fetchAssignments(params);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
  });
}
