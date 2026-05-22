export const sanitizeText = (text: string | null | undefined): string | null => {
  if (!text) return null;

  let sanitized = text
    // Remove HTML tags
    .replace(/<[^>]*>?/gm, '')
    // Remove control characters except newlines/tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove excessive whitespace
    .replace(/\s{3,}/g, '  ')
    .trim();

  // Basic Prompt Injection prevention filters (can be expanded)
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /system prompt/gi,
    /developer message/gi,
    /you are a/gi,
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }

  return sanitized;
};
