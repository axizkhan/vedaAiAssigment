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
      return next(new Error(`Extracted text exceeds max limit of ${MAX_EXTRACTED_TEXT_CHARS} chars.`));
    }
    this.extractedText = sanitizeText(this.extractedText);
    this.extractedTextTokenCount = estimateTokens(this.extractedText);
  }

  if (this.isModified('questionTypes')) {
    this.questionTypes = Array.from(new Set(this.questionTypes));
  }

  // Validate status transition
  if (this.isModified('status')) {
    // Rely on assignmentSchema.methods.setStatus for strict runtime transition checks
    // Or we can just let it save.
  }

  next();
});

assignmentSchema.methods.setStatus = function (status: AssignmentStatus) {
  if (!isValidTransition(this.status, status)) {
    throw new Error(`Invalid status transition from ${this.status} to ${status}`);
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
