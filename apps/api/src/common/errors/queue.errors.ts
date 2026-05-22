import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { RESPONSE_CODES } from '../response/response-codes';
import { AppError } from './app-error';

export class QueueJobError extends AppError {
  constructor(message = ERROR_MESSAGES.QUEUE_JOB_FAILED) {
    super({ code: RESPONSE_CODES.QUEUE_JOB_FAILED, message, statusCode: 503, expose: false });
  }
}

export class GenerationInProgressError extends AppError {
  constructor() {
    super({ code: RESPONSE_CODES.GENERATION_IN_PROGRESS, message: ERROR_MESSAGES.GENERATION_IN_PROGRESS, statusCode: 409 });
  }
}
