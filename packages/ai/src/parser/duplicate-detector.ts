import { ValidatedPaper } from './parser.types';
import { DuplicateQuestionError } from './parser.errors';
import { normalizePunctuation, normalizeWhitespace } from './parser.utils';

export const validateNoDuplicates = (paper: ValidatedPaper): number => {
  const seenTexts = new Set<string>();
  let duplicateCount = 0;

  for (const section of paper.sections) {
    for (const q of section.questions) {
      const normalized = normalizeWhitespace(normalizePunctuation(q.text.toLowerCase()));
      
      if (seenTexts.has(normalized)) {
        duplicateCount++;
      }
      seenTexts.add(normalized);
    }
  }

  if (duplicateCount > 0) {
    throw new DuplicateQuestionError(\`Detected \${duplicateCount} duplicate questions in the payload\`);
  }

  return 0; // Success
};
