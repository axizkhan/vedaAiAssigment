import { AssignmentRepository } from '../repositories/assignment.repository';
import { AssignmentEventRepository } from '../repositories/assignment-event.repository';
import { AssignmentStatus } from '../types/assignment.types';

export class AssignmentStatusService {
  static async transitionStatus(assignmentId: string, status: AssignmentStatus, jobId?: string): Promise<void> {
    await AssignmentRepository.updateGenerationStatus(assignmentId, status, jobId);
    await AssignmentEventRepository.logEvent(assignmentId, `STATUS_CHANGED_${status.toUpperCase()}`, { jobId });
  }
}
