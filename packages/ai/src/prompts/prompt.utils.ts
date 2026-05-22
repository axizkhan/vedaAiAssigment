export const estimateTokens = (text: string): number => {
  if (!text) return 0;
  // Basic heuristic: ~4 chars per token for English
  return Math.ceil(text.length / 4);
};
