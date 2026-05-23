export type QuestionType = "mcq" | "short" | "long" | "true-false";

export interface QuestionConfig {
  id: string;
  type: QuestionType;
  count: number;
  marks: number;
}

export interface AssignmentDraftData {
  // Step 1: Basic Info
  title: string;
  subject: string;
  description?: string;
  
  // Step 2: Upload
  file: File | null;
  
  // Step 3: Question Config
  questions: QuestionConfig[];
  
  // Step 4: Prompt Instructions
  prompt: string;
}

export type StepId = "basic" | "upload" | "questions" | "prompt" | "review";

export interface StepDefinition {
  id: StepId;
  index: number;
  title: string;
  description: string;
}
