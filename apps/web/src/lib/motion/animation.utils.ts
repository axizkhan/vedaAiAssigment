/**
 * Returns consistent stagger values based on a standard delay index.
 */
export const getStaggerDelay = (index: number, baseDelay: number = 0.05) => {
  return index * baseDelay;
};

/**
 * Helper to construct CSS transform strings avoiding layout thrashing.
 */
export const buildGpuTransform = (y: number = 0, scale: number = 1) => {
  return `translate3d(0, ${y}px, 0) scale(${scale})`;
};
