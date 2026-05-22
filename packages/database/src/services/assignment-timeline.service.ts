import { Types } from 'mongoose';
import { AssignmentEventRepository } from '../repositories/assignment-event.repository';
import { AssignmentEventAccessScope, AssignmentEventLeanDocument, TimelineGroup } from '../types/assignment-event.types';
import { groupEventsForTimeline } from '../utils/event-timeline-grouping';

export interface AssignmentTimeline {
  assignmentId: Types.ObjectId;
  events: AssignmentEventLeanDocument[];
  groups: TimelineGroup[];
}

export class AssignmentTimelineService {
  static async getAssignmentTimeline(
    assignmentId: string | Types.ObjectId,
    scope?: AssignmentEventAccessScope,
    limit = 100
  ): Promise<AssignmentTimeline> {
    const events = await AssignmentEventRepository.findByAssignment(assignmentId, scope, limit);
    return {
      assignmentId: assignmentId instanceof Types.ObjectId ? assignmentId : new Types.ObjectId(assignmentId),
      events,
      groups: groupEventsForTimeline(events),
    };
  }

  static formatTimelineEvent(event: AssignmentEventLeanDocument): Record<string, unknown> {
    return {
      id: event._id,
      assignmentId: event.assignmentId,
      userId: event.userId,
      action: event.action,
      metadata: event.metadata,
      createdAt: event.createdAt,
    };
  }
}
