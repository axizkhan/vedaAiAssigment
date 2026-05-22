export const normalizeWhitespace = (text: string): string => {
  if (!text) return '';
  return text.replace(/\\s+/g, ' ').trim();
};

export const normalizePunctuation = (text: string): string => {
  if (!text) return '';
  // Remove basic punctuation for loose matching
  return text.replace(/[.,/#!$%\\^&\\*;:{}=\\-_~()]/g, '').trim();
};
