import { JsonWebTokenError, NotBeforeError, TokenExpiredError as JwtTokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { RESPONSE_CODES } from './response-codes';
import { getHttpStatusForCode } from './http-status-map';
import { formatZodDetails, getErrorCode, getErrorMessage, getErrorName } from './error-mapper';
import { NormalizedError } from './response.types';

const INTERNAL_MESSAGE_PATTERNS = [
  /Mongo(Server)?Error/i,
  /E11000/i,
  /CastError/i,
  /ValidationError/i,
  /redis/i,
  /ECONNREFUSED/i,
  /ENOTFOUND/i,
  /\/app\//i,
  /\/home\//i,
  /\/var\//i,
  /node_modules/i,
  /jwt/i,
  /secret/i,
  /api[_-]?key/i,
  /prompt/i,
  /s3/i,
  /minio/i,
  /bullmq/i,
];

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function normalize(code: string, message: string, details?: unknown, expose = true): NormalizedError {
  return { code, message, statusCode: getHttpStatusForCode(code), details, expose };
}

function isUnsafeMessage(message: string): boolean {
  return INTERNAL_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
}

function mapMongooseError(error: unknown): NormalizedError | null {
  const name = getErrorName(error);
  const code = getErrorCode(error);

  if (code === 11000) {
    return normalize(RESPONSE_CODES.RESOURCE_ALREADY_EXISTS, ERROR_MESSAGES.RESOURCE_ALREADY_EXISTS);
  }

  if (name === 'CastError') {
    return normalize(RESPONSE_CODES.INVALID_RESOURCE_ID, ERROR_MESSAGES.INVALID_RESOURCE_ID);
  }

  if (name === 'ValidationError') {
    return normalize(RESPONSE_CODES.VALIDATION_ERROR, 'Validation failed');
  }

  if (name === 'MongoServerError' || name === 'MongoNetworkError' || name === 'MongooseServerSelectionError') {
    return normalize(RESPONSE_CODES.DATABASE_UNAVAILABLE, ERROR_MESSAGES.DATABASE_UNAVAILABLE, undefined, false);
  }

  return null;
}

function mapJwtError(error: unknown): NormalizedError | null {
  if (error instanceof JwtTokenExpiredError || getErrorName(error) === 'TokenExpiredError') {
    return normalize(RESPONSE_CODES.TOKEN_EXPIRED, ERROR_MESSAGES.TOKEN_EXPIRED);
  }

  if (error instanceof JsonWebTokenError || error instanceof NotBeforeError || ['JsonWebTokenError', 'NotBeforeError'].includes(getErrorName(error) ?? '')) {
    return normalize(RESPONSE_CODES.INVALID_TOKEN, ERROR_MESSAGES.INVALID_TOKEN);
  }

  return null;
}

function mapInfrastructureError(error: unknown): NormalizedError | null {
  const name = getErrorName(error);
  const message = getErrorMessage(error);

  if (/redis|bullmq|queue/i.test(name ?? '') || /redis|bullmq|queue/i.test(message)) {
    return normalize(RESPONSE_CODES.QUEUE_JOB_FAILED, ERROR_MESSAGES.QUEUE_JOB_FAILED, undefined, false);
  }

  if (/ENOENT|EACCES|EPERM|filesystem|path/i.test(name ?? '') || /ENOENT|EACCES|EPERM|\/home\/|\/app\/|\/var\//i.test(message)) {
    return normalize(RESPONSE_CODES.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.SOMETHING_WENT_WRONG, undefined, false);
  }

  if (/AI|OpenRouter|Groq|provider|prompt|token usage/i.test(name ?? '') || /OpenRouter|Groq|provider|prompt/i.test(message)) {
    return normalize(RESPONSE_CODES.AI_GENERATION_FAILED, ERROR_MESSAGES.AI_GENERATION_FAILED, undefined, false);
  }

  return null;
}

export function mapErrorToSafeResponse(error: unknown): NormalizedError {
  if (error instanceof AppError) {
    const shouldExposeDetails = !isProduction() && error.details !== undefined;
    return {
      code: error.expose ? error.code : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: error.expose ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      statusCode: error.expose ? error.statusCode : 500,
      ...(shouldExposeDetails && error.expose ? { details: error.details } : {}),
      expose: error.expose,
    };
  }

  if (error instanceof ZodError) {
    return normalize(
      RESPONSE_CODES.VALIDATION_ERROR,
      ERROR_MESSAGES.VALIDATION_FAILED,
      formatZodDetails(error)
    );
  }

  const mapped = mapMongooseError(error) ?? mapJwtError(error) ?? mapInfrastructureError(error);
  if (mapped) {
    return isProduction() && !mapped.expose
      ? normalize(RESPONSE_CODES.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.SOMETHING_WENT_WRONG, undefined, false)
      : mapped;
  }

  const message = getErrorMessage(error);
  if (!isProduction() && message && !isUnsafeMessage(message)) {
    return normalize(RESPONSE_CODES.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.SOMETHING_WENT_WRONG);
  }

  return normalize(RESPONSE_CODES.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.SOMETHING_WENT_WRONG, undefined, false);
}
