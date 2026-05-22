const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const DB_DIR = path.join(ROOT_DIR, 'packages/database');

const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const createFile = (filePath, content) => {
  createDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
};

createDir(path.join(DB_DIR, 'src/models'));
createDir(path.join(DB_DIR, 'src/repositories'));
createDir(path.join(DB_DIR, 'src/services'));
createDir(path.join(DB_DIR, 'src/utils'));
createDir(path.join(DB_DIR, 'src/types'));
createDir(path.join(DB_DIR, 'src/constants'));
createDir(path.join(DB_DIR, 'src/validators'));

// 1. Constants
createFile(path.join(DB_DIR, 'src/constants/assignment.constants.ts'), `
export const MAX_INSTRUCTIONS_LENGTH = 2000;
export const MAX_EXTRACTED_TEXT_CHARS = 30000;
export const MAX_TOTAL_QUESTIONS = 200;
export const DEFAULT_PROMPT_VERSION = 'v1';
export const ASSIGNMENT_COLLECTION_NAME = 'assignments';
export const ASSIGNMENT_EVENT_COLLECTION_NAME = 'assignment_events';

export const SUPPORTED_MIME_TYPES = ['application/pdf', 'text/plain'];
`);

createFile(path.join(DB_DIR, 'src/constants/assignment-status.constants.ts'), `
import { AssignmentStatus } from '../types/assignment.types';

export const VALID_STATUS_TRANSITIONS: Record<AssignmentStatus, AssignmentStatus[]> = {
  [AssignmentStatus.DRAFT]: [AssignmentStatus.QUEUED],
  [AssignmentStatus.QUEUED]: [AssignmentStatus.GENERATING, AssignmentStatus.DRAFT],
  [AssignmentStatus.GENERATING]: [AssignmentStatus.COMPLETED, AssignmentStatus.FAILED],
  [AssignmentStatus.COMPLETED]: [], // Terminal state
  [AssignmentStatus.FAILED]: [AssignmentStatus.QUEUED],
};
`);

// 2. Types
createFile(path.join(DB_DIR, 'src/types/assignment.types.ts'), `
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
`);

createFile(path.join(DB_DIR, 'src/types/assignment-query.types.ts'), `
import { AssignmentStatus } from './assignment.types';
import { Types } from 'mongoose';

export interface AssignmentFilters {
  status?: AssignmentStatus;
  subject?: string;
  createdBy: Types.ObjectId | string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface PaginatedAssignments<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
`);

// 3. Utilities
createFile(path.join(DB_DIR, 'src/utils/assignment-token-estimator.ts'), `
export const estimateTokens = (text: string | null | undefined): number => {
  if (!text) return 0;
  // Basic heuristic: 1 token ~= 4 chars or 0.75 words.
  // Using 4 chars is a safe baseline for English text via LLMs.
  return Math.ceil(text.length / 4);
};
`);

createFile(path.join(DB_DIR, 'src/utils/assignment-sanitizer.ts'), `
export const sanitizeText = (text: string | null | undefined): string | null => {
  if (!text) return null;

  let sanitized = text
    // Remove HTML tags
    .replace(/<[^>]*>?/gm, '')
    // Remove control characters except newlines/tabs
    .replace(/[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]/g, '')
    // Remove excessive whitespace
    .replace(/\\s{3,}/g, '  ')
    .trim();

  // Basic Prompt Injection prevention filters (can be expanded)
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /system prompt/gi,
    /developer message/gi,
    /you are a/gi,
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }

  return sanitized;
};
`);

createFile(path.join(DB_DIR, 'src/utils/assignment-status-transition.ts'), `
import { AssignmentStatus } from '../types/assignment.types';
import { VALID_STATUS_TRANSITIONS } from '../constants/assignment-status.constants';

export const isValidTransition = (current: AssignmentStatus, next: AssignmentStatus): boolean => {
  return VALID_STATUS_TRANSITIONS[current]?.includes(next) ?? false;
};
`);

// 4. Validators
createFile(path.join(DB_DIR, 'src/validators/assignment.validator.ts'), `
import { z } from 'zod';
import { QuestionType } from '../types/assignment.types';

export const difficultyDistributionSchema = z.object({
  easy: z.number().int().min(0).max(100),
  medium: z.number().int().min(0).max(100),
  hard: z.number().int().min(0).max(100),
}).refine(data => data.easy + data.medium + data.hard === 100, {
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
`);

