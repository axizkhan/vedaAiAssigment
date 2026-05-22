import { Request, Response } from 'express';
import { sendSuccessResponse } from '../../common/response';
import { assignmentService } from './assignment.service';

function requireRequestUserId(req: Request): string {
  if (!req.user?.id) throw new Error('Authenticated user missing from request.');
  return req.user.id;
}

export async function createAssignmentController(req: Request, res: Response) {
  const assignment = await assignmentService.createAssignment({
    userId: requireRequestUserId(req),
    input: req.body,
    traceId: req.traceId,
  });

  return sendSuccessResponse(res, {
    statusCode: 201,
    data: { assignment },
    traceId: req.traceId,
  });
}

export async function listAssignmentsController(req: Request, res: Response) {
  const result = await assignmentService.getAssignments({
    userId: requireRequestUserId(req),
    input: req.query as never,
    traceId: req.traceId,
  });

  return sendSuccessResponse(res, {
    data: { assignments: result.assignments },
    meta: result.meta,
    traceId: req.traceId,
  });
}

export async function getAssignmentController(req: Request, res: Response) {
  const assignment = await assignmentService.getAssignmentById({
    userId: requireRequestUserId(req),
    input: { id: req.params.id },
    traceId: req.traceId,
  });

  return sendSuccessResponse(res, {
    data: { assignment },
    traceId: req.traceId,
  });
}

export async function updateAssignmentController(req: Request, res: Response) {
  const assignment = await assignmentService.updateAssignment({
    userId: requireRequestUserId(req),
    input: { id: req.params.id, update: req.body },
    traceId: req.traceId,
  });

  return sendSuccessResponse(res, {
    data: { assignment },
    traceId: req.traceId,
  });
}

export async function deleteAssignmentController(req: Request, res: Response) {
  await assignmentService.deleteAssignment({
    userId: requireRequestUserId(req),
    input: { id: req.params.id },
    traceId: req.traceId,
  });

  return res.status(204).send();
}
