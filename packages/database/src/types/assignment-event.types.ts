import type { FlattenMaps, HydratedDocument, InferSchemaType, Types } from 'mongoose';
import type { assignmentEventSchema } from '../models/assignment-event.model';
import type { AssignmentEventMetadata } from './assignment-event-metadata.types';

export type AssignmentEventLean<T> = FlattenMaps<T> & { _id: Types.ObjectId };

export enum AssignmentEventAction {
  CREATED = 'created',
  UPDATED = 'updated',
  UPLOADED_FILE = 'uploaded_file',
  TRIGGERED_GENERATION = 'triggered_generation',
  REGENERATED_SECTION = 'regenerated_section',
  DOWNLOADED_PDF = 'downloaded_pdf',
  FAILED_GENERATION = 'failed_generation',
}

export enum AssignmentEventSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum AssignmentEventCategory {
  ASSIGNMENT = 'assignment',
  FILE = 'file',
  AI = 'ai',
  PDF = 'pdf',
}

export interface IAssignmentEvent {
  assignmentId: Types.ObjectId;
  userId: Types.ObjectId;
  action: AssignmentEventAction;
  metadata: AssignmentEventMetadata;
  createdAt: Date;
}

export type AssignmentEventSchemaType = InferSchemaType<typeof assignmentEventSchema>;
export type AssignmentEventDocument = HydratedDocument<IAssignmentEvent>;
export type AssignmentEventLeanDocument = AssignmentEventLean<IAssignmentEvent>;

export interface AssignmentTraceContext {
  traceId?: string;
  jobId?: string;
  workerId?: string;
  requestId?: string;
}

export interface CreateAssignmentEventInput {
  assignmentId: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  action: AssignmentEventAction;
  metadata?: AssignmentEventMetadata;
  trace?: AssignmentTraceContext;
}

export interface AssignmentEventAccessScope {
  userId?: string | Types.ObjectId;
  adminOverride?: boolean;
}

export interface AssignmentEventFilters extends AssignmentEventAccessScope {
  assignmentId?: string | Types.ObjectId;
  userId?: string | Types.ObjectId;
  action?: AssignmentEventAction;
  traceId?: string;
  jobId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  includeMetadata?: boolean;
}

export interface PaginatedAssignmentEvents<T = AssignmentEventLeanDocument> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TimelineGroup {
  key: string;
  traceId?: string;
  startAt: Date;
  endAt: Date;
  eventCount: number;
  events: AssignmentEventLeanDocument[];
}

export interface AssignmentEventActionCount {
  action: AssignmentEventAction;
  count: number;
}

export interface AssignmentEventAnalytics {
  totalEvents: number;
  eventsByAction: Record<AssignmentEventAction, number>;
  generationFailureRate: number;
  uploadCount: number;
  pdfDownloadCount: number;
  averageRetryCount: number;
  activeUserCount: number;
}
