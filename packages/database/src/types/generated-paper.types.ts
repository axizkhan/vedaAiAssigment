import type { FlattenMaps, HydratedDocument, InferSchemaType, Model, Types } from 'mongoose';
import type { generatedPaperSchema } from '../models/generated-paper.model';

export type LeanDocument<T> = FlattenMaps<T> & { _id: Types.ObjectId };

export enum QuestionType {
  MCQ = 'mcq',
  SHORT = 'short',
  LONG = 'long',
  TRUE_FALSE = 'true-false',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum BloomsLevel {
  REMEMBER = 'remember',
  UNDERSTAND = 'understand',
  APPLY = 'apply',
  ANALYZE = 'analyze',
  EVALUATE = 'evaluate',
  CREATE = 'create',
}

export enum PaperPdfState {
  NOT_GENERATED = 'not-generated',
  GENERATED = 'generated',
  STALE = 'stale',
}

export interface IPaperQuestion {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  marks: number;
  options: string[] | null;
  bloomsLevel: BloomsLevel | null;
}

export interface IPaperSection {
  id: string;
  title: string;
  instruction: string;
  questions: IPaperQuestion[];
}

export interface IPaperMetadata {
  model: string;
  inputTokens: number;
  outputTokens: number;
  generationDurationMs: number;
  retryCount: number;
  estimatedCost: number;
  provider?: string;
  traceId?: string;
}

export interface IPaperVersion {
  version: number;
  sections: IPaperSection[];
  metadata: IPaperMetadata;
  pdfS3Key: string | null;
  pdfGeneratedAt: Date | null;
  createdAt: Date;
}

export interface IGeneratedPaper {
  assignmentId: Types.ObjectId;
  activeVersion: number;
  versions: IPaperVersion[];
  createdAt: Date;
  updatedAt: Date;
}

export type GeneratedPaperSchemaType = InferSchemaType<typeof generatedPaperSchema>;
export type GeneratedPaperDocument = HydratedDocument<IGeneratedPaper>;
export type GeneratedPaperModel = Model<IGeneratedPaper>;
export type GeneratedPaperLeanDocument = LeanDocument<IGeneratedPaper>;

export interface CreatePaperVersionInput {
  assignmentId: string | Types.ObjectId;
  sections: IPaperSection[];
  metadata: IPaperMetadata;
  makeActive?: boolean;
  traceId?: string;
}

export interface CreateGeneratedPaperInput extends CreatePaperVersionInput {}

export interface RegenerateSectionInput {
  assignmentId: string | Types.ObjectId;
  sectionId: string;
  replacementSection: IPaperSection;
  metadata: IPaperMetadata;
  makeActive?: boolean;
  traceId?: string;
}

export interface UpdateActiveVersionInput {
  assignmentId: string | Types.ObjectId;
  version: number;
  traceId?: string;
}

export interface PaperAccessScope {
  userId?: string | Types.ObjectId;
  adminOverride?: boolean;
}

export interface PaperPaginationInput extends PaperAccessScope {
  page?: number;
  limit?: number;
  assignmentIds?: Array<string | Types.ObjectId>;
}

export interface PaginatedGeneratedPapers<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaperVersionSummary {
  version: number;
  totalSections: number;
  totalQuestions: number;
  totalMarks: number;
  model: string;
  retryCount: number;
  estimatedCost: number;
  pdfS3Key: string | null;
  pdfGeneratedAt: Date | null;
  createdAt: Date;
}

export interface PaperAnalytics {
  assignmentId: Types.ObjectId;
  activeVersion: number;
  version: number;
  totalSections: number;
  totalQuestions: number;
  totalMarks: number;
  averageMarksPerQuestion: number;
  difficultyDistribution: Record<DifficultyLevel, number>;
  difficultyPercentages: Record<DifficultyLevel, number>;
  questionTypeDistribution: Record<QuestionType, number>;
  bloomsTaxonomyDistribution: Record<BloomsLevel, number>;
  estimatedAiCost: number;
  inputTokens: number;
  outputTokens: number;
  generationDurationMs: number;
  retryCount: number;
  pdfState: PaperPdfState;
}

export interface PaperVersionDiffQuestionChange {
  id: string;
  changeType: 'added' | 'removed' | 'changed' | 'unchanged';
  before?: IPaperQuestion;
  after?: IPaperQuestion;
}

export interface PaperVersionDiff {
  fromVersion: number;
  toVersion: number;
  addedSectionIds: string[];
  removedSectionIds: string[];
  changedQuestions: PaperVersionDiffQuestionChange[];
}
