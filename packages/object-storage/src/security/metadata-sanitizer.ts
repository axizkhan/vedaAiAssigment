export const sanitizeMetadata = (metadata: Record<string, string>): Record<string, string> => {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    // Only allow alphanumeric characters and hyphens in keys
    const safeKey = key.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!safeKey) continue;

    // Strip out potentially dangerous control characters from values
    const safeValue = value.replace(/[\x00-\x1F\x7F]/g, '').substring(0, 1024); // Limit value length
    sanitized[safeKey] = safeValue;
  }
  
  return sanitized;
};
