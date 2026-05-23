import { z } from "zod";

export const questionConfigSchema = z.object({
  id: z.string(),
  type: z.enum(["mcq", "short", "long", "true-false"]),
  count: z.number().min(1, "Must have at least 1 question").max(50, "Maximum 50 questions per type"),
  marks: z.number().min(1, "Marks must be at least 1").max(100),
});

export const questionsSchema = z.object({
  questions: z.array(questionConfigSchema).min(1, "At least one question type must be configured"),
});

export type QuestionFormData = z.infer<typeof questionsSchema>;
