import { ValidatedPaper } from '../parser/parser.types';
import { PromptInput } from '../providers/provider.types';

export interface GenerationRetryOptions {
  maxAttempts?: number;
  timeoutMs?: number;
  traceId?: string;
  assignmentId?: string;
}

export interface GenerationAttempt {
  attemptNumber: number;
  provider: string;
  latencyMs: number;
  success: boolean;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export interface GenerationState {
  traceId?: string;
  assignmentId?: string;
  attempts: GenerationAttempt[];
  startTime: number;
}

export interface RetryDecision {
  shouldRetry: boolean;
  delayMs: number;
  reason?: string;
}

export interface GenerationResult {
  paper: ValidatedPaper;
  state: GenerationState;
}

export interface FailureAnalysis {
  isRetryable: boolean;
  reason: string;
}

export interface RetryTelemetry {
  traceId?: string;
  attempt: number;
  provider: string;
  latencyMs: number;
  error: string;
}
