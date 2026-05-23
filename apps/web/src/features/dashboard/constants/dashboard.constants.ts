import type { AssignmentStatus } from "../types/dashboard.types";

export const DASHBOARD_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    INFINITE_SCROLL_LIMIT: 12,
  },
  DEBOUNCE: {
    SEARCH: 400,
  },
};

export const ASSIGNMENT_STATUS_FILTERS: { label: string; value: AssignmentStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Queued", value: "queued" },
  { label: "Generating", value: "generating" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];
