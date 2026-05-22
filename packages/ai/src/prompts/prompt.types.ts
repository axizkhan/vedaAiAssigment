export interface PromptMetrics {
  durationMs: number;
  inputTokensEstimated: number;
  extractedCharsUsed: number;
  truncated: boolean;
  promptVersion: string;
}

export interface PromptBudgetResult {
  text: string;
  truncated: boolean;
  tokensEstimated: number;
  charsUsed: number;
}

export interface PromptBuildResult {
  prompt: string;
  metrics: PromptMetrics;
}

export interface PromptSection {
  name: string;
  content: string;
  priority: number;
}
