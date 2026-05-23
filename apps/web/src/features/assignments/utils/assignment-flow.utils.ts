import type { QuestionConfig } from "../types/assignment-flow.types";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

export function calculateTotalMarks(questions: QuestionConfig[]): number {
  return questions.reduce((sum, q) => sum + q.count * q.marks, 0);
}

export function calculateTotalQuestions(questions: QuestionConfig[]): number {
  return questions.reduce((sum, q) => sum + q.count, 0);
}

export function generateQuestionId(): string {
  return Math.random().toString(36).substring(2, 9);
}
