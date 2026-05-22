import { logger } from '@assessment-ai/logger';
import { FilterQuery, Types } from 'mongoose';
import { MAX_VERSION_APPEND_RETRIES } from '../constants/generated-paper.constants';
import { Assignment } from '../models/assignment.model';
import { GeneratedPaper } from '../models/generated-paper.model';
import {
  CreateGeneratedPaperInput,
  CreatePaperVersionInput,
  GeneratedPaperLeanDocument,
  IGeneratedPaper,
  IPaperVersion,
  PaginatedGeneratedPapers,
  PaperAccessScope,
  PaperPaginationInput,
  PaperVersionSummary,
} from '../types/generated-paper.types';
import { calculateTotalMarks } from '../utils/paper-marks-calculator';
import { countQuestions } from '../utils/paper-question-counter';
import { createPaperVersionSchema, paperVersionSchema } from '../validators/paper-version.validator';

function toObjectId(id: string | Types.ObjectId): Types.ObjectId {
  return id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
}

function buildVersionSummary(version: IPaperVersion): PaperVersionSummary {
  return {
    version: version.version,
    totalSections: version.sections.length,
    totalQuestions: countQuestions(version),
    totalMarks: calculateTotalMarks(version),
    model: version.metadata.model,
    retryCount: version.metadata.retryCount,
    estimatedCost: version.metadata.estimatedCost,
    pdfS3Key: version.pdfS3Key,
    pdfGeneratedAt: version.pdfGeneratedAt,
    createdAt: version.createdAt,
  };
}

async function assertAssignmentAccess(assignmentId: Types.ObjectId, scope?: PaperAccessScope): Promise<void> {
  if (!scope?.userId || scope.adminOverride) return;

  const exists = await Assignment.exists({ _id: assignmentId, createdBy: toObjectId(scope.userId) });
  if (!exists) throw new Error('Generated paper not found or access denied.');
}

export class GeneratedPaperRepository {
  static async createGeneratedPaper(input: CreateGeneratedPaperInput, scope?: PaperAccessScope): Promise<GeneratedPaperLeanDocument> {
    const assignmentId = toObjectId(input.assignmentId);
    await assertAssignmentAccess(assignmentId, scope);

    const parsed = createPaperVersionSchema.parse({ sections: input.sections, metadata: input.metadata });
    const version: IPaperVersion = paperVersionSchema.parse({
      version: 1,
      sections: parsed.sections,
      metadata: parsed.metadata,
      pdfS3Key: null,
      pdfGeneratedAt: null,
      createdAt: new Date(),
    });

    const paper = await GeneratedPaper.create({
      assignmentId,
      activeVersion: input.makeActive === false ? 1 : 1,
      versions: [version],
    });

    logger.info({ assignmentId: assignmentId.toString(), version: 1, traceId: input.traceId }, 'generated paper created');
    return paper.toObject() as GeneratedPaperLeanDocument;
  }

  static async appendVersion(input: CreatePaperVersionInput, scope?: PaperAccessScope): Promise<IPaperVersion> {
    const assignmentId = toObjectId(input.assignmentId);
    await assertAssignmentAccess(assignmentId, scope);
    const parsed = createPaperVersionSchema.parse({ sections: input.sections, metadata: input.metadata });

    for (let attempt = 1; attempt <= MAX_VERSION_APPEND_RETRIES; attempt += 1) {
      const existing = await GeneratedPaper.findOne({ assignmentId })
        .select({ 'versions.version': 1 })
        .lean()
        .exec() as Pick<IGeneratedPaper, 'versions'> | null;

      if (!existing) throw new Error('Generated paper not found.');

      const nextVersion = Math.max(...existing.versions.map((version) => version.version), 0) + 1;
      const version: IPaperVersion = paperVersionSchema.parse({
        version: nextVersion,
        sections: parsed.sections,
        metadata: parsed.metadata,
        pdfS3Key: null,
        pdfGeneratedAt: null,
        createdAt: new Date(),
      });

      const update: Record<string, unknown> = {
        $push: { versions: version },
        $set: { updatedAt: new Date(), ...(input.makeActive === false ? {} : { activeVersion: nextVersion }) },
      };

      const result = await GeneratedPaper.updateOne(
        { assignmentId, 'versions.version': { $ne: nextVersion } },
        update,
        { runValidators: true }
      ).exec();

      if (result.modifiedCount === 1) {
        logger.info({ assignmentId: assignmentId.toString(), version: nextVersion, attempt, traceId: input.traceId }, 'generated paper version appended');
        return version;
      }
    }

    logger.error({ assignmentId: assignmentId.toString(), traceId: input.traceId }, 'failed to append generated paper version after retries');
    throw new Error('Unable to append generated paper version safely. Please retry.');
  }

  static async getActiveVersion(assignmentIdInput: string | Types.ObjectId, scope?: PaperAccessScope): Promise<IPaperVersion | null> {
    const assignmentId = toObjectId(assignmentIdInput);
    await assertAssignmentAccess(assignmentId, scope);

    const [paper] = await GeneratedPaper.aggregate<{ version: IPaperVersion }>([
      { $match: { assignmentId } },
      { $project: { version: { $first: { $filter: { input: '$versions', as: 'version', cond: { $eq: ['$$version.version', '$activeVersion'] } } } } } },
    ]).exec();

    return paper?.version ?? null;
  }

