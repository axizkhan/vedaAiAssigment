import {
  AssignmentStatus,
  AssignmentQuestionType,
  DifficultyDistribution,
} from '@assessment-ai/database';

export { AssignmentStatus };
export type { DifficultyDistribution };

export type QuestionType = AssignmentQuestionType;

export interface CreateAssignmentInput {
  title: string;
  subject: string;
  dueDate?: Date;
  instructions?: string;
  questionTypes: AssignmentQuestionType[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: DifficultyDistribution;
}

export type UpdateAssignmentInput = Partial<CreateAssignmentInput>;

export interface AssignmentListQuery {
  page: number;
  limit: number;
  status?: AssignmentStatus;
  subject?: string;
  sortBy: 'createdAt' | 'updatedAt' | 'dueDate' | 'title' | 'subject';
  sortOrder: 'asc' | 'desc';
}

export interface AssignmentFilters extends AssignmentListQuery {
  userId: string;
}

export interface AssignmentDTO {
  id: string;
  title: string;
  subject: string;
  dueDate?: Date;
  instructions?: string;
  questionTypes: AssignmentQuestionType[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: DifficultyDistribution;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}
