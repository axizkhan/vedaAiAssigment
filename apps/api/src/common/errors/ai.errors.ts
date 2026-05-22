import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { RESPONSE_CODES } from '../response/response-codes';
import { AppError } from './app-error';

export class AIProviderError extends AppError {
  constructor() {
    super({ code: RESPONSE_CODES.AI_GENERATION_FAILED, message: ERROR_MESSAGES.AI_GENERATION_FAILED, statusCode: 502, expose: false });
  }
}

export class AIParseError extends AppError {
  constructor() {
    super({ code: RESPONSE_CODES.AI_PARSE_FAILED, message: ERROR_MESSAGES.AI_PARSE_FAILED, statusCode: 502, expose: false });
  }
}
