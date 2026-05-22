export class QueueError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'QueueError';
  }
}

export class QueueProcessingError extends QueueError {
  constructor(message: string) {
    super(message, 'QUEUE_PROCESSING_ERROR');
  }
}

export class RetryableQueueError extends QueueError {
  constructor(message: string) {
    super(message, 'RETRYABLE_QUEUE_ERROR');
  }
}

export class PermanentQueueError extends QueueError {
  constructor(message: string) {
    super(message, 'PERMANENT_QUEUE_ERROR');
  }
}
