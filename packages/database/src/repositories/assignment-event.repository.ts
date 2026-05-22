import { AssignmentEvent } from '../models/assignment-event.model';

export class AssignmentEventRepository {
  static async logEvent(assignmentId: string, eventType: string, payload?: any): Promise<void> {
    await AssignmentEvent.create({
      assignmentId,
      eventType,
      payload
    });
  }
}
