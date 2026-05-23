export type DifficultyLevel = "easy" | "moderate" | "hard";

export interface Question {
  id: string;
  number: string;
  text: string;
  marks: number;
  difficulty: DifficultyLevel;
}

export interface Section {
  id: string;
  title: string;
  instructions?: string;
  questions: Question[];
  totalMarks: number;
}

export interface Paper {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  instructions?: string[];
  sections: Section[];
  createdAt: string;
}

export type ExportState = "idle" | "loading" | "success" | "error";
