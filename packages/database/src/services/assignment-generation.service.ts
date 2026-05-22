import { AssignmentRepository } from '../repositories/assignment.repository';
import { AssignmentStatusService } from './assignment-status.service';
import { AssignmentStatus } from '../types/assignment.types';

export class AssignmentGenerationService {
  static async lockForGeneration(assignmentId: string, jobId: string): Promise<boolean> {
    const doc = await AssignmentRepository.findByIdForGeneration(assignmentId);
    if (!doc || !doc.canGenerate()) return false;
    
    doc.markGenerationStarted(jobId);
    await doc.save();
    await AssignmentStatusService.transitionStatus(assignmentId, AssignmentStatus.GENERATING, jobId);
    return true;
  }

  static async markCompleted(assignmentId: string): Promise<void> {
    await AssignmentStatusService.transitionStatus(assignmentId, AssignmentStatus.COMPLETED);
  }

  static async markFailed(assignmentId: string, reason?: string): Promise<void> {
    await AssignmentStatusService.transitionStatus(assignmentId, AssignmentStatus.FAILED);
  }
}
