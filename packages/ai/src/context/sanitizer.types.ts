export interface SanitizationMetrics {
  durationMs: number;
  originalLength: number;
  sanitizedLength: number;
  injectionPatternsDetected: number;
  unicodeCharsRemoved: number;
  htmlTagsRemoved: number;
  truncationApplied: boolean;
}

export interface SanitizationResult {
  text: string;
  metrics: SanitizationMetrics;
}

export interface InjectionDetectionResult {
  detected: boolean;
  matches: string[];
  redactedText: string;
}

export interface DangerousPattern {
  name: string;
  regex: RegExp;
}
