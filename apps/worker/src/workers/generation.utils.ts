export const calculateWaitTime = (requestedAt: string): number => {
  const reqTime = new Date(requestedAt).getTime();
  const now = Date.now();
  return Math.max(0, now - reqTime);
};
