import { logger } from '@assessment-ai/logger';
import { Types } from 'mongoose';
import { Assignment } from '../models/assignment.model';
import { AssignmentEventRepository } from '../repositories/assignment-event.repository';
import {
  AssignmentEventAction,
  AssignmentEventLeanDocument,
  AssignmentTraceContext,
  CreateAssignmentEventInput,
} from '../types/assignment-event.types';
import { AssignmentEventMetadata } from '../types/assignment-event-metadata.types';
import { attachEventTrace, buildEventTrace } from '../utils/event-trace-builder';
import { sanitizeEventMetadata } from '../utils/event-metadata-sanitizer';
import { EVENT_CATEGORY_BY_ACTION, EVENT_SEVERITY_BY_ACTION } from '../constants/assignment-event.constants';

async function resolveUserId(assignmentId: string | Types.ObjectId, userId?: string | Types.ObjectId): Promise<string | Types.ObjectId> {
  if (userId) return userId;
  const assignment = await Assignment.findById(assignmentId).select('createdBy').lean().exec() as { createdBy: Types.ObjectId } | null;
  if (!assignment) throw new Error('Assignment not found for audit logging.');
  return assignment.createdBy;
}

export class AssignmentAuditService {
  static async recordEvent(input: CreateAssignmentEventInput): Promise<AssignmentEventLeanDocument> {
    const trace = buildEventTrace(input.metadata, input.trace);
    try {
      const metadata = sanitizeEventMetadata(attachEventTrace({
        ...input.metadata,
        category: EVENT_CATEGORY_BY_ACTION[input.action],
        severity: EVENT_SEVERITY_BY_ACTION[input.action],
      }, trace), trace.traceId);

      return await AssignmentEventRepository.createEvent({ ...input, metadata, trace });
    } catch (error) {
      logger.error({
        assignmentId: input.assignmentId.toString(),
        userId: input.userId.toString(),
        action: input.action,
        traceId: trace.traceId,
        error: error instanceof Error ? error.message : String(error),
      }, 'assignment audit event creation failed');
      throw error;
    }
  }

  static async recordAssignmentCreated(assignmentId: string | Types.ObjectId, userId: string | Types.ObjectId, metadata: AssignmentEventMetadata = {}, trace?: AssignmentTraceContext) {
    return this.recordEvent({ assignmentId, userId, action: AssignmentEventAction.CREATED, metadata, trace });
  }

  static async recordAssignmentUpdated(assignmentId: string | Types.ObjectId, userId: string | Types.ObjectId, metadata: AssignmentEventMetadata = {}, trace?: AssignmentTraceContext) {
    return this.recordEvent({ assignmentId, userId, action: AssignmentEventAction.UPDATED, metadata, trace });
  }

  static async recordFileUploaded(assignmentId: string | Types.ObjectId, userId: string | Types.ObjectId, metadata: AssignmentEventMetadata = {}, trace?: AssignmentTraceContext) {
    return this.recordEvent({ assignmentId, userId, action: AssignmentEventAction.UPLOADED_FILE, metadata, trace });
  }

  static async recordGenerationTriggered(assignmentId: string | Types.ObjectId, metadata: AssignmentEventMetadata = {}, trace?: AssignmentTraceContext, userId?: string | Types.ObjectId) {
    const resolvedUserId = await resolveUserId(assignmentId, userId);
    return this.recordEvent({ assignmentId, userId: resolvedUserId, action: AssignmentEventAction.TRIGGERED_GENERATION, metadata, trace });
  }

  static async recordGenerationFailed(assignmentId: string | Types.ObjectId, metadata: AssignmentEventMetadata = {}, trace?: AssignmentTraceContext, userId?: string | Types.ObjectId) {
    const resolvedUserId = await resolveUserId(assignmentId, userId);
    return this.recordEvent({ assignmentId, userId: resolvedUserId, action: AssignmentEventAction.FAILED_GENERATION, metadata, trace });
  }

  static async recordSectionRegenerated(assignmentId: string | Types.ObjectId, metadata: AssignmentEventMetadata = {}, trace?: AssignmentTraceContext, userId?: string | Types.ObjectId) {
    const resolvedUserId = await resolveUserId(assignmentId, userId);
    return this.recordEvent({ assignmentId, userId: resolvedUserId, action: AssignmentEventAction.REGENERATED_SECTION, metadata, trace });
  }

  static async recordPdfDownloaded(assignmentId: string | Types.ObjectId, userId: string | Types.ObjectId, metadata: AssignmentEventMetadata = {}, trace?: AssignmentTraceContext) {
    return this.recordEvent({ assignmentId, userId, action: AssignmentEventAction.DOWNLOADED_PDF, metadata, trace });
  }
}
