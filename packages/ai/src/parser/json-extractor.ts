export const extractLargestJsonObject = (content: string): string | null => {
  if (!content) return null;

  // Find the first { and the last }
  const firstBrace = content.indexOf('{');
  const lastBrace = content.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    return null; // Not a JSON object
  }

  return content.substring(firstBrace, lastBrace + 1);
};
