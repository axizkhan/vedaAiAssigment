import { logger } from '@assessment-ai/logger';
import { Types } from 'mongoose';
import { GeneratedPaperRepository } from '../repositories/generated-paper.repository';
import { PaperAccessScope, PaperPdfState } from '../types/generated-paper.types';
import { getPaperPdfState } from '../utils/paper-pdf-state';

export class PaperPdfService {
  static async attachPdfS3Key(
    assignmentId: string | Types.ObjectId,
    version: number,
    pdfS3Key: string,
    scope?: PaperAccessScope & { traceId?: string }
  ): Promise<boolean> {
    if (!pdfS3Key.trim()) throw new Error('PDF S3 key is required.');
    const updated = await GeneratedPaperRepository.updatePdfMetadata(assignmentId, version, pdfS3Key.trim(), new Date(), scope);
    logger.info({ assignmentId: assignmentId.toString(), version, traceId: scope?.traceId }, 'paper PDF tracked');
    return updated;
  }

  static async getPdfState(assignmentId: string | Types.ObjectId, version: number, scope?: PaperAccessScope): Promise<PaperPdfState> {
    const paper = await GeneratedPaperRepository.findByAssignmentId(assignmentId, scope);
    const selected = paper?.versions.find((paperVersion) => paperVersion.version === version);
    if (!paper || !selected) throw new Error('Paper version not found.');
    const newestVersion = Math.max(...paper.versions.map((paperVersion) => paperVersion.version));
    return getPaperPdfState(selected, newestVersion);
  }
}
