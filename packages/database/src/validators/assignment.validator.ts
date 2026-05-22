import { z } from 'zod';
import { QuestionType } from '../types/assignment.types';

export const difficultyDistributionSchema = z.object({
  easy: z.number().int().min(0).max(100),
  medium: z.number().int().min(0).max(100),
  hard: z.number().int().min(0).max(100),
}).refine((data: { easy: number; medium: number; hard: number }) => data.easy + data.medium + data.hard === 100, {
  message: "Difficulty distribution must sum exactly to 100",
  path: ['easy'] // attaches error to this field
});

export const createAssignmentSchema = z.object({
  title: z.string().trim().min(3).max(255),
  subject: z.string().trim().min(2).max(100),
  dueDate: z.date().optional(),
  instructions: z.string().max(2000).optional(),
  questionTypes: z.array(z.nativeEnum(QuestionType)).min(1),
  totalQuestions: z.number().int().min(1).max(200),
  totalMarks: z.number().int().min(1),
  difficultyDistribution: difficultyDistributionSchema
});
