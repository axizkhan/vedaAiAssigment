export interface BaseAssignmentEventMetadata {
  traceId?: string;
  jobId?: string;
  workerId?: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface UploadedFileEventMetadata extends BaseAssignmentEventMetadata {
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  tokenCount?: number;
}

export interface TriggeredGenerationEventMetadata extends BaseAssignmentEventMetadata {
  jobId: string;
  queuePosition?: number;
  promptVersion?: string;
}

export interface FailedGenerationEventMetadata extends BaseAssignmentEventMetadata {
  jobId?: string;
  errorCode?: string;
  errorMessage?: string;
  retryCount?: number;
}

export interface DownloadedPdfEventMetadata extends BaseAssignmentEventMetadata {
  version?: number;
  downloadType?: 'inline' | 'attachment' | 'bulk';
}

export interface RegeneratedSectionEventMetadata extends BaseAssignmentEventMetadata {
  sectionId?: string;
  sourceVersion?: number;
  newVersion?: number;
}

export type AssignmentEventMetadata =
  | BaseAssignmentEventMetadata
  | UploadedFileEventMetadata
  | TriggeredGenerationEventMetadata
  | FailedGenerationEventMetadata
  | DownloadedPdfEventMetadata
  | RegeneratedSectionEventMetadata;
