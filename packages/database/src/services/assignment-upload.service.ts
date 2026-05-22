import { AssignmentRepository } from '../repositories/assignment.repository';
import { sanitizeText } from '../utils/assignment-sanitizer';
import { estimateTokens } from '../utils/assignment-token-estimator';
import { MAX_EXTRACTED_TEXT_CHARS } from '../constants/assignment.constants';
import { AssignmentAuditService } from './assignment-audit.service';

export class AssignmentUploadService {
  static async attachFile(assignmentId: string, userId: string, s3Key: string, rawText: string) {
    const sanitized = sanitizeText(rawText) || '';
    if (sanitized.length > MAX_EXTRACTED_TEXT_CHARS) {
      throw new Error(`Text exceeds max characters (${MAX_EXTRACTED_TEXT_CHARS})`);
    }
    const tokens = estimateTokens(sanitized);
    const assignment = await AssignmentRepository.attachUploadedFile(assignmentId, userId, s3Key, sanitized, tokens);
    if (assignment) {
      await AssignmentAuditService.recordFileUploaded(assignmentId, userId, {
        s3ObjectKey: s3Key,
        tokenCount: tokens,
      });
    }
    return assignment;
  }
}
