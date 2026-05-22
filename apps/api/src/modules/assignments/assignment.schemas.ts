import { z } from 'zod';
import { AssignmentQuestionType } from '@assessment-ai/database';
import { ASSIGNMENT_DEFAULT_LIMIT, ASSIGNMENT_DEFAULT_PAGE, ASSIGNMENT_MAX_PAGE_LIMIT, ASSIGNMENT_SORT_FIELDS } from './assignment.constants';
import { ASSIGNMENT_STATUS_VALUES } from './assignment.status';

const difficultyDistributionSchema = z.object({
  easy: z.number().int().min(0).max(100),
  medium: z.number().int().min(0).max(100),
  hard: z.number().int().min(0).max(100),
}).refine((value) => value.easy + value.medium + value.hard === 100, {
  message: 'Difficulty distribution must sum exactly to 100.',
});

const questionTypesSchema = z.array(z.nativeEnum(AssignmentQuestionType))
  .min(1)
  .refine((types) => new Set(types).size === types.length, 'Question types must not contain duplicates.');

export const createAssignmentSchema = z.object({
  title: z.string().trim().min(3).max(150),
  subject: z.string().trim().min(2).max(100).transform((subject) => subject.toLowerCase()),
  dueDate: z.coerce.date().optional(),
  instructions: z.string().trim().max(2000).optional(),
  questionTypes: questionTypesSchema,
  totalQuestions: z.number().int().min(1).max(200),
  totalMarks: z.number().int().min(1).max(1000),
  difficultyDistribution: difficultyDistributionSchema,
});

export const updateAssignmentSchema = createAssignmentSchema.partial().strict();

export const assignmentParamsSchema = z.object({
  id: z.string().trim().regex(/^[a-f\d]{24}$/i, 'Invalid assignment id.'),
});

export const assignmentListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(ASSIGNMENT_DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(ASSIGNMENT_MAX_PAGE_LIMIT).default(ASSIGNMENT_DEFAULT_LIMIT),
  status: z.enum(ASSIGNMENT_STATUS_VALUES as [string, ...string[]]).optional(),
  subject: z.string().trim().min(2).max(100).transform((subject) => subject.toLowerCase()).optional(),
  sortBy: z.enum(ASSIGNMENT_SORT_FIELDS).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
