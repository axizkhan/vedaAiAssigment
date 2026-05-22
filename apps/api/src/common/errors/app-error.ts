import { getHttpStatusForCode } from '../response/http-status-map';

export interface AppErrorOptions {
  readonly code: string;
  readonly message: string;
  readonly statusCode?: number;
  readonly isOperational?: boolean;
  readonly details?: unknown;
  readonly expose?: boolean;
}

export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly details?: unknown;
  readonly expose: boolean;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = this.constructor.name;
    this.code = options.code;
    this.statusCode = options.statusCode ?? getHttpStatusForCode(options.code);
    this.isOperational = options.isOperational ?? true;
    this.details = options.details;
    this.expose = options.expose ?? true;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
