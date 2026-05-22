import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { RESPONSE_CODES } from '../response/response-codes';
import { AppError } from './app-error';

export class RateLimitExceededError extends AppError {
  constructor(message = ERROR_MESSAGES.RATE_LIMITED) {
    super({ code: RESPONSE_CODES.RATE_LIMITED, message, statusCode: 429 });
  }
}