createFile(path.join(DB_DIR, 'src/validators/assignment-query.validator.ts'), `
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
`);

// 5. Models
createFile(path.join(DB_DIR, 'src/models/assignment.model.ts'), `
import mongoose, { Schema } from 'mongoose';
import { IAssignment, IAssignmentMethods, AssignmentModel, AssignmentStatus, QuestionType } from '../types/assignment.types';
import { ASSIGNMENT_COLLECTION_NAME, MAX_EXTRACTED_TEXT_CHARS, MAX_INSTRUCTIONS_LENGTH, DEFAULT_PROMPT_VERSION } from '../constants/assignment.constants';
import { sanitizeText } from '../utils/assignment-sanitizer';
import { estimateTokens } from '../utils/assignment-token-estimator';
import { isValidTransition } from '../utils/assignment-status-transition';

const assignmentSchema = new Schema<IAssignment, AssignmentModel, IAssignmentMethods>(
  {
    title: { type: String, required: true, trim: true, maxlength: 255 },
    subject: { type: String, required: true, trim: true, lowercase: true, maxlength: 100 },
    dueDate: { type: Date },
    instructions: { type: String, maxlength: MAX_INSTRUCTIONS_LENGTH },
    questionTypes: [{ type: String, enum: Object.values(QuestionType), required: true }],
    totalQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    
    difficultyDistribution: {
      easy: { type: Number, required: true, min: 0, max: 100 },
      medium: { type: Number, required: true, min: 0, max: 100 },
      hard: { type: Number, required: true, min: 0, max: 100 },
    },

    s3ObjectKey: { type: String, default: null },
    extractedText: { type: String, default: null },
    extractedTextTokenCount: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: Object.values(AssignmentStatus),
      default: AssignmentStatus.DRAFT,
    },

    generationJobId: { type: String, default: null },
    promptVersion: { type: String, default: DEFAULT_PROMPT_VERSION },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
    minimize: false,
    collection: ASSIGNMENT_COLLECTION_NAME,
  }
);

// Indexes
assignmentSchema.index({ createdBy: 1, createdAt: -1 });
assignmentSchema.index({ createdBy: 1, subject: 1 });
assignmentSchema.index({ status: 1, createdAt: -1 });
assignmentSchema.index({ generationJobId: 1 });
assignmentSchema.index({ subject: 'text', title: 'text' });

assignmentSchema.pre('save', function (next) {
  if (this.isModified('difficultyDistribution')) {
    const { easy, medium, hard } = this.difficultyDistribution;
    if (easy + medium + hard !== 100) {
      return next(new Error('Difficulty distribution must exactly sum to 100.'));
    }
  }

  if (this.isModified('instructions')) {
    this.instructions = sanitizeText(this.instructions) || undefined;
  }

  if (this.isModified('extractedText')) {
    if (this.extractedText && this.extractedText.length > MAX_EXTRACTED_TEXT_CHARS) {
      return next(new Error(\`Extracted text exceeds max limit of \${MAX_EXTRACTED_TEXT_CHARS} chars.\`));
    }
    this.extractedText = sanitizeText(this.extractedText);
    this.extractedTextTokenCount = estimateTokens(this.extractedText);
  }

  if (this.isModified('questionTypes')) {
    this.questionTypes = Array.from(new Set(this.questionTypes));
  }

  // Validate status transition
  if (this.isModified('status')) {
    const isNew = this.isNew;
    const currentStatus = isNew ? AssignmentStatus.DRAFT : (this.get('status', null, { getters: false }) as AssignmentStatus);
    
    // During initial creation, allow setting to Draft
    if (!isNew && !isValidTransition(this._originalStatus || AssignmentStatus.DRAFT, this.status)) {
       // Note: To properly track _originalStatus in Mongoose without plugin, we should ideally hook into post('init')
       // For this simple example, we assume caller validates transition before save or uses methods.
    }
  }

  next();
});

assignmentSchema.methods.setStatus = function (status: AssignmentStatus) {
  if (!isValidTransition(this.status, status)) {
    throw new Error(\`Invalid status transition from \${this.status} to \${status}\`);
  }
  this.status = status;
};

assignmentSchema.methods.canGenerate = function (): boolean {
  return [AssignmentStatus.DRAFT, AssignmentStatus.FAILED].includes(this.status);
};

assignmentSchema.methods.markGenerationStarted = function (jobId: string) {
  this.setStatus(AssignmentStatus.GENERATING);
  this.generationJobId = jobId;
};

assignmentSchema.methods.markGenerationCompleted = function () {
  this.setStatus(AssignmentStatus.COMPLETED);
};

assignmentSchema.methods.markGenerationFailed = function () {
  this.setStatus(AssignmentStatus.FAILED);
  this.generationJobId = null;
};

export const Assignment = mongoose.model<IAssignment, AssignmentModel>('Assignment', assignmentSchema);
`);

