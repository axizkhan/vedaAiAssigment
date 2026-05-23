import { MAX_PROMPT_LENGTH } from "../constants/assignment-flow.constants";

export const getPromptRemainingChars = (text: string): number => {
  return MAX_PROMPT_LENGTH - text.length;
};

export const isPromptOverLimit = (text: string): boolean => {
  return text.length > MAX_PROMPT_LENGTH;
};

export const formatPromptLengthMessage = (text: string): string => {
  const remaining = getPromptRemainingChars(text);
  if (remaining < 0) {
    return `Over limit by ${Math.abs(remaining)} characters`;
  }
  return `${remaining} characters remaining`;
};
