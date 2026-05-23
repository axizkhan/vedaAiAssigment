import { z } from 'zod';

export const pdfJobPayloadSchema = z.object({
  assignmentId: z.string().min(1),
  version: z.number().int().positive(),
  requestedBy: z.string().min(1),
  traceId: z.string().min(1),
  requestedAt: z.string().datetime(),
});

export const validatePdfJobPayload = (payload: unknown) => {
  return pdfJobPayloadSchema.parse(payload);
};
