import { logger } from '@assessment-ai/logger';
import { Types } from 'mongoose';
import { GeneratedPaperRepository } from '../repositories/generated-paper.repository';
import { IPaperSection, IPaperVersion, PaperAccessScope, RegenerateSectionInput } from '../types/generated-paper.types';
import { createPaperVersionSchema, paperSectionSchema } from '../validators/paper-version.validator';
import { AssignmentAuditService } from './assignment-audit.service';

export class PaperRegenerationService {
  static replaceSectionInVersion(version: IPaperVersion, sectionId: string, replacementSection: IPaperSection): IPaperSection[] {
    paperSectionSchema.parse(replacementSection);

    let replaced = false;
    const sections = version.sections.map((section) => {
      if (section.id !== sectionId) return section;
      replaced = true;
      return replacementSection;
    });

    if (!replaced) throw new Error('Section to regenerate was not found in the active version.');
    return sections;
  }

  static async regenerateSection(input: RegenerateSectionInput, scope?: PaperAccessScope): Promise<IPaperVersion> {
    const activeVersion = await GeneratedPaperRepository.getActiveVersion(input.assignmentId, scope);
    if (!activeVersion) throw new Error('Generated paper active version not found.');

    const sections = this.replaceSectionInVersion(activeVersion, input.sectionId, input.replacementSection);
    createPaperVersionSchema.parse({ sections, metadata: input.metadata });

    const version = await GeneratedPaperRepository.appendVersion({
      assignmentId: input.assignmentId,
      sections,
      metadata: input.metadata,
      makeActive: input.makeActive,
      traceId: input.traceId,
    }, scope);

    logger.info({
      assignmentId: input.assignmentId.toString(),
      sourceVersion: activeVersion.version,
      version: version.version,
      sectionId: input.sectionId,
      traceId: input.traceId,
    }, 'paper section regenerated as new version');

    await AssignmentAuditService.recordSectionRegenerated(input.assignmentId, {
      sectionId: input.sectionId,
      sourceVersion: activeVersion.version,
      newVersion: version.version,
      traceId: input.traceId,
    }, { traceId: input.traceId });

    return version;
  }
}
