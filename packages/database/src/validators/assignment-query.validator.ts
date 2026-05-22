import { z } from 'zod';
import { AssignmentStatus } from '../types/assignment.types';

export const assignmentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.nativeEnum(AssignmentStatus).optional(),
  subject: z.string().optional(),
  search: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
