import { Document, Model, Types } from 'mongoose';

export enum AssignmentStatus {
  DRAFT = 'draft',
  QUEUED = 'queued',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum QuestionType {
  MCQ = 'mcq',
  SHORT = 'short',
  LONG = 'long',
  TRUE_FALSE = 'true-false'
}

export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface IAssignment {
  title: string;
  subject: string;
  dueDate?: Date;
  instructions?: string;
  questionTypes: QuestionType[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: DifficultyDistribution;
  s3ObjectKey: string | null;
  extractedText: string | null;
  extractedTextTokenCount: number;
  status: AssignmentStatus;
  generationJobId: string | null;
  promptVersion: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignmentMethods {
  canGenerate(): boolean;
  markGenerationStarted(jobId: string): void;
  markGenerationCompleted(): void;
  markGenerationFailed(): void;
  setStatus(status: AssignmentStatus): void;
}

export interface AssignmentModel extends Model<IAssignment, {}, IAssignmentMethods> {}

export type AssignmentDocument = Document<Types.ObjectId, {}, IAssignment> & IAssignment & IAssignmentMethods & { _id: Types.ObjectId };

export interface CreateAssignmentInput extends Partial<Omit<IAssignment, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>> {
  title: string;
  subject: string;
  questionTypes: QuestionType[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: DifficultyDistribution;
}

export interface UpdateAssignmentInput extends Partial<Omit<IAssignment, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status' | 's3ObjectKey' | 'extractedText' | 'extractedTextTokenCount' | 'generationJobId'>> {}
