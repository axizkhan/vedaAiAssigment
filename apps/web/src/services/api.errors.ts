import { AxiosError } from 'axios';

export enum ApiErrorCode {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SESSION_REVOKED = 'SESSION_REVOKED',
  FORBIDDEN = 'FORBIDDEN',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export const normalizeApiError = (error: unknown): ApiErrorCode => {
  if (error instanceof AxiosError) {
    const code = error.response?.data?.error?.code;
    if (Object.values(ApiErrorCode).includes(code)) {
      return code as ApiErrorCode;
    }
    if (error.response?.status === 429) return ApiErrorCode.RATE_LIMITED;
    if (error.response?.status === 403) return ApiErrorCode.FORBIDDEN;
    if (error.response?.status === 401) return ApiErrorCode.INVALID_TOKEN;
    if (error.response?.status! >= 500) return ApiErrorCode.INTERNAL_ERROR;
  }
  return ApiErrorCode.UNKNOWN_ERROR;
};
