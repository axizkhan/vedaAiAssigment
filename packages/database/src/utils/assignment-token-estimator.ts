export const estimateTokens = (text: string | null | undefined): number => {
  if (!text) return 0;
  // Basic heuristic: 1 token ~= 4 chars or 0.75 words.
  // Using 4 chars is a safe baseline for English text via LLMs.
  return Math.ceil(text.length / 4);
};
