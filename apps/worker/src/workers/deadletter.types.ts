export interface DeadLetterPayload {
  originalJobId: string;
  assignmentId?: string;
  traceId: string;
  originalQueue: string;
  error: {
    message: string;
    code?: string;
    stack?: string;
  };
  timestamp: string;
  attemptsMade: number;
}

export type FailureClassification = 
  | 'PROVIDER_TIMEOUT'
  | 'PROVIDER_RATE_LIMIT'
  | 'PROVIDER_OUTAGE'
  | 'SCHEMA_VALIDATION'
  | 'JSON_PARSE_FAILURE'
  | 'DUPLICATE_QUESTION_FAILURE'
  | 'REDIS_FAILURE'
  | 'DATABASE_FAILURE'
  | 'QUEUE_STALL'
  | 'PUPPETEER_CRASH'
  | 'OBJECT_STORAGE_FAILURE'
  | 'UNKNOWN';

export interface FailureIncident {
  provider?: string;
  worker: string;
  classification: FailureClassification;
  retryable: boolean;
  count: number;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface ReplayMetadata {
  canReplay: boolean;
  reason?: string;
  targetQueue?: string;
  safePayload?: any;
}

export interface FailureAggregation {
  count: number;
  classificationMap: Record<FailureClassification, number>;
  windowStart: string;
  windowEnd: string;
}
