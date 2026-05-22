import { TIMELINE_SESSION_WINDOW_MINUTES } from '../constants/assignment-event.constants';
import { AssignmentEventLeanDocument, TimelineGroup } from '../types/assignment-event.types';

function groupKeyForEvent(event: AssignmentEventLeanDocument): string {
  const traceId = typeof event.metadata?.traceId === 'string' ? event.metadata.traceId : undefined;
  if (traceId) return `trace:${traceId}`;
  return `session:${event.assignmentId.toString()}:${event.createdAt.toISOString().slice(0, 13)}`;
}

export function groupEventsForTimeline(events: AssignmentEventLeanDocument[]): TimelineGroup[] {
  const sorted = [...events].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const groups: TimelineGroup[] = [];
  const windowMs = TIMELINE_SESSION_WINDOW_MINUTES * 60 * 1000;

  for (const event of sorted) {
    const key = groupKeyForEvent(event);
    const latest = groups.find((group) => group.key === key && Math.abs(group.startAt.getTime() - event.createdAt.getTime()) <= windowMs);

    if (latest) {
      latest.events.push(event);
      latest.eventCount += 1;
      latest.startAt = event.createdAt < latest.startAt ? event.createdAt : latest.startAt;
      latest.endAt = event.createdAt > latest.endAt ? event.createdAt : latest.endAt;
      continue;
    }

    groups.push({
      key,
      traceId: typeof event.metadata?.traceId === 'string' ? event.metadata.traceId : undefined,
      startAt: event.createdAt,
      endAt: event.createdAt,
      eventCount: 1,
      events: [event],
    });
  }

  return groups;
}
