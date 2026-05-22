import { ContextCompressionResult } from './context.types';

export const compressContextText = (rawText: string): ContextCompressionResult => {
  if (!rawText) {
    return { text: '', originalChars: 0, compressedChars: 0 };
  }

  const originalChars = rawText.length;

  // 1. Collapse multiple newlines into a max of 2 (paragraph breaks)
  let compressed = rawText.replace(/\\n{3,}/g, '\\n\\n');

  // 2. Collapse multiple spaces and tabs into a single space
  compressed = compressed.replace(/[ \\t]{2,}/g, ' ');

  // 3. Remove whitespace at the start and end of lines
  compressed = compressed.replace(/^ +/gm, '').replace(/ +$/gm, '');

  // 4. Remove empty sections/pages (e.g. "Page 4\\n\\nPage 5")
  // Simplified deduplication for basic boilerplate
  compressed = compressed.replace(/(Page \\d+\\s*){2,}/gi, ' ');

  compressed = compressed.trim();

  return {
    text: compressed,
    originalChars,
    compressedChars: compressed.length
  };
};
