import { ValidatedPaper } from './parser.types';
import { QuestionCountMismatchError } from './parser.errors';

export const validateQuestionCounts = (paper: ValidatedPaper, expectedCount: number): void => {
  const totalQuestions = paper.sections.reduce((sum, section) => sum + section.questions.length, 0);
  
  if (totalQuestions !== expectedCount) {
    throw new QuestionCountMismatchError(\`Expected \${expectedCount} questions, but parser found \${totalQuestions}\`);
  }
};
