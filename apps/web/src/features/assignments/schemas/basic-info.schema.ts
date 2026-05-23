import { z } from "zod";

export const basicInfoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  subject: z.string().min(2, "Subject is required").max(50),
  description: z.string().max(500).optional(),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
