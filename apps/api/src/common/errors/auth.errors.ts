import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { RESPONSE_CODES } from '../response/response-codes';
import { AppError } from './app-error';

export class UnauthorizedError extends AppError {
  constructor(message = ERROR_MESSAGES.AUTHENTICATION_REQUIRED) {
    super({ code: RESPONSE_CODES.AUTHENTICATION_REQUIRED, message, statusCode: 401 });
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super({ code: RESPONSE_CODES.INVALID_CREDENTIALS, message: ERROR_MESSAGES.INVALID_CREDENTIALS, statusCode: 401 });
  }
}

export class InvalidTokenError extends AppError {
  constructor() {
    super({ code: RESPONSE_CODES.INVALID_TOKEN, message: ERROR_MESSAGES.INVALID_TOKEN, statusCode: 401 });
  }
}

export class TokenExpiredError extends AppError {
  constructor() {
    super({ code: RESPONSE_CODES.TOKEN_EXPIRED, message: ERROR_MESSAGES.TOKEN_EXPIRED, statusCode: 401 });
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super({ code: RESPONSE_CODES.FORBIDDEN, message, statusCode: 403 });
  }
}
