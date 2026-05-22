import { ValidatedPaper } from './parser.types';
import { SemanticValidationError } from './parser.errors';

export const validateBloomsTaxonomy = (paper: ValidatedPaper): void => {
  const allowedLevels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

  for (const section of paper.sections) {
    for (const q of section.questions) {
      if (q.bloomsLevel) {
        const normalizedLevel = q.bloomsLevel.toLowerCase().trim();
        if (!allowedLevels.includes(normalizedLevel)) {
          throw new SemanticValidationError(\`Invalid Bloom's Taxonomy level '\${q.bloomsLevel}' in question \${q.id}\`);
        }
        // Normalize the value back into the object safely
        q.bloomsLevel = normalizedLevel;
      }
    }
  }
};
