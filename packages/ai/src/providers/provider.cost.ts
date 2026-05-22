// Generic cost tracker based on token usage.
// Costs are per 1M tokens typically, but stored here as per 1k for easier decimals.
export const getProviderCostEstimate = (
  provider: string,
  model: string,
  inputTokens: number,
  outputTokens: number
): number => {
  // Mock implementations for specific models. Can be driven by DB config later.
  let costPer1kInput = 0;
  let costPer1kOutput = 0;

  if (provider === 'groq' && model.includes('llama3-70b')) {
    costPer1kInput = 0.00059;
    costPer1kOutput = 0.00079;
  } else if (provider === 'openrouter' && model.includes('claude-3-haiku')) {
    costPer1kInput = 0.00025;
    costPer1kOutput = 0.00125;
  }

  return (inputTokens / 1000) * costPer1kInput + (outputTokens / 1000) * costPer1kOutput;
};
