import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../middleware/error.middleware';
import {
  createAssignmentController,
  deleteAssignmentController,
  getAssignmentController,
  listAssignmentsController,
  updateAssignmentController,
} from './assignment.controller';
import { assignmentListQuerySchema, assignmentParamsSchema, createAssignmentSchema, updateAssignmentSchema } from './assignment.schemas';
import { validateAssignmentBody, validateAssignmentParams, validateAssignmentQuery } from './assignment.validators';

export const assignmentRouter: Router = Router();

assignmentRouter.use(authenticate);

assignmentRouter.post('/', validateAssignmentBody(createAssignmentSchema), asyncHandler(createAssignmentController));
assignmentRouter.get('/', validateAssignmentQuery(assignmentListQuerySchema), asyncHandler(listAssignmentsController));
assignmentRouter.get('/:id', validateAssignmentParams(assignmentParamsSchema), asyncHandler(getAssignmentController));
assignmentRouter.patch('/:id', validateAssignmentParams(assignmentParamsSchema), validateAssignmentBody(updateAssignmentSchema), asyncHandler(updateAssignmentController));
assignmentRouter.delete('/:id', validateAssignmentParams(assignmentParamsSchema), asyncHandler(deleteAssignmentController));
