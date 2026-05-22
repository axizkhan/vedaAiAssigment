import { AssignmentStatus } from '@assessment-ai/database';
import { AssignmentListQuery } from './assignment.types';

export interface SafeAssignmentQuery {
  createdBy: string;
  page: number;
  limit: number;
  status?: AssignmentStatus;
  subject?: string;
  sortBy: AssignmentListQuery['sortBy'];
  sortOrder: AssignmentListQuery['sortOrder'];
}

export function buildSafeAssignmentFilters(userId: string, query: AssignmentListQuery): SafeAssignmentQuery {
  return {
    createdBy: userId,
    page: query.page,
    limit: query.limit,
    ...(query.status ? { status: query.status } : {}),
    ...(query.subject ? { subject: query.subject.toLowerCase() } : {}),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  };
}
