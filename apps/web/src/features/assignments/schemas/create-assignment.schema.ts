import { z } from "zod";

export const uploadStepSchema = z.object({
  file: z.instanceof(File, { message: "A file is required" })
    .refine((file) => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
    .refine((file) => file.type === "application/pdf" || file.type.startsWith("image/"), "Only PDF and images are supported"),
});

export const questionConfigSchema = z.object({
  id: z.string(),
  type: z.enum(["multiple_choice", "short_answer", "essay"]),
  count: z.number().min(1).max(50),
  marks: z.number().min(1).max(100),
});

export const configureStepSchema = z.object({
  questions: z.array(questionConfigSchema).min(1, "At least one question type is required"),
  prompt: z.string().max(1000, "Prompt must be less than 1000 characters").optional(),
});

export const createAssignmentSchema = z.object({
  upload: uploadStepSchema,
  configure: configureStepSchema,
});

export type UploadStepData = z.infer<typeof uploadStepSchema>;
export type ConfigureStepData = z.infer<typeof configureStepSchema>;
export type QuestionConfigData = z.infer<typeof questionConfigSchema>;
export type CreateAssignmentData = z.infer<typeof createAssignmentSchema>;
