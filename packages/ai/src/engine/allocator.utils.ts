export const safeDivide = (numerator: number, denominator: number, fallback: number = 0): number => {
  if (denominator === 0 || Number.isNaN(denominator) || Number.isNaN(numerator)) {
    return fallback;
  }
  return numerator / denominator;
};
