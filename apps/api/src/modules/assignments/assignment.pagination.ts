import { ApiMeta } from '../../common/response';
import { ASSIGNMENT_DEFAULT_LIMIT, ASSIGNMENT_DEFAULT_PAGE, ASSIGNMENT_MAX_PAGE_LIMIT } from './assignment.constants';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface NormalizedPagination {
  page: number;
  limit: number;
  skip: number;
}

export function normalizePagination(input: PaginationOptions): NormalizedPagination {
  const page = Math.max(input.page ?? ASSIGNMENT_DEFAULT_PAGE, 1);
  const limit = Math.min(Math.max(input.limit ?? ASSIGNMENT_DEFAULT_LIMIT, 1), ASSIGNMENT_MAX_PAGE_LIMIT);
  return { page, limit, skip: (page - 1) * limit };
}

export function createPaginationMeta(page: number, limit: number, total: number): ApiMeta {
  return { page, limit, total };
}
