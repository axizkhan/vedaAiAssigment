import { logger } from '@assessment-ai/logger';
import { FilterQuery, Types } from 'mongoose';
import { MAX_TIMELINE_PAGE_SIZE } from '../constants/assignment-event.constants';
import { Assignment } from '../models/assignment.model';
import { AssignmentEvent } from '../models/assignment-event.model';
import {
  AssignmentEventAccessScope,
  AssignmentEventAction,
  AssignmentEventActionCount,
  AssignmentEventFilters,
  AssignmentEventLeanDocument,
  CreateAssignmentEventInput,
  IAssignmentEvent,
  PaginatedAssignmentEvents,
} from '../types/assignment-event.types';
import { assertSupportedAssignmentEventAction, isSupportedAssignmentEventAction } from '../utils/event-action-validator';
import { attachEventTrace } from '../utils/event-trace-builder';
import { sanitizeEventMetadata } from '../utils/event-metadata-sanitizer';

function toObjectId(id: string | Types.ObjectId): Types.ObjectId {
  return id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
}

async function assertAssignmentAccess(assignmentId: Types.ObjectId, scope?: AssignmentEventAccessScope): Promise<void> {
  if (!scope?.userId || scope.adminOverride) return;
  const exists = await Assignment.exists({ _id: assignmentId, createdBy: toObjectId(scope.userId) });
  if (!exists) throw new Error('Assignment event not found or access denied.');
}

async function inferAssignmentUserId(assignmentId: Types.ObjectId): Promise<Types.ObjectId> {
  const assignment = await Assignment.findById(assignmentId).select('createdBy').lean().exec() as { createdBy: Types.ObjectId } | null;
  if (!assignment) throw new Error('Assignment not found for audit event.');
  return assignment.createdBy;
}

function buildQuery(filters: AssignmentEventFilters): FilterQuery<IAssignmentEvent> {
  const query: FilterQuery<IAssignmentEvent> = {};
  if (filters.assignmentId) query.assignmentId = toObjectId(filters.assignmentId);
  if (filters.userId) query.userId = toObjectId(filters.userId);
  if (filters.action) query.action = filters.action;
  if (filters.traceId) query['metadata.traceId'] = filters.traceId;
  if (filters.jobId) query['metadata.jobId'] = filters.jobId;
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = filters.startDate;
    if (filters.endDate) query.createdAt.$lte = filters.endDate;
  }
  return query;
}

export class AssignmentEventRepository {
  static async createEvent(input: CreateAssignmentEventInput): Promise<AssignmentEventLeanDocument> {
    assertSupportedAssignmentEventAction(input.action);
    const assignmentId = toObjectId(input.assignmentId);
    const userId = toObjectId(input.userId);
    const metadata = sanitizeEventMetadata(attachEventTrace(input.metadata, input.trace), input.trace?.traceId);

    const event = await AssignmentEvent.create({ assignmentId, userId, action: input.action, metadata });
    logger.info({ assignmentId: assignmentId.toString(), userId: userId.toString(), action: input.action, traceId: metadata.traceId }, 'assignment audit event created');
    return event.toObject() as AssignmentEventLeanDocument;
  }

  static async bulkCreateEvents(inputs: CreateAssignmentEventInput[]): Promise<AssignmentEventLeanDocument[]> {
    const events = inputs.map((input) => {
      assertSupportedAssignmentEventAction(input.action);
      const metadata = sanitizeEventMetadata(attachEventTrace(input.metadata, input.trace), input.trace?.traceId);
      return {
        assignmentId: toObjectId(input.assignmentId),
        userId: toObjectId(input.userId),
        action: input.action,
        metadata,
        createdAt: new Date(),
      };
    });

    const created = await AssignmentEvent.insertMany(events, { ordered: false });
    logger.info({ count: created.length }, 'assignment audit events bulk created');
    return created.map((event) => event.toObject() as AssignmentEventLeanDocument);
  }

