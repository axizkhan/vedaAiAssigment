import { Assignment } from "../models/assignment.model";
import {
  IAssignment,
  AssignmentDocument,
  CreateAssignmentInput,
  UpdateAssignmentInput,
  AssignmentStatus,
} from "../types/assignment.types";
import {
  AssignmentFilters,
  PaginatedAssignments,
} from "../types/assignment-query.types";
import { Types, FilterQuery } from "mongoose";
import { AssignmentAuditService } from "../services/assignment-audit.service";

type AssignmentProjection = Record<string, 0 | 1>;

function toObjectId(id: string | Types.ObjectId): Types.ObjectId {
  return id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
}

function buildAssignmentQuery(
  filters: Partial<AssignmentFilters> & { createdBy?: Types.ObjectId | string },
): FilterQuery<IAssignment> {
  const query: FilterQuery<IAssignment> = {};

  if (filters.createdBy) query.createdBy = toObjectId(filters.createdBy);
  if (filters.status) query.status = filters.status;
  if (filters.subject) query.subject = filters.subject.toLowerCase();

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = filters.startDate;
    if (filters.endDate) query.createdAt.$lte = filters.endDate;
  }

  if (filters.search) query.$text = { $search: filters.search };
  return query;
}

export class AssignmentRepository {
  static async createAssignment(
    userId: string,
    data: CreateAssignmentInput,
  ): Promise<AssignmentDocument> {
    const assignment = new Assignment({
      ...data,
      createdBy: new Types.ObjectId(userId),
    });
    const saved = await assignment.save();
    await AssignmentAuditService.recordAssignmentCreated(saved._id, userId, {
      subject: saved.subject,
      totalQuestions: saved.totalQuestions,
      totalMarks: saved.totalMarks,
      promptVersion: saved.promptVersion,
    });
    return saved;
  }

  static async findById(
    id: string,
    userId: string,
  ): Promise<IAssignment | null> {
    return Assignment.findOne({ _id: id, createdBy: userId })
      .lean()
      .exec() as unknown as Promise<IAssignment | null>;
  }

  static async findByIdForUser(
    id: string,
    userId: string,
    projection?: AssignmentProjection,
  ): Promise<IAssignment | null> {
    return Assignment.findOne({ _id: id, createdBy: toObjectId(userId) })
      .select(projection ?? {})
      .lean()
      .exec() as unknown as Promise<IAssignment | null>;
  }

  static async findByIdForGeneration(
    id: string,
  ): Promise<AssignmentDocument | null> {
    return Assignment.findById(id).exec();
  }

  static async updateAssignment(
    id: string,
    userId: string,
    data: UpdateAssignmentInput,
  ): Promise<IAssignment | null> {
    const updated = await (Assignment.findOneAndUpdate(
      {
        _id: id,
        createdBy: userId,
        status: { $in: [AssignmentStatus.DRAFT, AssignmentStatus.FAILED] },
      },
      { $set: data },
      { new: true, lean: true },
    ).exec() as unknown as Promise<IAssignment | null>);

    if (updated) {
      await AssignmentAuditService.recordAssignmentUpdated(id, userId, {
        changedFields: Object.keys(data),
        status: updated.status,
      });
    }

    return updated;
  }

  static async findMany(
    filters: AssignmentFilters,
    projection?: AssignmentProjection,
  ): Promise<IAssignment[]> {
    const sortBy = filters.sortBy ?? "createdAt";
    const sortOrder = filters.sortOrder === "asc" ? 1 : -1;
    const skip = (filters.page - 1) * filters.limit;

    return Assignment.find(buildAssignmentQuery(filters))
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(filters.limit)
      .select(projection ?? { extractedText: 0 })
      .lean()
      .exec() as unknown as Promise<IAssignment[]>;
  }

  static async countAssignments(
    filters: Partial<AssignmentFilters>,
  ): Promise<number> {
    return Assignment.countDocuments(buildAssignmentQuery(filters)).exec();
  }

  static async deleteAssignment(id: string, userId: string): Promise<boolean> {
    const result = await Assignment.deleteOne({ _id: id, createdBy: userId });
    return result.deletedCount === 1;
  }

  static async paginateAssignments(
    filters: AssignmentFilters,
  ): Promise<PaginatedAssignments<IAssignment>> {
    const [data, total] = await Promise.all([
      this.findMany(filters, { extractedText: 0 }),
      this.countAssignments(filters),
    ]);

    return {
      data,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  static async attachUploadedFile(
    id: string,
    userId: string,
    s3ObjectKey: string,
    extractedText: string,
    tokenCount: number,
  ): Promise<IAssignment | null> {
    return Assignment.findOneAndUpdate(
      {
        _id: id,
        createdBy: userId,
        status: { $in: [AssignmentStatus.DRAFT, AssignmentStatus.FAILED] },
      },
      {
        $set: {
          s3ObjectKey,
          extractedText,
          extractedTextTokenCount: tokenCount,
        },
      },
      { new: true, lean: true },
    ).exec() as unknown as Promise<IAssignment | null>;
  }

  static async attachUpload(
    id: string,
    userId: string,
    s3ObjectKey: string,
    extractedText: string,
    tokenCount: number,
  ): Promise<IAssignment | null> {
    return this.attachUploadedFile(
      id,
      userId,
      s3ObjectKey,
      extractedText,
      tokenCount,
    );
  }

  static async attachGenerationJob(
    id: string,
    jobId: string,
    status: AssignmentStatus = AssignmentStatus.QUEUED,
  ): Promise<boolean> {
    const result = await Assignment.updateOne(
      { _id: id },
      { $set: { generationJobId: jobId, status } },
    ).exec();
    return result.modifiedCount === 1;
  }

  static async updateGenerationStatus(
    id: string,
    status: AssignmentStatus,
    jobId?: string | null,
  ): Promise<void> {
    const update: any = { status };
    if (jobId !== undefined) {
      update.generationJobId = jobId;
    }
    await Assignment.updateOne({ _id: id }, { $set: update }).exec();
  }

  static async updateStatus(
    id: string,
    status: AssignmentStatus,
    jobId?: string | null,
  ): Promise<boolean> {
    const update: Partial<IAssignment> = { status };
    if (jobId !== undefined) update.generationJobId = jobId;
    const result = await Assignment.updateOne(
      { _id: id },
      { $set: update },
    ).exec();
    return result.modifiedCount === 1;
  }

  static async updateAssignmentRaw(
    id: string,
    data: Record<string, unknown>,
  ): Promise<boolean> {
    const result = await Assignment.updateOne(
      { _id: id },
      { $set: data },
    ).exec();
    return result.modifiedCount === 1;
  }
}
