import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { RESPONSE_CODES } from '../response/response-codes';
import { AppError } from './app-error';

export class DuplicateResourceError extends AppError {
  constructor(message: string = ERROR_MESSAGES.RESOURCE_ALREADY_EXISTS, details?: unknown) {
    super({ code: RESPONSE_CODES.RESOURCE_ALREADY_EXISTS, message, statusCode: 409, details });
  }
}

export class DatabaseConnectionError extends AppError {
  constructor() {
    super({ code: RESPONSE_CODES.DATABASE_UNAVAILABLE, message: ERROR_MESSAGES.DATABASE_UNAVAILABLE, statusCode: 503, expose: false });
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super({ code: RESPONSE_CODES.RESOURCE_NOT_FOUND, message: `${resource} not found`, statusCode: 404 });
  }
}
