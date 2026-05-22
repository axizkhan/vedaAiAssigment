import { IPaperSection, IPaperVersion } from '../types/generated-paper.types';

export function calculateSectionMarks(section: IPaperSection): number {
  return section.questions.reduce((total, question) => total + question.marks, 0);
}

export function calculateTotalMarks(versionOrSections: IPaperVersion | IPaperSection[]): number {
  const sections = Array.isArray(versionOrSections) ? versionOrSections : versionOrSections.sections;
  return sections.reduce((total, section) => total + calculateSectionMarks(section), 0);
}

export function validateMarksConsistency(versionOrSections: IPaperVersion | IPaperSection[], expectedTotalMarks?: number): boolean {
  const totalMarks = calculateTotalMarks(versionOrSections);
  return expectedTotalMarks === undefined ? totalMarks > 0 : totalMarks === expectedTotalMarks;
}
