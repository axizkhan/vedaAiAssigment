export const extractProviderFromError = (errorMsg: string): string => {
  const msg = errorMsg.toLowerCase();
  if (msg.includes('groq')) return 'groq';
  if (msg.includes('openrouter')) return 'openrouter';
  if (msg.includes('openai')) return 'openai';
  return 'unknown';
};