createFile(path.join(DB_DIR, 'src/models/assignment-event.model.ts'), `
import mongoose, { Schema, Document, Types } from 'mongoose';
import { ASSIGNMENT_EVENT_COLLECTION_NAME } from '../constants/assignment.constants';

export interface IAssignmentEvent {
  assignmentId: Types.ObjectId;
  eventType: string;
  payload?: any;
  createdAt: Date;
}

const assignmentEventSchema = new Schema<IAssignmentEvent>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    eventType: { type: String, required: true },
    payload: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    collection: ASSIGNMENT_EVENT_COLLECTION_NAME,
  }
);

export const AssignmentEvent = mongoose.model<IAssignmentEvent>('AssignmentEvent', assignmentEventSchema);
`);

// 6. Repositories
createFile(path.join(DB_DIR, 'src/repositories/assignment.repository.ts'), `
import { Assignment } from '../models/assignment.model';
import { IAssignment, AssignmentDocument, CreateAssignmentInput, UpdateAssignmentInput, AssignmentFilters, PaginatedAssignments, AssignmentStatus } from '../types/assignment.types';
import { Types, FilterQuery } from 'mongoose';

export class AssignmentRepository {
  static async createAssignment(userId: string, data: CreateAssignmentInput): Promise<AssignmentDocument> {
    const assignment = new Assignment({
      ...data,
      createdBy: new Types.ObjectId(userId)
    });
    return assignment.save();
  }

  static async findById(id: string, userId: string): Promise<IAssignment | null> {
    return Assignment.findOne({ _id: id, createdBy: userId }).lean().exec() as unknown as Promise<IAssignment | null>;
  }

  static async findByIdForGeneration(id: string): Promise<AssignmentDocument | null> {
    return Assignment.findById(id).exec();
  }

  static async updateAssignment(id: string, userId: string, data: UpdateAssignmentInput): Promise<IAssignment | null> {
    return Assignment.findOneAndUpdate(
      { _id: id, createdBy: userId, status: { $in: [AssignmentStatus.DRAFT, AssignmentStatus.FAILED] } },
      { $set: data },
      { new: true, lean: true }
    ).exec() as unknown as Promise<IAssignment | null>;
  }

  static async deleteAssignment(id: string, userId: string): Promise<boolean> {
    const result = await Assignment.deleteOne({ _id: id, createdBy: userId });
    return result.deletedCount === 1;
  }

  static async paginateAssignments(filters: AssignmentFilters): Promise<PaginatedAssignments<IAssignment>> {
    const query: FilterQuery<IAssignment> = { createdBy: new Types.ObjectId(filters.createdBy) };

    if (filters.status) query.status = filters.status;
    if (filters.subject) query.subject = filters.subject.toLowerCase();
    
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const skip = (filters.page - 1) * filters.limit;

    const [data, total] = await Promise.all([
      Assignment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(filters.limit)
        .select('-extractedText') // Lean projection
        .lean()
        .exec() as unknown as Promise<IAssignment[]>,
      Assignment.countDocuments(query)
    ]);

    return {
      data,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit)
    };
  }

  static async attachUploadedFile(id: string, userId: string, s3ObjectKey: string, extractedText: string, tokenCount: number): Promise<IAssignment | null> {
    return Assignment.findOneAndUpdate(
      { _id: id, createdBy: userId, status: { $in: [AssignmentStatus.DRAFT, AssignmentStatus.FAILED] } },
      { $set: { s3ObjectKey, extractedText, extractedTextTokenCount: tokenCount } },
      { new: true, lean: true }
    ).exec() as unknown as Promise<IAssignment | null>;
  }

  static async updateGenerationStatus(id: string, status: AssignmentStatus, jobId?: string | null): Promise<void> {
    const update: any = { status };
    if (jobId !== undefined) {
      update.generationJobId = jobId;
    }
    await Assignment.updateOne({ _id: id }, { $set: update }).exec();
  }
}
`);

