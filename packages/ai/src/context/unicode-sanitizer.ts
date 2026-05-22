export const sanitizeUnicodeAdvanced = (text: string): { sanitized: string; charsRemoved: number } => {
  let charsRemoved = 0;
  
  const sanitized = text
    // Remove null bytes
    .replace(/\\0/g, () => { charsRemoved++; return ''; })
    // Remove control characters except standard whitespace (newlines, tabs)
    .replace(/[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]/g, () => { charsRemoved++; return ''; })
    // Remove bidirectional overrides which can be used to hide prompt injection
    .replace(/[\\u202A-\\u202E\\u2066-\\u2069]/g, () => { charsRemoved++; return ''; })
    // Remove zero-width joiners and spaces
    .replace(/[\\u200B-\\u200D\\uFEFF]/g, () => { charsRemoved++; return ''; });

  return { sanitized, charsRemoved };
};
