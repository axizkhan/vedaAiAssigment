import { AssignmentStatus } from './assignment.types';
import { Types } from 'mongoose';

export interface AssignmentFilters {
  page: number;
  limit: number;
  status?: AssignmentStatus;
  subject?: string;
  createdBy: Types.ObjectId | string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'title' | 'subject';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedAssignments<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