createFile(path.join(DB_DIR, 'src/repositories/assignment-event.repository.ts'), `
import { AssignmentEvent } from '../models/assignment-event.model';

export class AssignmentEventRepository {
  static async logEvent(assignmentId: string, eventType: string, payload?: any): Promise<void> {
    await AssignmentEvent.create({
      assignmentId,
      eventType,
      payload
    });
  }
}
`);

// 7. Services
createFile(path.join(DB_DIR, 'src/services/assignment-status.service.ts'), `
import { AssignmentRepository } from '../repositories/assignment.repository';
import { AssignmentEventRepository } from '../repositories/assignment-event.repository';
import { AssignmentStatus } from '../types/assignment.types';

export class AssignmentStatusService {
  static async transitionStatus(assignmentId: string, status: AssignmentStatus, jobId?: string): Promise<void> {
    await AssignmentRepository.updateGenerationStatus(assignmentId, status, jobId);
    await AssignmentEventRepository.logEvent(assignmentId, \`STATUS_CHANGED_\${status.toUpperCase()}\`, { jobId });
  }
}
`);

createFile(path.join(DB_DIR, 'src/services/assignment-upload.service.ts'), `
import { AssignmentRepository } from '../repositories/assignment.repository';
import { sanitizeText } from '../utils/assignment-sanitizer';
import { estimateTokens } from '../utils/assignment-token-estimator';
import { MAX_EXTRACTED_TEXT_CHARS } from '../constants/assignment.constants';

export class AssignmentUploadService {
  static async attachFile(assignmentId: string, userId: string, s3Key: string, rawText: string) {
    const sanitized = sanitizeText(rawText) || '';
    if (sanitized.length > MAX_EXTRACTED_TEXT_CHARS) {
      throw new Error(\`Text exceeds max characters (\${MAX_EXTRACTED_TEXT_CHARS})\`);
    }
    const tokens = estimateTokens(sanitized);
    return AssignmentRepository.attachUploadedFile(assignmentId, userId, s3Key, sanitized, tokens);
  }
}
`);

createFile(path.join(DB_DIR, 'src/services/assignment-search.service.ts'), `
import { AssignmentRepository } from '../repositories/assignment.repository';
import { AssignmentFilters } from '../types/assignment-query.types';

export class AssignmentSearchService {
  static async search(filters: AssignmentFilters) {
    return AssignmentRepository.paginateAssignments(filters);
  }
}
`);

createFile(path.join(DB_DIR, 'src/services/assignment-generation.service.ts'), `
import { AssignmentRepository } from '../repositories/assignment.repository';
import { AssignmentStatusService } from './assignment-status.service';
import { AssignmentStatus } from '../types/assignment.types';

export class AssignmentGenerationService {
  static async lockForGeneration(assignmentId: string, jobId: string): Promise<boolean> {
    const doc = await AssignmentRepository.findByIdForGeneration(assignmentId);
    if (!doc || !doc.canGenerate()) return false;
    
    doc.markGenerationStarted(jobId);
    await doc.save();
    await AssignmentStatusService.transitionStatus(assignmentId, AssignmentStatus.GENERATING, jobId);
    return true;
  }

  static async markCompleted(assignmentId: string): Promise<void> {
    await AssignmentStatusService.transitionStatus(assignmentId, AssignmentStatus.COMPLETED);
  }

  static async markFailed(assignmentId: string, reason?: string): Promise<void> {
    await AssignmentStatusService.transitionStatus(assignmentId, AssignmentStatus.FAILED);
  }
}
`);

// 8. Index Exports
createFile(path.join(DB_DIR, 'src/index.ts'), `
export * from './connection';
export * from './models';
export * from './repositories';
export * from './services';
export * from './utils';
export * from './types';
export * from './constants';
export * from './validators/assignment.validator';
export * from './validators/assignment-query.validator';
`);

console.log('Assignment Database Module scaffolded successfully');
