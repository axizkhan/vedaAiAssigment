import { z } from 'zod';
import { TemplateRenderError } from './render.errors';

export const headerFooterDataSchema = z.object({
  title: z.string(),
  institutionName: z.string().optional(),
  courseCode: z.string().optional(),
  semester: z.string().optional(),
  version: z.number().optional(),
});

export const validateHeaderFooterData = (data: unknown) => {
  try {
    return headerFooterDataSchema.parse(data);
  } catch (err) {
    throw new TemplateRenderError('Invalid header/footer data');
  }
};
