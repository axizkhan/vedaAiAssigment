import { StepDefinition } from "../types/assignment-flow.types";

export const ASSIGNMENT_STEPS: StepDefinition[] = [
  { id: "basic", index: 0, title: "Basic Info", description: "Title and subject" },
  { id: "upload", index: 1, title: "Source Material", description: "Upload PDF or images" },
  { id: "questions", index: 2, title: "Questions", description: "Configure types & marks" },
  { id: "prompt", index: 3, title: "Instructions", description: "AI generation prompt" },
  { id: "review", index: 4, title: "Review", description: "Confirm and submit" },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const MAX_PROMPT_LENGTH = 1000;
