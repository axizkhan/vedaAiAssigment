export const isStaleEvent = (
  lastEventTimestamp: number | null,
  currentEventTimestamp: number
): boolean => {
  if (!lastEventTimestamp) return false;
  return currentEventTimestamp < lastEventTimestamp;
};

export const createTraceId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const safelyExecute = (fn: () => void, fallbackMessage?: string) => {
  try {
    fn();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(fallbackMessage || '[WS_UTILS] Execution failed:', error);
    }
  }
};