  static async logEvent(assignmentId: string, eventType: string, payload?: Record<string, unknown>, userId?: string): Promise<void> {
    if (!isSupportedAssignmentEventAction(eventType)) {
      logger.warn({ assignmentId, eventType }, 'ignored unsupported legacy assignment event');
      return;
    }
    const assignmentObjectId = toObjectId(assignmentId);
    const resolvedUserId = userId ? toObjectId(userId) : await inferAssignmentUserId(assignmentObjectId);
    await this.createEvent({ assignmentId: assignmentObjectId, userId: resolvedUserId, action: eventType, metadata: payload });
  }

  static async findByAssignment(assignmentIdInput: string | Types.ObjectId, scope?: AssignmentEventAccessScope, limit = 50): Promise<AssignmentEventLeanDocument[]> {
    const assignmentId = toObjectId(assignmentIdInput);
    await assertAssignmentAccess(assignmentId, scope);
    return AssignmentEvent.find({ assignmentId })
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, MAX_TIMELINE_PAGE_SIZE))
      .lean()
      .exec() as Promise<AssignmentEventLeanDocument[]>;
  }

  static async findByUser(userIdInput: string | Types.ObjectId, scope?: AssignmentEventAccessScope, limit = 50): Promise<AssignmentEventLeanDocument[]> {
    const userId = toObjectId(userIdInput);
    if (scope?.userId && !scope.adminOverride && !toObjectId(scope.userId).equals(userId)) throw new Error('Assignment event access denied.');
    return AssignmentEvent.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, MAX_TIMELINE_PAGE_SIZE))
      .lean()
      .exec() as Promise<AssignmentEventLeanDocument[]>;
  }

  static async findRecentEvents(scope?: AssignmentEventAccessScope, limit = 50): Promise<AssignmentEventLeanDocument[]> {
    const query: FilterQuery<IAssignmentEvent> = {};
    if (scope?.userId && !scope.adminOverride) query.userId = toObjectId(scope.userId);
    return AssignmentEvent.find(query)
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, MAX_TIMELINE_PAGE_SIZE))
      .lean()
      .exec() as Promise<AssignmentEventLeanDocument[]>;
  }

  static async paginateEvents(filters: AssignmentEventFilters): Promise<PaginatedAssignmentEvents> {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.min(Math.max(filters.limit ?? 25, 1), MAX_TIMELINE_PAGE_SIZE);
    const query = buildQuery(filters);

    if (filters.assignmentId) await assertAssignmentAccess(toObjectId(filters.assignmentId), filters);
    if (filters.userId && !filters.adminOverride) query.userId = toObjectId(filters.userId);

    const projection: Record<string, 0 | 1> = filters.includeMetadata === false ? { metadata: 0 } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      AssignmentEvent.find(query).select(projection).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec() as Promise<AssignmentEventLeanDocument[]>,
      AssignmentEvent.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async findByTraceId(traceId: string, scope?: AssignmentEventAccessScope): Promise<AssignmentEventLeanDocument[]> {
    const query: FilterQuery<IAssignmentEvent> = { 'metadata.traceId': traceId };
    if (scope?.userId && !scope.adminOverride) query.userId = toObjectId(scope.userId);
    return AssignmentEvent.find(query).sort({ createdAt: 1 }).lean().exec() as Promise<AssignmentEventLeanDocument[]>;
  }

  static async findGenerationFailures(filters: Omit<AssignmentEventFilters, 'action'> = {}): Promise<AssignmentEventLeanDocument[]> {
    if (filters.assignmentId) await assertAssignmentAccess(toObjectId(filters.assignmentId), filters);
    return AssignmentEvent.find({ ...buildQuery(filters), action: AssignmentEventAction.FAILED_GENERATION })
      .sort({ createdAt: -1 })
      .limit(Math.min(filters.limit ?? 50, MAX_TIMELINE_PAGE_SIZE))
      .lean()
      .exec() as Promise<AssignmentEventLeanDocument[]>;
  }

  static async countEventsByAction(filters: AssignmentEventFilters = {}): Promise<AssignmentEventActionCount[]> {
    if (filters.assignmentId) await assertAssignmentAccess(toObjectId(filters.assignmentId), filters);
    const query = buildQuery(filters);
    const rows = await AssignmentEvent.aggregate<{ _id: AssignmentEventAction; count: number }>([
      { $match: query },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).exec();

    return rows.map((row) => ({ action: row._id, count: row.count }));
  }
}
