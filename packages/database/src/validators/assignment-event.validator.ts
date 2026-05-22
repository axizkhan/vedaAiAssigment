import { z } from 'zod';
import { MAX_METADATA_SIZE } from '../constants/assignment-event.constants';
import { AssignmentEventAction } from '../types/assignment-event.types';
import { sanitizeEventMetadata } from '../utils/event-metadata-sanitizer';

function metadataSize(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value ?? {}), 'utf8');
}

export const assignmentEventMetadataSchema = z.record(z.unknown())
  .default({})
  .transform((metadata) => sanitizeEventMetadata(metadata))
  .refine((metadata) => metadataSize(metadata) <= MAX_METADATA_SIZE, {
    message: `Assignment event metadata must not exceed ${MAX_METADATA_SIZE} bytes after sanitization.`,
  });

export const assignmentTraceSchema = z.object({
  traceId: z.string().trim().min(1).max(200).optional(),
  jobId: z.string().trim().min(1).max(200).optional(),
  workerId: z.string().trim().min(1).max(200).optional(),
  requestId: z.string().trim().min(1).max(200).optional(),
}).partial();

export const assignmentEventSchemaValidator = z.object({
  assignmentId: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  action: z.nativeEnum(AssignmentEventAction),
  metadata: assignmentEventMetadataSchema.optional(),
  trace: assignmentTraceSchema.optional(),
});

export const assignmentEventFiltersSchema = z.object({
  assignmentId: z.string().trim().min(1).optional(),
  userId: z.string().trim().min(1).optional(),
  action: z.nativeEnum(AssignmentEventAction).optional(),
  traceId: z.string().trim().min(1).max(200).optional(),
  jobId: z.string().trim().min(1).max(200).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  includeMetadata: z.boolean().optional(),
  adminOverride: z.boolean().optional(),
});