  static async getVersion(assignmentIdInput: string | Types.ObjectId, versionNumber: number, scope?: PaperAccessScope): Promise<IPaperVersion | null> {
    const assignmentId = toObjectId(assignmentIdInput);
    await assertAssignmentAccess(assignmentId, scope);

    const [paper] = await GeneratedPaper.aggregate<{ version: IPaperVersion }>([
      { $match: { assignmentId } },
      { $project: { version: { $first: { $filter: { input: '$versions', as: 'version', cond: { $eq: ['$$version.version', versionNumber] } } } } } },
    ]).exec();

    return paper?.version ?? null;
  }

  static async setActiveVersion(assignmentIdInput: string | Types.ObjectId, versionNumber: number, scope?: PaperAccessScope & { traceId?: string }): Promise<boolean> {
    const assignmentId = toObjectId(assignmentIdInput);
    await assertAssignmentAccess(assignmentId, scope);

    const result = await GeneratedPaper.updateOne(
      { assignmentId, 'versions.version': versionNumber },
      { $set: { activeVersion: versionNumber, updatedAt: new Date() } },
      { runValidators: true }
    ).exec();

    const switched = result.modifiedCount === 1;
    if (switched) logger.info({ assignmentId: assignmentId.toString(), version: versionNumber, traceId: scope?.traceId }, 'generated paper active version switched');
    return switched;
  }

  static async findByAssignmentId(assignmentIdInput: string | Types.ObjectId, scope?: PaperAccessScope): Promise<GeneratedPaperLeanDocument | null> {
    const assignmentId = toObjectId(assignmentIdInput);
    await assertAssignmentAccess(assignmentId, scope);
    return GeneratedPaper.findOne({ assignmentId }).lean().exec() as Promise<GeneratedPaperLeanDocument | null>;
  }

  static async findByAssignmentIdWithVersion(assignmentIdInput: string | Types.ObjectId, versionNumber: number, scope?: PaperAccessScope): Promise<{ paper: Omit<IGeneratedPaper, 'versions'>; version: IPaperVersion } | null> {
    const assignmentId = toObjectId(assignmentIdInput);
    await assertAssignmentAccess(assignmentId, scope);

    const [result] = await GeneratedPaper.aggregate<{ paper: Omit<IGeneratedPaper, 'versions'>; version: IPaperVersion }>([
      { $match: { assignmentId } },
      {
        $project: {
          paper: { assignmentId: '$assignmentId', activeVersion: '$activeVersion', createdAt: '$createdAt', updatedAt: '$updatedAt' },
          version: { $first: { $filter: { input: '$versions', as: 'version', cond: { $eq: ['$$version.version', versionNumber] } } } },
        },
      },
      { $match: { version: { $ne: null } } },
    ]).exec();

    return result ?? null;
  }

  static async updatePdfMetadata(assignmentIdInput: string | Types.ObjectId, versionNumber: number, pdfS3Key: string, generatedAt = new Date(), scope?: PaperAccessScope & { traceId?: string }): Promise<boolean> {
    const assignmentId = toObjectId(assignmentIdInput);
    await assertAssignmentAccess(assignmentId, scope);

    const result = await GeneratedPaper.updateOne(
      { assignmentId, 'versions.version': versionNumber },
      { $set: { 'versions.$.pdfS3Key': pdfS3Key, 'versions.$.pdfGeneratedAt': generatedAt, updatedAt: new Date() } },
      { runValidators: true }
    ).exec();

    const updated = result.modifiedCount === 1;
    if (updated) logger.info({ assignmentId: assignmentId.toString(), version: versionNumber, traceId: scope?.traceId }, 'generated paper PDF metadata attached');
    return updated;
  }

  static async deleteGeneratedPaper(assignmentIdInput: string | Types.ObjectId, scope?: PaperAccessScope): Promise<boolean> {
    const assignmentId = toObjectId(assignmentIdInput);
    await assertAssignmentAccess(assignmentId, scope);
    const result = await GeneratedPaper.deleteOne({ assignmentId }).exec();
    return result.deletedCount === 1;
  }

  static async paginateGeneratedPapers(input: PaperPaginationInput): Promise<PaginatedGeneratedPapers<GeneratedPaperLeanDocument>> {
    const page = Math.max(input.page ?? 1, 1);
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const query: FilterQuery<IGeneratedPaper> = {};

    if (input.assignmentIds?.length) {
      query.assignmentId = { $in: input.assignmentIds.map(toObjectId) };
    }

    if (input.userId && !input.adminOverride) {
      const assignments = await Assignment.find({ createdBy: toObjectId(input.userId) }).select('_id').lean().exec();
      const ownedAssignmentIds = assignments.map((assignment) => assignment._id);
      query.assignmentId = query.assignmentId
        ? { $in: (query.assignmentId as { $in: Types.ObjectId[] }).$in.filter((id) => ownedAssignmentIds.some((ownedId) => ownedId.equals(id))) }
        : { $in: ownedAssignmentIds };
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      GeneratedPaper.find(query)
        .select({ assignmentId: 1, activeVersion: 1, createdAt: 1, updatedAt: 1, 'versions.version': 1, 'versions.metadata': 1, 'versions.pdfS3Key': 1, 'versions.pdfGeneratedAt': 1, 'versions.createdAt': 1 })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec() as Promise<GeneratedPaperLeanDocument[]>,
      GeneratedPaper.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async listVersionSummaries(assignmentIdInput: string | Types.ObjectId, scope?: PaperAccessScope): Promise<PaperVersionSummary[]> {
    const assignmentId = toObjectId(assignmentIdInput);
    await assertAssignmentAccess(assignmentId, scope);
    const paper = await GeneratedPaper.findOne({ assignmentId }).select({ versions: 1 }).lean().exec() as Pick<IGeneratedPaper, 'versions'> | null;
    return paper?.versions.map(buildVersionSummary) ?? [];
  }
}
