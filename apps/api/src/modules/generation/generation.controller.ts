import { Request, Response } from 'express';
import { generationService } from './generation.service';
import { sendSuccessResponse } from '../../common/response';

export const triggerGenerationController = async (req: Request, res: Response) => {
  const result = await generationService.triggerGeneration({
    assignmentId: req.params.assignmentId,
    userId: req.user!.id,
    traceId: req.traceId
  });
  return sendSuccessResponse(res, { statusCode: 202, data: result });
};

export const getStatusController = async (req: Request, res: Response) => {
  const result = await generationService.getGenerationStatus(req.params.assignmentId, req.user!.id);
  return sendSuccessResponse(res, { data: result });
};

export const regenerateSectionController = async (req: Request, res: Response) => {
  const result = await generationService.regenerateSection(req.params.assignmentId, req.body, req.user!.id);
  return sendSuccessResponse(res, { data: result });
};

export const getResultController = async (req: Request, res: Response) => {
  const result = await generationService.getGeneratedResult(req.params.assignmentId, req.user!.id);
  return sendSuccessResponse(res, { data: result });
};
