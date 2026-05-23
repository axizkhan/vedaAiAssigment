import { z } from 'zod';

// Ensure frontend resilience against malformed socket events
export const generationProgressSchema = z.object({
  assignmentId: z.string(),
  step: z.number(),
  percent: z.number().min(0).max(100),
  message: z.string(),
  traceId: z.string(),
});

export const generationCompletedSchema = z.object({
  assignmentId: z.string(),
  version: z.number(),
  traceId: z.string(),
});

export const queuePositionSchema = z.object({
  assignmentId: z.string(),
  position: z.number().min(0),
});

export const pdfReadySchema = z.object({
  assignmentId: z.string(),
  version: z.number(),
  downloadUrl: z.string().url(),
});

export const validatePayload = <T>(schema: z.ZodSchema<T>, payload: unknown): T | null => {
  try {
    return schema.parse(payload);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[WS_VALIDATOR] Payload validation failed:', err);
    }
    return null;
  }
};
