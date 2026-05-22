import { DifficultyLevel, IPaperSection, IPaperVersion } from '../types/generated-paper.types';
import { countQuestions, countQuestionsByDifficulty } from './paper-question-counter';

export interface DifficultyAnalysis {
  counts: Record<DifficultyLevel, number>;
  percentages: Record<DifficultyLevel, number>;
}

export function analyzeDifficultyDistribution(versionOrSections: IPaperVersion | IPaperSection[]): DifficultyAnalysis {
  const total = countQuestions(versionOrSections);
  const counts = countQuestionsByDifficulty(versionOrSections);
  const percentages = {
    [DifficultyLevel.EASY]: total === 0 ? 0 : Math.round((counts.easy / total) * 100),
    [DifficultyLevel.MEDIUM]: total === 0 ? 0 : Math.round((counts.medium / total) * 100),
    [DifficultyLevel.HARD]: total === 0 ? 0 : Math.round((counts.hard / total) * 100),
  };

  return { counts, percentages };
}

export function validateDifficultyAgainstTarget(
  versionOrSections: IPaperVersion | IPaperSection[],
  target: Record<DifficultyLevel, number>,
  tolerancePercentage = 10
): boolean {
  const { percentages } = analyzeDifficultyDistribution(versionOrSections);
  return Object.values(DifficultyLevel).every((level) => Math.abs(percentages[level] - target[level]) <= tolerancePercentage);
}
