import { DeadLetterPayload } from './deadletter.types';

export class InvalidDeadLetterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDeadLetterError';
  }
}

export const validateDeadLetterPayload = (payload: DeadLetterPayload): void => {
  if (!payload) {
    throw new InvalidDeadLetterError('DeadLetter payload is completely empty.');
  }

  const missingFields = [];
  if (!payload.traceId) missingFields.push('traceId');
  if (!payload.originalJobId) missingFields.push('originalJobId');
  if (!payload.originalQueue) missingFields.push('originalQueue');
  if (!payload.error?.message) missingFields.push('error.message');
  if (!payload.timestamp) missingFields.push('timestamp');

  if (missingFields.length > 0) {
    throw new InvalidDeadLetterError(\`Malformed DeadLetter payload. Missing fields: \${missingFields.join(', ')}\`);
  }

  // Safety constraint: Prevent recursive DLQ payloads from self-processing infinitely
  if (payload.originalQueue === 'dead-letter') {
    throw new InvalidDeadLetterError('FATAL: Recursive dead-letter payload detected. Stopping to prevent infinite loops.');
  }
};
