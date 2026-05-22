import { FilterQuery, Types } from 'mongoose';
import { AssignmentEvent } from '../models/assignment-event.model';
import { AssignmentEventAction, AssignmentEventAnalytics, IAssignmentEvent } from '../types/assignment-event.types';

const zeroActionCounts = (): Record<AssignmentEventAction, number> => ({
  [AssignmentEventAction.CREATED]: 0,
  [AssignmentEventAction.UPDATED]: 0,
  [AssignmentEventAction.UPLOADED_FILE]: 0,
  [AssignmentEventAction.TRIGGERED_GENERATION]: 0,
  [AssignmentEventAction.REGENERATED_SECTION]: 0,
  [AssignmentEventAction.DOWNLOADED_PDF]: 0,
  [AssignmentEventAction.FAILED_GENERATION]: 0,
});

export interface AssignmentEventAnalyticsFilters {
  assignmentId?: string | Types.ObjectId;
  userId?: string | Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
}

function toObjectId(id: string | Types.ObjectId): Types.ObjectId {
  return id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
}

function buildAnalyticsMatch(filters: AssignmentEventAnalyticsFilters): FilterQuery<IAssignmentEvent> {
  const match: FilterQuery<IAssignmentEvent> = {};
  if (filters.assignmentId) match.assignmentId = toObjectId(filters.assignmentId);
  if (filters.userId) match.userId = toObjectId(filters.userId);
  if (filters.startDate || filters.endDate) {
    match.createdAt = {};
    if (filters.startDate) match.createdAt.$gte = filters.startDate;
    if (filters.endDate) match.createdAt.$lte = filters.endDate;
  }
  return match;
}

export class AssignmentEventAnalyticsService {
  static async calculate(filters: AssignmentEventAnalyticsFilters = {}): Promise<AssignmentEventAnalytics> {
    const match = buildAnalyticsMatch(filters);
    const [actionRows, retryRows, users] = await Promise.all([
      AssignmentEvent.aggregate<{ _id: AssignmentEventAction; count: number }>([
        { $match: match },
        { $group: { _id: '$action', count: { $sum: 1 } } },
      ]).exec(),
      AssignmentEvent.aggregate<{ averageRetryCount: number }>([
        { $match: { ...match, action: { $in: [AssignmentEventAction.FAILED_GENERATION, AssignmentEventAction.TRIGGERED_GENERATION] } } },
        { $group: { _id: null, averageRetryCount: { $avg: { $ifNull: ['$metadata.retryCount', 0] } } } },
      ]).exec(),
      AssignmentEvent.distinct('userId', match).exec(),
    ]);

    const eventsByAction = zeroActionCounts();
    for (const row of actionRows) eventsByAction[row._id] = row.count;

    const triggered = eventsByAction[AssignmentEventAction.TRIGGERED_GENERATION];
    const failed = eventsByAction[AssignmentEventAction.FAILED_GENERATION];
    const totalEvents = Object.values(eventsByAction).reduce((sum, count) => sum + count, 0);

    return {
      totalEvents,
      eventsByAction,
      generationFailureRate: triggered + failed === 0 ? 0 : Number((failed / (triggered + failed)).toFixed(4)),
      uploadCount: eventsByAction[AssignmentEventAction.UPLOADED_FILE],
      pdfDownloadCount: eventsByAction[AssignmentEventAction.DOWNLOADED_PDF],
      averageRetryCount: Number((retryRows[0]?.averageRetryCount ?? 0).toFixed(2)),
      activeUserCount: users.length,
    };
  }

  static async activityHeatmap(filters: AssignmentEventAnalyticsFilters = {}): Promise<Array<{ date: string; count: number }>> {
    const rows = await AssignmentEvent.aggregate<{ _id: string; count: number }>([
      { $match: buildAnalyticsMatch(filters) },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]).exec();

    return rows.map((row) => ({ date: row._id, count: row.count }));
  }
}
