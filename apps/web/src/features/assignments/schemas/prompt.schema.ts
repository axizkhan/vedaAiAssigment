import { z } from "zod";
import { MAX_PROMPT_LENGTH } from "../constants/assignment-flow.constants";

export const promptSchema = z.object({
  prompt: z.string().max(MAX_PROMPT_LENGTH, `Prompt must be less than ${MAX_PROMPT_LENGTH} characters`).optional(),
});

export type PromptFormData = z.infer<typeof promptSchema>;
