import { SemanticBoundaryError } from './context.errors';

export const findSafeTruncationIndex = (text: string, targetIndex: number): number => {
  if (targetIndex >= text.length) return text.length;
  if (targetIndex <= 0) return 0;

  // 1. Try to find the nearest paragraph break before the target index
  const lastParagraphBreak = text.lastIndexOf('\\n\\n', targetIndex);
  if (lastParagraphBreak !== -1 && targetIndex - lastParagraphBreak < 500) {
    return lastParagraphBreak;
  }

  // 2. Try to find the nearest sentence boundary (.!?) before the target index
  // Look backwards from targetIndex
  for (let i = targetIndex; i >= 0; i--) {
    const char = text[i];
    if (char === '.' || char === '?' || char === '!') {
      // Ensure it's followed by space or newline to avoid truncating inside a decimal (3.14)
      if (i + 1 < text.length && (text[i + 1] === ' ' || text[i + 1] === '\\n')) {
        return i + 1; // Include the punctuation
      }
    }
  }

  // 3. Fallback: find nearest space to avoid cutting mid-word
  const lastSpace = text.lastIndexOf(' ', targetIndex);
  if (lastSpace !== -1) {
    return lastSpace;
  }

  // 4. Absolute fallback (should be rare)
  return targetIndex;
};
