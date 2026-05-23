export function getResponsiveGridClasses(cols?: {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}): string {
  const classes = ["grid grid-cols-1 gap-4 md:gap-6"];
  if (cols?.md) classes.push(`md:grid-cols-${cols.md}`);
  if (cols?.lg) classes.push(`lg:grid-cols-${cols.lg}`);
  if (cols?.xl) classes.push(`xl:grid-cols-${cols.xl}`);
  return classes.join(" ");
}
