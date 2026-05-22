import { logger } from '@assessment-ai/logger';

type AssignmentAuditAction = 'created' | 'updated' | 'deleted' | 'query' | 'ownership_violation';

function audit(action: AssignmentAuditAction, metadata: Record<string, unknown>): void {
  logger.info({ action, ...metadata }, 'assignment audit event');
}

export const AssignmentAudit = {
  created(assignmentId: string, userId: string, traceId?: string) {
    audit('created', { assignmentId, userId, traceId });
  },
  updated(assignmentId: string, userId: string, changedFields: string[], traceId?: string) {
    audit('updated', { assignmentId, userId, changedFields, traceId });
  },
  deleted(assignmentId: string, userId: string, traceId?: string) {
    audit('deleted', { assignmentId, userId, traceId });
  },
  queried(userId: string, filters: Record<string, unknown>, traceId?: string) {
    audit('query', { userId, filters, traceId });
  },
  ownershipViolation(assignmentId: string, userId: string, traceId?: string) {
    logger.warn({ action: 'ownership_violation', assignmentId, userId, traceId }, 'assignment ownership violation');
  },
};
