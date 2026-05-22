import { PromptInput } from '../providers/provider.types';
import { PromptValidationError } from './prompt.errors';
import { PROMPT_CONSTANTS } from './prompt.constants';

export const validatePromptInput = (input: PromptInput): void => {
  if (!input.title || input.title.trim().length === 0) {
    throw new PromptValidationError('Assignment title is required');
  }

  if (!input.subject || input.subject.trim().length === 0) {
    throw new PromptValidationError('Assignment subject is required');
  }

  if (input.instructions && input.instructions.length > PROMPT_CONSTANTS.MAX_INSTRUCTION_LENGTH) {
    throw new PromptValidationError(\`Instructions exceed maximum length of \${PROMPT_CONSTANTS.MAX_INSTRUCTION_LENGTH} chars\`);
  }

  if (input.totalQuestions <= 0) {
    throw new PromptValidationError('Total questions must be greater than 0');
  }

  if (input.totalMarks <= 0) {
    throw new PromptValidationError('Total marks must be greater than 0');
  }

  if (!input.questionTypes || input.questionTypes.length === 0) {
    throw new PromptValidationError('At least one question type must be specified');
  }
};
