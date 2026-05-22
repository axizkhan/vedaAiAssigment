import { z } from 'zod';
import { DEFAULT_ACTIVE_VERSION } from '../constants/generated-paper.constants';
import { paperVersionSchema } from './paper-version.validator';

export const generatedPaperSchemaValidator = z.object({
  assignmentId: z.string().trim().min(1),
  activeVersion: z.number().int().positive().default(DEFAULT_ACTIVE_VERSION),
  versions: z.array(paperVersionSchema).min(1),
}).superRefine((paper, ctx) => {
  const versions = paper.versions.map((version) => version.version);
  if (new Set(versions).size !== versions.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Paper versions must be unique.', path: ['versions'] });
  }

  if (!versions.includes(paper.activeVersion)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Active version must exist in versions.', path: ['activeVersion'] });
  }
});

export const updateActiveVersionSchema = z.object({
  assignmentId: z.string().trim().min(1),
  version: z.number().int().positive(),
  traceId: z.string().trim().max(200).optional(),
});

export const regenerateSectionSchema = z.object({
  assignmentId: z.string().trim().min(1),
  sectionId: z.string().trim().min(1),
  makeActive: z.boolean().optional(),
  traceId: z.string().trim().max(200).optional(),
});
