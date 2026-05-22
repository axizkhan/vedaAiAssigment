import { Response } from 'express';
import { mapErrorToSafeResponse } from './secure-error-mapper';
import { ApiErrorResponse } from './response.types';

export function sendErrorResponse(
  res: Response,
  error: unknown,
  traceId?: string
): Response<ApiErrorResponse> {
  const safeError = mapErrorToSafeResponse(error);
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code: safeError.code,
      message: safeError.message,
      ...(safeError.details !== undefined ? { details: safeError.details } : {}),
    },
    ...(traceId ? { traceId } : {}),
  };

  return res.status(safeError.statusCode).json(payload);
}
