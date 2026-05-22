export type SeedEnvironment = 'development' | 'test' | 'production';

export type SeedStepStatus = 'success' | 'skipped' | 'failed';

export interface SeedContext {
  environment: SeedEnvironment;
  mongoUri: string;
  adminEmail: string;
  adminPassword: string;
  adminName: string;
  traceId: string;
  startedAt: Date;
  verbose: boolean;
}

export interface SeedResult {
  name: string;
  status: SeedStepStatus;
  durationMs: number;
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface SeedExecutionSummary {
  traceId: string;
  environment: SeedEnvironment;
  status: SeedStepStatus;
  indexesSynced: number;
  adminCreated: boolean;
  durationMs: number;
  results: SeedResult[];
}

export class SeedValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SeedValidationError';
  }
}

export class SeedConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SeedConfigurationError';
  }
}

export class SeedDatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SeedDatabaseConnectionError';
  }
}
