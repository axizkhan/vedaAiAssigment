export interface ApiMeta {
  readonly page?: number;
  readonly limit?: number;
  readonly total?: number;
  readonly [key: string]: unknown;
}

export interface ApiErrorPayload {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
}

export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly meta?: ApiMeta;
  readonly traceId?: string;
}

export interface ApiErrorResponse {
  readonly success: false;
  readonly error: ApiErrorPayload;
  readonly traceId?: string;
}

export interface SendSuccessOptions<T> {
  readonly statusCode?: number;
  readonly data: T;
  readonly meta?: ApiMeta;
  readonly traceId?: string;
}

export interface NormalizedError {
  readonly code: string;
  readonly message: string;
  readonly statusCode: number;
  readonly details?: unknown;
  readonly expose: boolean;
}
