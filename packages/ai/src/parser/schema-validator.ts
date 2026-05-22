import { z } from 'zod';
import { SchemaValidationError } from './parser.errors';

export const QuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  type: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  marks: z.number().int().positive(),
  options: z.array(z.string()).optional(),
  bloomsLevel: z.string().optional()
});

export const SectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  instruction: z.string(),
  questions: z.array(QuestionSchema).min(1)
});

export const PaperSchema = z.object({
  sections: z.array(SectionSchema).min(1)
});

export const validateZodSchema = (parsedJson: unknown) => {
  const result = PaperSchema.safeParse(parsedJson);
  if (!result.success) {
    throw new SchemaValidationError(\`Schema mismatch: \${result.error.message}\`);
  }
  return result.data;
};
