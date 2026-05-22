import { ValidatedPaper } from './parser.types';

export const normalizeParsedPaper = (paper: ValidatedPaper): ValidatedPaper => {
  // Deep clone to avoid mutating input during normalization
  const normalized: ValidatedPaper = JSON.parse(JSON.stringify(paper));

  normalized.sections.forEach(section => {
    section.questions.forEach(q => {
      // Normalize difficulty casing
      if (q.difficulty) {
        q.difficulty = q.difficulty.toLowerCase() as any;
      }
      
      // Normalize type casing
      if (q.type) {
        q.type = q.type.toLowerCase().trim();
      }

      // Strip excess whitespace from options
      if (q.options && Array.isArray(q.options)) {
        q.options = q.options.map(opt => opt.trim()).filter(opt => opt.length > 0);
      }
    });
  });

  return normalized;
};
