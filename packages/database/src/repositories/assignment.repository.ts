import { Assignment } from '../models/assignment.model';
import { IAssignment, AssignmentDocument, CreateAssignmentInput, UpdateAssignmentInput, AssignmentStatus } from '../types/assignment.types';
import { AssignmentFilters, PaginatedAssignments } from '../types/assignment-query.types';
import { Types, FilterQuery } from 'mongoose';

export class AssignmentRepository {
  static async createAssignment(userId: string, data: CreateAssignmentInput): Promise<AssignmentDocument> {
    const assignment = new Assignment({
      ...data,
      createdBy: new Types.ObjectId(userId)
    });
    return assignment.save();
  }

  static async findById(id: string, userId: string): Promise<IAssignment | null> {
    return Assignment.findOne({ _id: id, createdBy: userId }).lean().exec() as unknown as Promise<IAssignment | null>;
  }

  static async findByIdForGeneration(id: string): Promise<AssignmentDocument | null> {
    return Assignment.findById(id).exec();
  }

  static async updateAssignment(id: string, userId: string, data: UpdateAssignmentInput): Promise<IAssignment | null> {
    return Assignment.findOneAndUpdate(
      { _id: id, createdBy: userId, status: { $in: [AssignmentStatus.DRAFT, AssignmentStatus.FAILED] } },
      { $set: data },
      { new: true, lean: true }
    ).exec() as unknown as Promise<IAssignment | null>;
  }

  static async deleteAssignment(id: string, userId: string): Promise<boolean> {
    const result = await Assignment.deleteOne({ _id: id, createdBy: userId });
    return result.deletedCount === 1;
  }

  static async paginateAssignments(filters: AssignmentFilters): Promise<PaginatedAssignments<IAssignment>> {
    const query: FilterQuery<IAssignment> = { createdBy: new Types.ObjectId(filters.createdBy) };

    if (filters.status) query.status = filters.status;
    if (filters.subject) query.subject = filters.subject.toLowerCase();
    
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const skip = (filters.page - 1) * filters.limit;

    const [data, total] = await Promise.all([
      Assignment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(filters.limit)
        .select('-extractedText') // Lean projection
        .lean()
        .exec() as unknown as Promise<IAssignment[]>,
      Assignment.countDocuments(query)
    ]);

    return {
      data,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit)
    };
  }

  static async attachUploadedFile(id: string, userId: string, s3ObjectKey: string, extractedText: string, tokenCount: number): Promise<IAssignment | null> {
    return Assignment.findOneAndUpdate(
      { _id: id, createdBy: userId, status: { $in: [AssignmentStatus.DRAFT, AssignmentStatus.FAILED] } },
      { $set: { s3ObjectKey, extractedText, extractedTextTokenCount: tokenCount } },
      { new: true, lean: true }
    ).exec() as unknown as Promise<IAssignment | null>;
  }

  static async updateGenerationStatus(id: string, status: AssignmentStatus, jobId?: string | null): Promise<void> {
    const update: any = { status };
    if (jobId !== undefined) {
      update.generationJobId = jobId;
    }
    await Assignment.updateOne({ _id: id }, { $set: update }).exec();
  }
}
