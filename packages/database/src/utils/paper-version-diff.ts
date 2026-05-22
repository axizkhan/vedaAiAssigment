import { IPaperQuestion, IPaperVersion, PaperVersionDiff, PaperVersionDiffQuestionChange } from '../types/generated-paper.types';

function questionSignature(question: IPaperQuestion): string {
  return JSON.stringify({
    text: question.text,
    type: question.type,
    difficulty: question.difficulty,
    marks: question.marks,
    options: question.options,
    bloomsLevel: question.bloomsLevel,
  });
}

export function diffPaperVersions(from: IPaperVersion, to: IPaperVersion): PaperVersionDiff {
  const fromSections = new Map(from.sections.map((section) => [section.id, section]));
  const toSections = new Map(to.sections.map((section) => [section.id, section]));
  const fromQuestions = new Map<string, IPaperQuestion>();
  const toQuestions = new Map<string, IPaperQuestion>();

  for (const section of from.sections) {
    for (const question of section.questions) fromQuestions.set(question.id, question);
  }

  for (const section of to.sections) {
    for (const question of section.questions) toQuestions.set(question.id, question);
  }

  const questionIds = new Set([...Array.from(fromQuestions.keys()), ...Array.from(toQuestions.keys())]);
  const changedQuestions: PaperVersionDiffQuestionChange[] = [];

  for (const id of Array.from(questionIds)) {
    const before = fromQuestions.get(id);
    const after = toQuestions.get(id);

    if (!before && after) changedQuestions.push({ id, changeType: 'added', after });
    else if (before && !after) changedQuestions.push({ id, changeType: 'removed', before });
    else if (before && after && questionSignature(before) !== questionSignature(after)) changedQuestions.push({ id, changeType: 'changed', before, after });
    else if (before && after) changedQuestions.push({ id, changeType: 'unchanged', before, after });
  }

  return {
    fromVersion: from.version,
    toVersion: to.version,
    addedSectionIds: Array.from(toSections.keys()).filter((id) => !fromSections.has(id)),
    removedSectionIds: Array.from(fromSections.keys()).filter((id) => !toSections.has(id)),
    changedQuestions,
  };
}
