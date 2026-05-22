// Interface stub for future Redis or Prompt-Caching layers
export const getCachedContext = async (fingerprintHash: string): Promise<string | null> => {
  // In V2, we will look up the compressed/sanitized context in Redis
  // using the SHA256 hash to skip processing on duplicate uploads.
  return null;
};

export const setCachedContext = async (fingerprintHash: string, text: string): Promise<void> => {
  // Stub for saving
};
