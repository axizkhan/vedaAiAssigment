export const compressContext = (text: string): string => {
  if (!text) return '';
  // Collapse multiple newlines into a single newline
  let compressed = text.replace(/\\n{3,}/g, '\\n\\n');
  // Collapse multiple spaces/tabs
  compressed = compressed.replace(/[ \\t]{3,}/g, '  ');
  return compressed.trim();
};
