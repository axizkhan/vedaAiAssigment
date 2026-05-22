import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { RESPONSE_CODES } from '../response/response-codes';
import { AppError } from './app-error';

export class RequestValidationError extends AppError {
  constructor(details?: unknown, message = ERROR_MESSAGES.VALIDATION_FAILED) {
    super({ code: RESPONSE_CODES.VALIDATION_ERROR, message, statusCode: 400, details });
  }
}

export class SchemaValidationError extends AppError {
  constructor(details?: unknown) {
    super({ code: RESPONSE_CODES.SCHEMA_VALIDATION_ERROR, message: ERROR_MESSAGES.SCHEMA_VALIDATION_FAILED, statusCode: 400, details });
  }
}
