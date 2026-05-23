export interface QuestionTemplateData {
  number: number;
  htmlContent: string;
  marks: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  options?: Array<{ label: string; text: string }>;
}

export interface SectionTemplateData {
  title: string;
  questions: QuestionTemplateData[];
}

export interface PdfTemplateData {
  institutionName: string;
  examTitle: string;
  assignmentId: string;
  version: number;
  date?: string;
  duration?: string;
  totalMarks?: number;
  instructions?: string;
  sections: SectionTemplateData[];
}
