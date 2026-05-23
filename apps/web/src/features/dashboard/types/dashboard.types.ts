export type AssignmentStatus = "draft" | "queued" | "generating" | "completed" | "failed";

export interface Assignment {
  id: string;
  title: string;
  status: AssignmentStatus;
  subject?: string;
  dueDate?: string;
  questionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = "grid" | "list";

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardFilters {
  status: AssignmentStatus[];
  subject: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationState;
}

export interface FetchAssignmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AssignmentStatus[];
  subject?: string[];
}
