import { FailureClassification } from './deadletter.types';

export const classifyFailure = (errorMsg: string = '', errorCode?: string): FailureClassification => {
  const msg = errorMsg.toLowerCase();

  // Provider Failures
  if (msg.includes('rate limit') || msg.includes('429')) return 'PROVIDER_RATE_LIMIT';
  if (msg.includes('timeout') || msg.includes('econnreset') || msg.includes('socket hang up')) return 'PROVIDER_TIMEOUT';
  if (msg.includes('503') || msg.includes('502') || msg.includes('bad gateway') || msg.includes('service unavailable')) return 'PROVIDER_OUTAGE';

  // Validation / AI Logic Failures
  if (msg.includes('schema validation') || msg.includes('zod error')) return 'SCHEMA_VALIDATION';
  if (msg.includes('json') && (msg.includes('parse') || msg.includes('syntax'))) return 'JSON_PARSE_FAILURE';
  if (msg.includes('duplicate question')) return 'DUPLICATE_QUESTION_FAILURE';

  // Infrastructure Failures
  if (msg.includes('redis') || msg.includes('ioredis')) return 'REDIS_FAILURE';
  if (msg.includes('mongo') || msg.includes('mongoose') || msg.includes('database')) return 'DATABASE_FAILURE';
  
  // Puppeteer / PDF
  if (msg.includes('puppeteer') || msg.includes('browser') || msg.includes('page crashed') || msg.includes('target closed')) return 'PUPPETEER_CRASH';
  
  // Storage
  if (msg.includes('s3') || msg.includes('minio') || msg.includes('object storage')) return 'OBJECT_STORAGE_FAILURE';

  // Stalled
  if (msg.includes('stalled')) return 'QUEUE_STALL';

  return 'UNKNOWN';
};

export const isRetryableFailure = (classification: FailureClassification): boolean => {
  const retryableSet = new Set<FailureClassification>([
    'PROVIDER_TIMEOUT',
    'PROVIDER_RATE_LIMIT',
    'PROVIDER_OUTAGE',
    'REDIS_FAILURE',
    'DATABASE_FAILURE',
    'QUEUE_STALL',
    'PUPPETEER_CRASH',
    'OBJECT_STORAGE_FAILURE'
  ]);
  return retryableSet.has(classification);
};
