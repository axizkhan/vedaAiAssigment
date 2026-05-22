export interface PromptInput {
  title: string;
  subject: string;
  instructions: string;
  extractedContent: string | null;
  totalQuestions: number;
  totalMarks: number;
  questionTypes: string[];
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  promptVersion: string;
  allocatedDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface RawAIResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  provider: string;
  latencyMs: number;
  finishReason?: string;
}

export interface ProviderExecutionContext {
  traceId: string;
  assignmentId?: string;
  userId?: string;
  timeoutMs?: number;
  retryAttempt?: number;
}

export interface ProviderHealthResult {
  isHealthy: boolean;
  latencyMs: number;
  error?: string;
  lastChecked: Date;
}
