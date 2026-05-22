import { logger } from '@assessment-ai/logger';
import { MAX_METADATA_SIZE, SENSITIVE_METADATA_KEYS } from '../constants/assignment-event.constants';
import { AssignmentEventMetadata } from '../types/assignment-event-metadata.types';

const REDACTED = '[REDACTED]';
const TRUNCATED = '[TRUNCATED]';
const MAX_STRING_LENGTH = 2000;
const MAX_ARRAY_LENGTH = 50;
const MAX_DEPTH = 8;

function byteSize(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value) ?? '{}', 'utf8');
}

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase();
  return SENSITIVE_METADATA_KEYS.some((sensitiveKey) => normalized.includes(sensitiveKey.toLowerCase()));
}

function sanitizeValue(value: unknown, seen: WeakSet<object>, depth: number): unknown {
  if (depth > MAX_DEPTH) return TRUNCATED;
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return value.length > MAX_STRING_LENGTH ? `${value.slice(0, MAX_STRING_LENGTH)}${TRUNCATED}` : value;
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Error) return { name: value.name, message: value.message };

  if (Array.isArray(value)) {
    return value.slice(0, MAX_ARRAY_LENGTH).map((item) => sanitizeValue(item, seen, depth + 1));
  }

  if (typeof value === 'object') {
    if (seen.has(value)) return '[CIRCULAR]';
    seen.add(value);

    const output: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      output[key] = isSensitiveKey(key) ? REDACTED : sanitizeValue(nestedValue, seen, depth + 1);
    }
    return output;
  }

  return String(value);
}

export function sanitizeEventMetadata(metadata: AssignmentEventMetadata = {}, traceId?: string): AssignmentEventMetadata {
  const sanitized = sanitizeValue(metadata, new WeakSet<object>(), 0) as AssignmentEventMetadata;

  if (byteSize(sanitized) <= MAX_METADATA_SIZE) return sanitized;

  logger.warn({ traceId, metadataBytes: byteSize(sanitized) }, 'assignment event metadata exceeded size limit and was compacted');
  const compacted: AssignmentEventMetadata = {};
  for (const [key, value] of Object.entries(sanitized)) {
    compacted[key] = typeof value === 'object' && value !== null ? TRUNCATED : value;
    if (byteSize(compacted) > MAX_METADATA_SIZE) {
      delete compacted[key];
      break;
    }
  }

  compacted.metadataTruncated = true;
  return compacted;
}
