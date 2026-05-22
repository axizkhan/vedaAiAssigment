import { logger } from '@assessment-ai/logger';
import { AssignmentRepository, AssignmentStatus as DbAssignmentStatus } from '@assessment-ai/database';
import { ForbiddenError, ResourceNotFoundError, SchemaValidationError } from '../../common/errors';
import { AssignmentAudit } from './assignment.audit';
import { buildSafeAssignmentFilters } from './assignment.query-builder';
import { mapAssignmentToDTO } from './assignment.mapper';
import { createPaginationMeta } from './assignment.pagination';
import { isAssignmentOwner } from './assignment.permissions';
import { canUserEditAssignment } from './assignment.status';
import { AssignmentDTO, AssignmentListQuery, CreateAssignmentInput, UpdateAssignmentInput } from './assignment.types';
import { changedFieldNames, stripSystemManagedAssignmentFields } from './assignment.utils';

export class AssignmentNotFoundError extends ResourceNotFoundError {
  constructor() {
    super('Assignment');
  }
}

export class AssignmentForbiddenError extends ForbiddenError {
  constructor() {
    super('You do not have permission');
  }
}

export class AssignmentValidationError extends SchemaValidationError {}

export class InvalidAssignmentStatusError extends AssignmentValidationError {
  constructor(status: DbAssignmentStatus) {
    super({ status: [`Assignment cannot be edited while status is ${status}.`] });
  }
}

export interface AssignmentServiceContext<TInput = unknown> {
  userId: string;
  input: TInput;
  traceId?: string;
}

export class AssignmentService {
  private async getOwnedAssignmentOrThrow(id: string, userId: string, traceId?: string) {
    const assignment = await AssignmentRepository.findByIdForUser(id, userId, { extractedText: 0 });
    if (assignment) return assignment;

    const existing = await AssignmentRepository.findByIdForGeneration(id);
    if (!existing) throw new AssignmentNotFoundError();

    if (!isAssignmentOwner(existing, userId)) {
      AssignmentAudit.ownershipViolation(id, userId, traceId);
      throw new AssignmentForbiddenError();
    }

    throw new AssignmentNotFoundError();
  }

  async createAssignment(context: AssignmentServiceContext<CreateAssignmentInput>): Promise<AssignmentDTO> {
    const assignment = await AssignmentRepository.createAssignment(context.userId, context.input);
    const dto = mapAssignmentToDTO(assignment);
    AssignmentAudit.created(dto.id, context.userId, context.traceId);
    logger.info({ assignmentId: dto.id, userId: context.userId, traceId: context.traceId }, 'assignment created');
    return dto;
  }

  async getAssignments(context: AssignmentServiceContext<AssignmentListQuery>): Promise<{ assignments: AssignmentDTO[]; meta: ReturnType<typeof createPaginationMeta> }> {
    const filters = buildSafeAssignmentFilters(context.userId, context.input);
    AssignmentAudit.queried(context.userId, {
      status: filters.status,
      subject: filters.subject,
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }, context.traceId);

    const result = await AssignmentRepository.paginateAssignments(filters);
    return {
      assignments: result.data.map(mapAssignmentToDTO),
      meta: createPaginationMeta(result.page, result.limit, result.total),
    };
  }

  async getAssignmentById(context: AssignmentServiceContext<{ id: string }>): Promise<AssignmentDTO> {
    const assignment = await this.getOwnedAssignmentOrThrow(context.input.id, context.userId, context.traceId);
    return mapAssignmentToDTO(assignment);
  }

  async updateAssignment(context: AssignmentServiceContext<{ id: string; update: UpdateAssignmentInput }>): Promise<AssignmentDTO> {
    const existing = await this.getOwnedAssignmentOrThrow(context.input.id, context.userId, context.traceId);
    if (!canUserEditAssignment(existing.status)) throw new InvalidAssignmentStatusError(existing.status);

    const update = stripSystemManagedAssignmentFields(context.input.update as Record<string, unknown>) as UpdateAssignmentInput;
    const changedFields = changedFieldNames(update);
    if (changedFields.length === 0) throw new AssignmentValidationError({ update: ['No valid assignment fields were provided.'] });

    const updated = await AssignmentRepository.updateAssignment(context.input.id, context.userId, update);
    if (!updated) throw new AssignmentNotFoundError();

    const dto = mapAssignmentToDTO(updated);
    AssignmentAudit.updated(dto.id, context.userId, changedFields, context.traceId);
    logger.info({ assignmentId: dto.id, userId: context.userId, changedFields, traceId: context.traceId }, 'assignment updated');
    return dto;
  }

  async deleteAssignment(context: AssignmentServiceContext<{ id: string }>): Promise<void> {
    await this.getOwnedAssignmentOrThrow(context.input.id, context.userId, context.traceId);

    const deleted = await AssignmentRepository.deleteAssignment(context.input.id, context.userId);
    if (!deleted) throw new AssignmentForbiddenError();

    AssignmentAudit.deleted(context.input.id, context.userId, context.traceId);
    logger.info({ assignmentId: context.input.id, userId: context.userId, traceId: context.traceId }, 'assignment deleted');
  }
}

export const assignmentService = new AssignmentService();
