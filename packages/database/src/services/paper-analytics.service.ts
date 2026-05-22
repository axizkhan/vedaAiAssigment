import { logger } from '@assessment-ai/logger';
import { Types } from 'mongoose';
import { GeneratedPaperRepository } from '../repositories/generated-paper.repository';
import { BloomsLevel, DifficultyLevel, IPaperVersion, PaperAccessScope, PaperAnalytics, QuestionType } from '../types/generated-paper.types';
import { analyzeDifficultyDistribution } from '../utils/paper-difficulty-analyzer';
import { calculateTotalMarks } from '../utils/paper-marks-calculator';
import { getPaperPdfState } from '../utils/paper-pdf-state';
import { countQuestions, countQuestionsByType } from '../utils/paper-question-counter';

function countBlooms(version: IPaperVersion): Record<BloomsLevel, number> {
  const counts = {
    [BloomsLevel.REMEMBER]: 0,
    [BloomsLevel.UNDERSTAND]: 0,
    [BloomsLevel.APPLY]: 0,
    [BloomsLevel.ANALYZE]: 0,
    [BloomsLevel.EVALUATE]: 0,
    [BloomsLevel.CREATE]: 0,
  };

  for (const section of version.sections) {
    for (const question of section.questions) {
      if (question.bloomsLevel) counts[question.bloomsLevel] += 1;
    }
  }

  return counts;
}

export class PaperAnalyticsService {
  static calculateVersionAnalytics(assignmentId: Types.ObjectId, activeVersion: number, version: IPaperVersion, newestVersion?: number): PaperAnalytics {
    const totalQuestions = countQuestions(version);
    const totalMarks = calculateTotalMarks(version);
    const difficulty = analyzeDifficultyDistribution(version);

    const analytics: PaperAnalytics = {
      assignmentId,
      activeVersion,
      version: version.version,
      totalSections: version.sections.length,
      totalQuestions,
      totalMarks,
      averageMarksPerQuestion: totalQuestions === 0 ? 0 : Number((totalMarks / totalQuestions).toFixed(2)),
      difficultyDistribution: difficulty.counts,
      difficultyPercentages: difficulty.percentages,
      questionTypeDistribution: countQuestionsByType(version),
      bloomsTaxonomyDistribution: countBlooms(version),
      estimatedAiCost: version.metadata.estimatedCost,
      inputTokens: version.metadata.inputTokens,
      outputTokens: version.metadata.outputTokens,
      generationDurationMs: version.metadata.generationDurationMs,
      retryCount: version.metadata.retryCount,
      pdfState: getPaperPdfState(version, newestVersion),
    };

    logger.debug({ assignmentId: assignmentId.toString(), version: version.version }, 'paper analytics calculated');
    return analytics;
  }

  static async getVersionAnalytics(assignmentId: string | Types.ObjectId, versionNumber?: number, scope?: PaperAccessScope): Promise<PaperAnalytics> {
    const paper = await GeneratedPaperRepository.findByAssignmentId(assignmentId, scope);
    if (!paper) throw new Error('Generated paper not found.');

    const selectedVersionNumber = versionNumber ?? paper.activeVersion;
    const version = paper.versions.find((paperVersion) => paperVersion.version === selectedVersionNumber);
    if (!version) throw new Error('Paper version not found.');

    return this.calculateVersionAnalytics(paper.assignmentId, paper.activeVersion, version, Math.max(...paper.versions.map((paperVersion) => paperVersion.version)));
  }

  static async getAllVersionAnalytics(assignmentId: string | Types.ObjectId, scope?: PaperAccessScope): Promise<PaperAnalytics[]> {
    const paper = await GeneratedPaperRepository.findByAssignmentId(assignmentId, scope);
    if (!paper) throw new Error('Generated paper not found.');
    const newestVersion = Math.max(...paper.versions.map((paperVersion) => paperVersion.version));
    return paper.versions.map((version) => this.calculateVersionAnalytics(paper.assignmentId, paper.activeVersion, version, newestVersion));
  }
}
