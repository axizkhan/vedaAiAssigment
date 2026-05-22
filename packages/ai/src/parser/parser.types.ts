export interface ValidatedQuestion {
  id: string;
  text: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  options?: string[];
  bloomsLevel?: string;
}

export interface ValidatedSection {
  id: string;
  title: string;
  instruction: string;
  questions: ValidatedQuestion[];
}

export interface ValidatedPaper {
  sections: ValidatedSection[];
}

export interface ParseResultSuccess {
  success: true;
  paper: ValidatedPaper;
  metrics: ParserMetrics;
}

export interface ParseResultFailure {
  success: false;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
  metrics: ParserMetrics;
}

export type ParseResult = ParseResultSuccess | ParseResultFailure;

export interface ParserMetrics {
  durationMs: number;
  repairApplied: boolean;
  questionCount: number;
  totalMarks: number;
  duplicateCount: number;
}
