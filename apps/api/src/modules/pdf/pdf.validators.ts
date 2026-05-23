import { z } from 'zod';
import { PdfValidationError } from './pdf.errors';

export const pdfRequestSchema = z.object({
  assignmentId: z.string().min(1),
  version: z.number().int().positive(),
});

export const validatePdfRequest = (data: unknown) => {
  try {
    return pdfRequestSchema.parse(data);
  } catch (err) {
    throw new PdfValidationError('Invalid PDF request parameters');
  }
};
