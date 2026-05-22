export const normalizeTextAdvanced = (text: string): string => {
  return text
    // Replace 3+ line breaks with exactly 2
    .replace(/\\n{3,}/g, '\\n\\n')
    // Replace multiple horizontal spaces with a single space
    .replace(/[^\\S\\r\\n]{2,}/g, ' ')
    // Trim leading/trailing whitespace without destroying line structures
    .trim();
};
