export const normalizeText = (text: string): string => {
  return text
    // Replace 3+ line breaks with exactly 2
    .replace(/\\n{3,}/g, '\\n\\n')
    // Replace multiple horizontal spaces with a single space
    .replace(/[^\\S\\r\\n]{2,}/g, ' ')
    // Trim each line
    .split('\\n').map(line => line.trim()).join('\\n')
    // Trim leading/trailing whitespace
    .trim();
};
