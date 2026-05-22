import { Schema } from 'mongoose';
import {
  COST_DECIMAL_PLACES,
  MAX_OPTION_TEXT_LENGTH,
  MAX_OPTIONS_PER_MCQ,
  MAX_QUESTION_TEXT_LENGTH,
  MAX_QUESTIONS_PER_SECTION,
  MAX_SECTION_INSTRUCTION_LENGTH,
  MAX_SECTION_TITLE_LENGTH,
  MAX_SECTIONS,
  MAX_TOTAL_QUESTIONS,
  MIN_OPTIONS_PER_MCQ,
  SUPPORTED_BLOOMS_LEVELS,
  SUPPORTED_DIFFICULTY_LEVELS,
  SUPPORTED_QUESTION_TYPES,
} from '../constants/generated-paper.constants';
import { BloomsLevel, DifficultyLevel, IPaperMetadata, IPaperQuestion, IPaperSection, IPaperVersion, QuestionType } from '../types/generated-paper.types';
import { sanitizeText } from '../utils/assignment-sanitizer';

const hasDuplicates = (values: string[]): boolean => new Set(values.map((value) => value.trim().toLowerCase())).size !== values.length;

export const paperQuestionSchema = new Schema<IPaperQuestion>(
  {
    id: { type: String, required: true, trim: true, maxlength: 120 },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: MAX_QUESTION_TEXT_LENGTH,
      set: (value: string) => sanitizeText(value) ?? '',
    },
    type: { type: String, enum: SUPPORTED_QUESTION_TYPES, required: true },
    difficulty: { type: String, enum: SUPPORTED_DIFFICULTY_LEVELS, required: true },
    marks: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Question marks must be a positive integer.',
      },
    },
    options: {
      type: [String],
      default: null,
      validate: {
        validator(this: IPaperQuestion, options: string[] | null): boolean {
          if (this.type === QuestionType.MCQ) {
            return Array.isArray(options)
              && options.length === MAX_OPTIONS_PER_MCQ
              && options.every((option) => option.trim().length > 0 && option.length <= MAX_OPTION_TEXT_LENGTH)
              && !hasDuplicates(options);
          }

          return options === null || options === undefined;
        },
        message: 'MCQ questions require four unique non-empty options; non-MCQ questions must not include options.',
      },
      set: (options: string[] | null) => Array.isArray(options) ? options.map((option) => sanitizeText(option)?.trim() ?? '') : null,
    },
    bloomsLevel: { type: String, enum: SUPPORTED_BLOOMS_LEVELS, default: null },
  },
  { _id: false, id: false, strict: true, minimize: false }
);

export const paperSectionSchema = new Schema<IPaperSection>(
  {
    id: { type: String, required: true, trim: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: MAX_SECTION_TITLE_LENGTH, set: (value: string) => sanitizeText(value) ?? '' },
    instruction: { type: String, trim: true, maxlength: MAX_SECTION_INSTRUCTION_LENGTH, default: '', set: (value: string) => sanitizeText(value) ?? '' },
    questions: {
      type: [paperQuestionSchema],
      required: true,
      validate: [
        {
          validator: (questions: IPaperQuestion[]) => questions.length >= 1 && questions.length <= MAX_QUESTIONS_PER_SECTION,
          message: `Sections must include between 1 and ${MAX_QUESTIONS_PER_SECTION} questions.`,
        },
        {
          validator: (questions: IPaperQuestion[]) => !hasDuplicates(questions.map((question) => question.id)),
          message: 'Question ids must be unique within a section.',
        },
      ],
    },
  },
  { _id: false, id: false, strict: true, minimize: false }
);

export const paperMetadataSchema = new Schema<IPaperMetadata>(
  {
    model: { type: String, required: true, trim: true, maxlength: 200 },
    inputTokens: { type: Number, required: true, min: 0, validate: Number.isInteger },
    outputTokens: { type: Number, required: true, min: 0, validate: Number.isInteger },
    generationDurationMs: { type: Number, required: true, min: 0, validate: Number.isInteger },
    retryCount: { type: Number, required: true, min: 0, validate: Number.isInteger },
    estimatedCost: {
      type: Number,
      required: true,
      min: 0,
      set: (value: number) => Number(value.toFixed(COST_DECIMAL_PLACES)),
    },
    provider: { type: String, trim: true, maxlength: 100 },
    traceId: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false, id: false, strict: true, minimize: false }
);

export const paperVersionSchema = new Schema<IPaperVersion>(
  {
    version: { type: Number, required: true, min: 1, validate: Number.isInteger },
    sections: {
      type: [paperSectionSchema],
      required: true,
      validate: [
        {
          validator: (sections: IPaperSection[]) => sections.length >= 1 && sections.length <= MAX_SECTIONS,
          message: `Paper versions must include between 1 and ${MAX_SECTIONS} sections.`,
        },
        {
          validator: (sections: IPaperSection[]) => !hasDuplicates(sections.map((section) => section.id)),
          message: 'Section ids must be unique within a version.',
        },
        {
          validator: (sections: IPaperSection[]) => sections.reduce((sum, section) => sum + section.questions.length, 0) <= MAX_TOTAL_QUESTIONS,
          message: `Paper versions cannot exceed ${MAX_TOTAL_QUESTIONS} questions.`,
        },
      ],
    },
    metadata: { type: paperMetadataSchema, required: true },
    pdfS3Key: { type: String, trim: true, default: null },
    pdfGeneratedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now, immutable: true },
  },
  { _id: false, id: false, strict: true, minimize: false }
);

paperVersionSchema.path('version').immutable(true);
paperVersionSchema.path('sections').immutable(true);
paperVersionSchema.path('metadata').immutable(true);

export const PAPER_QUESTION_SCHEMA_LIMITS = {
  MIN_OPTIONS_PER_MCQ,
  MAX_OPTIONS_PER_MCQ,
};
