import { Request, Response, NextFunction } from 'express';
import { validateGenerationEligibility } from './generation.validators';
import { assertGenerationOwnership } from './generation.permissions';
import { validateQuota, triggerGenerationService } from './generation.service';
import { withGenerationLock } from './generation.idempotency';
import { generateTraceId } from './generation.utils';
import { auditGenerationEvent } from './generation.audit';

// Stub for repository
const AssignmentRepo = {
  findById: async (id: string) => ({ _id: id, createdBy: 'mockUser', status: 'DRAFT', extractedText: 'mock' }),
};

export const triggerGeneration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assignmentId } = req.params;
    const userId = (req as any).user.id; // Assumes auth middleware populates req.user
    
    const traceId = generateTraceId(assignmentId);

    // 1. Pre-lock checks (fast rejections)
    const assignment = await AssignmentRepo.findById(assignmentId);
    validateGenerationEligibility(assignment);
    assertGenerationOwnership(assignment.createdBy, userId);
    await validateQuota(userId);

    // 2. Acquire Distributed Lock & Execute
    // This entirely prevents TOCTOU race conditions. If 5 tabs click generate instantly,
    // 1 gets the lock, the other 4 throw a 409 Conflict immediately.
    const result = await withGenerationLock(assignmentId, traceId, userId, async () => {
      
      // Critical: We MUST reload the assignment state inside the lock to ensure 
      // it wasn't queued in the 5ms between our pre-check and lock acquisition.
      const lockedAssignment = await AssignmentRepo.findById(assignmentId);
      
      return await triggerGenerationService({
        assignmentId,
        userId,
        promptVersion: req.body?.promptVersion
      }, traceId, lockedAssignment.status);

    });

    res.status(202).json({
      success: true,
      data: result
    });

  } catch (error) {
    if ((error as any).code === 'ALREADY_IN_PROGRESS' || (error as any).code === 'LOCK_ACQUISITION_FAILED') {
      auditGenerationEvent('duplicate_request_blocked', req.params.assignmentId, (req as any).user?.id, 'pre-lock');
    }
    next(error);
  }
};
