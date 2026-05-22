import { Response } from 'express';
import { ApiSuccessResponse, SendSuccessOptions } from './response.types';

export function sendSuccessResponse<T>(
  res: Response,
  options: SendSuccessOptions<T>
): Response<ApiSuccessResponse<T>> {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    data: options.data,
    ...(options.meta ? { meta: options.meta } : {}),
    ...(options.traceId ? { traceId: options.traceId } : {}),
  };

  return res.status(options.statusCode ?? 200).json(payload);
}
