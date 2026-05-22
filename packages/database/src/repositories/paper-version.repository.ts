import { Types } from 'mongoose';
import { GeneratedPaperRepository } from './generated-paper.repository';
import { CreatePaperVersionInput, IPaperVersion, PaperAccessScope, PaperVersionSummary } from '../types/generated-paper.types';

export class PaperVersionRepository {
  static async createNextVersion(input: CreatePaperVersionInput, scope?: PaperAccessScope): Promise<IPaperVersion> {
    return GeneratedPaperRepository.appendVersion(input, scope);
  }

  static async getVersion(assignmentId: string | Types.ObjectId, version: number, scope?: PaperAccessScope): Promise<IPaperVersion | null> {
    return GeneratedPaperRepository.getVersion(assignmentId, version, scope);
  }

  static async getActiveVersion(assignmentId: string | Types.ObjectId, scope?: PaperAccessScope): Promise<IPaperVersion | null> {
    return GeneratedPaperRepository.getActiveVersion(assignmentId, scope);
  }

  static async listVersionSummaries(assignmentId: string | Types.ObjectId, scope?: PaperAccessScope): Promise<PaperVersionSummary[]> {
    return GeneratedPaperRepository.listVersionSummaries(assignmentId, scope);
  }
}
