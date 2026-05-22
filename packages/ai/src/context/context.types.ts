import { AssignmentDoc } from '@assessment-ai/types';

export interface ContextBuildOptions {
  provider?: string;
  model?: string;
  traceId?: string;
  assignmentId?: string;
}

export interface TokenEstimateResult {
  tokens: number;
  chars: number;
}

export interface ContextCompressionResult {
  text: string;
  originalChars: number;
  compressedChars: number;
}

export interface ContextWindow {
  provider: string;
  model: string;
  maxContextTokens: number;
}

export interface ChunkResult {
  chunks: string[];
  totalTokens: number;
}

export interface ContextFingerprint {
  hash: string;
  algorithm: string;
}

export interface AIContextResult {
  promptContext: string;
  originalTokens: number;
  finalTokens: number;
  truncated: boolean;
  compressed: boolean;
  fingerprint: string;
}
