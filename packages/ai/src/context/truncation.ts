import { SANITIZER_CONSTANTS } from './sanitizer.constants';

export const truncateSafely = (text: string): { truncated: string; applied: boolean } => {
  if (text.length <= SANITIZER_CONSTANTS.MAX_OUTPUT_LENGTH) {
    return { truncated: text, applied: false };
  }

  // Use Array.from to correctly slice surrogate pairs and emojis
  const characters = Array.from(text);
  
  if (characters.length <= SANITIZER_CONSTANTS.MAX_OUTPUT_LENGTH) {
    return { truncated: text, applied: false };
  }

  const truncated = characters.slice(0, SANITIZER_CONSTANTS.MAX_OUTPUT_LENGTH).join('');
  return { truncated, applied: true };
};
