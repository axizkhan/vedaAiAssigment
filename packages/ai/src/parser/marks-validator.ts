import { ValidatedPaper } from './parser.types';
import { MarksMismatchError } from './parser.errors';

export const validateMarkTotals = (paper: ValidatedPaper, expectedMarks: number): void => {
  const totalMarks = paper.sections.reduce((sum, section) => {
    return sum + section.questions.reduce((qSum, q) => qSum + q.marks, 0);
  }, 0);
  
  if (totalMarks !== expectedMarks) {
    throw new MarksMismatchError(\`Expected \${expectedMarks} total marks, but parser summed \${totalMarks}\`);
  }
};
