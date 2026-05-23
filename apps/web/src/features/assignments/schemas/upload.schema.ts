import { z } from "zod";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "../constants/assignment-flow.constants";

export const uploadSchema = z.object({
  file: z.instanceof(File, { message: "A source file is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 10MB")
    .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), "Only PDF, JPEG, and PNG files are supported"),
});

export type UploadFormData = z.infer<typeof uploadSchema>;
