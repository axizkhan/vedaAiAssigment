export const hardenV1Prompt = (renderedPrompt: string): string => {
  // Final structural check. Ensure we haven't lost the JSON contract due to compression or errors.
  if (!renderedPrompt.includes('[CRITICAL OUTPUT CONTRACT]')) {
    throw new Error('Prompt security failure: Critical output contract missing');
  }
  return renderedPrompt;
};
