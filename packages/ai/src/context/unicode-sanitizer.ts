export const sanitizeUnicode = (text: string): string => {
  return text
    // Remove null bytes
    .replace(/\\0/g, '')
    // Remove control characters except standard whitespace (newlines, tabs)
    .replace(/[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]/g, '')
    // Remove bidirectional overrides which can be used to hide prompt injection
    .replace(/[\\u202A-\\u202E\\u2066-\\u2069]/g, '')
    // Remove zero-width joiners and spaces
    .replace(/[\\u200B-\\u200D\\uFEFF]/g, '');
};
