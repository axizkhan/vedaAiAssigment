import { DifficultyLevel, IPaperSection, IPaperVersion, QuestionType } from '../types/generated-paper.types';

const getSections = (versionOrSections: IPaperVersion | IPaperSection[]): IPaperSection[] => Array.isArray(versionOrSections) ? versionOrSections : versionOrSections.sections;

export function countQuestions(versionOrSections: IPaperVersion | IPaperSection[]): number {
  return getSections(versionOrSections).reduce((total, section) => total + section.questions.length, 0);
}

export function countQuestionsByDifficulty(versionOrSections: IPaperVersion | IPaperSection[]): Record<DifficultyLevel, number> {
  const counts = { [DifficultyLevel.EASY]: 0, [DifficultyLevel.MEDIUM]: 0, [DifficultyLevel.HARD]: 0 };
  for (const section of getSections(versionOrSections)) {
    for (const question of section.questions) counts[question.difficulty] += 1;
  }
  return counts;
}

export function countQuestionsByType(versionOrSections: IPaperVersion | IPaperSection[]): Record<QuestionType, number> {
  const counts = { [QuestionType.MCQ]: 0, [QuestionType.SHORT]: 0, [QuestionType.LONG]: 0, [QuestionType.TRUE_FALSE]: 0 };
  for (const section of getSections(versionOrSections)) {
    for (const question of section.questions) counts[question.type] += 1;
  }
  return counts;
}
