export const sanitizeForPrompt = (text: string): string => {
  if (!text) return '';
  // Prevent XML tag injection that could break the prompt structural wrappers
  let sanitized = text.replace(/<\\/?REFERENCE_MATERIAL>/gi, '[REDACTED_TAG]');
  // Also remove markdown code blocks to prevent nested code block corruption
  sanitized = sanitized.replace(/\`\`\`/g, '\\`\\`\\`');
  return sanitized;
};
