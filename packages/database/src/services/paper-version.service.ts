import { logger } from '@assessment-ai/logger';
import { Types } from 'mongoose';
import { GeneratedPaperRepository } from '../repositories/generated-paper.repository';
import { CreateGeneratedPaperInput, CreatePaperVersionInput, IPaperVersion, PaperAccessScope } from '../types/generated-paper.types';
import { paperVersionSchema } from '../validators/paper-version.validator';

export class PaperVersionService {
  static validateVersionIntegrity(version: IPaperVersion): IPaperVersion {
    const parsed = paperVersionSchema.parse(version);
    logger.debug({ version: parsed.version, sections: parsed.sections.length, traceId: parsed.metadata.traceId }, 'paper version integrity validated');
    return parsed;
  }

  static async createInitialVersion(input: CreateGeneratedPaperInput, scope?: PaperAccessScope) {
    return GeneratedPaperRepository.createGeneratedPaper(input, scope);
  }

  static async createNextVersion(input: CreatePaperVersionInput, scope?: PaperAccessScope): Promise<IPaperVersion> {
    return GeneratedPaperRepository.appendVersion(input, scope);
  }

  static async versionExists(assignmentId: string | Types.ObjectId, version: number, scope?: PaperAccessScope): Promise<boolean> {
    return (await GeneratedPaperRepository.getVersion(assignmentId, version, scope)) !== null;
  }

  static async switchActiveVersion(assignmentId: string | Types.ObjectId, version: number, scope?: PaperAccessScope & { traceId?: string }): Promise<boolean> {
    const exists = await this.versionExists(assignmentId, version, scope);
    if (!exists) throw new Error('Cannot switch active version because the requested version does not exist.');
    return GeneratedPaperRepository.setActiveVersion(assignmentId, version, scope);
  }
}
