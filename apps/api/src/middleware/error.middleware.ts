import { NextFunction, Request, RequestHandler, Response } from 'express';
import crypto from 'node:crypto';
import { logger } from '@assessment-ai/logger';
import { sendErrorResponse } from '../common/response/error-sender';

declare global {
  namespace Express {
    interface Request {
      traceId?: string;
      user?: {
        id?: string;
        _id?: string;
        role?: string;
        email?: string;
        sessionId?: string;
        [key: string]: unknown;
      };
    }
  }
}

const SENSITIVE_LOG_KEYS = [
  'password',
  'passwordHash',
  'token',
  'refreshToken',
  'authorization',
  'cookie',
  'secret',
  'apiKey',
  'prompt',
  'extractedText',
  'rawFile',
];

function createTraceId(): string {
  return `api_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

function sanitizeForLog(value: unknown, depth = 0): unknown {
  if (depth > 5) return '[TRUNCATED]';
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return value.length > 1000 ? `${value.slice(0, 1000)}[TRUNCATED]` : value;
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.slice(0, 25).map((item) => sanitizeForLog(item, depth + 1));
  if (typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      output[key] = SENSITIVE_LOG_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive.toLowerCase()))
        ? '[REDACTED]'
        : sanitizeForLog(nestedValue, depth + 1);
    }
    return output;
  }
  return String(value);
}

function getRequestUserId(req: Request): string | undefined {
  const id = req.user?.id ?? req.user?._id;
  return id ? String(id) : undefined;
}

export const traceIdMiddleware: RequestHandler = (req, res, next) => {
  const incomingTraceId = req.header('x-trace-id');
  req.traceId = incomingTraceId?.trim() || createTraceId();
  res.setHeader('x-trace-id', req.traceId);
  next();
};

export function asyncHandler<T extends RequestHandler>(handler: T): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export function errorMiddleware(error: unknown, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  const traceId = req.traceId ?? createTraceId();
  req.traceId = traceId;
  res.setHeader('x-trace-id', traceId);

  logger.error({
    traceId,
    method: req.method,
    path: req.originalUrl,
    userId: getRequestUserId(req),
    errorName: error instanceof Error ? error.name : typeof error,
    errorMessage: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    body: sanitizeForLog(req.body),
    query: sanitizeForLog(req.query),
    params: sanitizeForLog(req.params),
  }, 'API request failed');

  sendErrorResponse(res, error, traceId);
}
