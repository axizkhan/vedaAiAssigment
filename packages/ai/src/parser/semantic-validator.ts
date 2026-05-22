import { ValidatedPaper } from './parser.types';
import { SemanticValidationError } from './parser.errors';

export const validateSemantics = (paper: ValidatedPaper): void => {
  const badPatterns = [
    /lorem ipsum/i,
    /\\[insert/i,
    /TODO/i,
    /placeholder/i
  ];

  for (const section of paper.sections) {
    for (const q of section.questions) {
      // 1. Check for placeholder text
      if (badPatterns.some(p => p.test(q.text))) {
        throw new SemanticValidationError(\`Placeholder text detected in question: \${q.id}\`);
      }

      // 2. Validate MCQ integrity
      if (q.type.toLowerCase().includes('mcq') || q.type.toLowerCase() === 'multiple-choice') {
        if (!q.options || q.options.length !== 4) {
          throw new SemanticValidationError(\`MCQ question \${q.id} must have exactly 4 options. Found \${q.options?.length || 0}\`);
        }
        
        // Basic check that options start with A/B/C/D
        const optionPrefixes = q.options.map(o => o.charAt(0).toUpperCase());
        if (!optionPrefixes.includes('A') || !optionPrefixes.includes('B') || !optionPrefixes.includes('C') || !optionPrefixes.includes('D')) {
           throw new SemanticValidationError(\`MCQ question \${q.id} options must be labeled A, B, C, D\`);
        }
      }
    }
  }
};
