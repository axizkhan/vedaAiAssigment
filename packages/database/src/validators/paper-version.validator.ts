import { z } from 'zod';
import {
  MAX_OPTIONS_PER_MCQ,
  MAX_OPTION_TEXT_LENGTH,
  MAX_QUESTION_TEXT_LENGTH,
  MAX_QUESTIONS_PER_SECTION,
  MAX_SECTION_INSTRUCTION_LENGTH,
  MAX_SECTION_TITLE_LENGTH,
  MAX_SECTIONS,
  MAX_TOTAL_QUESTIONS,
} from '../constants/generated-paper.constants';
import { BloomsLevel, DifficultyLevel, QuestionType } from '../types/generated-paper.types';

const normalizedText = (max: number) => z.string().trim().min(1).max(max);

export const paperMetadataSchema = z.object({
  model: normalizedText(200),
  inputTokens: z.number().int().min(0),
  outputTokens: z.number().int().min(0),
  generationDurationMs: z.number().int().min(0),
  retryCount: z.number().int().min(0),
  estimatedCost: z.number().min(0).finite(),
  provider: z.string().trim().max(100).optional(),
  traceId: z.string().trim().max(200).optional(),
});

export const paperQuestionSchema = z.object({
  id: normalizedText(120),
  text: normalizedText(MAX_QUESTION_TEXT_LENGTH),
  type: z.nativeEnum(QuestionType),
  difficulty: z.nativeEnum(DifficultyLevel),
  marks: z.number().int().positive(),
  options: z.array(normalizedText(MAX_OPTION_TEXT_LENGTH)).length(MAX_OPTIONS_PER_MCQ).nullable(),
  bloomsLevel: z.nativeEnum(BloomsLevel).nullable(),
}).superRefine((question, ctx) => {
  if (question.type === QuestionType.MCQ) {
    if (!question.options) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'MCQ questions require exactly four options.', path: ['options'] });
      return;
    }

    const normalized = question.options.map((option) => option.toLowerCase());
    if (new Set(normalized).size !== normalized.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'MCQ options must be unique.', path: ['options'] });
    }
    return;
  }

  if (question.options !== null) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Options must be null for non-MCQ questions.', path: ['options'] });
  }
});

export const paperSectionSchema = z.object({
  id: normalizedText(120),
  title: normalizedText(MAX_SECTION_TITLE_LENGTH),
  instruction: z.string().trim().max(MAX_SECTION_INSTRUCTION_LENGTH).default(''),
  questions: z.array(paperQuestionSchema).min(1).max(MAX_QUESTIONS_PER_SECTION),
}).superRefine((section, ctx) => {
  const questionIds = section.questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Question ids must be unique within a section.', path: ['questions'] });
  }

  const questionTexts = section.questions.map((question) => question.text.trim().toLowerCase());
  if (new Set(questionTexts).size !== questionTexts.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate question text detected in section.', path: ['questions'] });
  }
});

const paperVersionObjectSchema = z.object({
  version: z.number().int().positive(),
  sections: z.array(paperSectionSchema).min(1).max(MAX_SECTIONS),
  metadata: paperMetadataSchema,
  pdfS3Key: z.string().trim().min(1).nullable().default(null),
  pdfGeneratedAt: z.date().nullable().default(null),
  createdAt: z.date().default(() => new Date()),
});

export const paperVersionSchema = paperVersionObjectSchema.superRefine((version, ctx) => {
  const sectionIds = version.sections.map((section) => section.id);
  if (new Set(sectionIds).size !== sectionIds.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Section ids must be unique within a version.', path: ['sections'] });
  }

  const questions = version.sections.flatMap((section) => section.questions);
  if (questions.length > MAX_TOTAL_QUESTIONS) {
    ctx.addIssue({ code: z.ZodIssueCode.too_big, maximum: MAX_TOTAL_QUESTIONS, inclusive: true, type: 'array', message: 'Paper exceeds maximum total questions.', path: ['sections'] });
  }

  const questionIds = questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Question ids must be unique within a version.', path: ['sections'] });
  }

  const questionTexts = questions.map((question) => question.text.trim().toLowerCase());
  if (new Set(questionTexts).size !== questionTexts.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate question text detected in paper.', path: ['sections'] });
  }
});

export const createPaperVersionSchema = paperVersionObjectSchema.omit({
  version: true,
  pdfS3Key: true,
  pdfGeneratedAt: true,
  createdAt: true,
}).superRefine((version, ctx) => {
  const parsed = paperVersionSchema.safeParse({
    version: 1,
    sections: version.sections,
    metadata: version.metadata,
    pdfS3Key: null,
    pdfGeneratedAt: null,
    createdAt: new Date(),
  });

  if (!parsed.success) {
    for (const issue of parsed.error.issues) ctx.addIssue(issue);
  }
});
