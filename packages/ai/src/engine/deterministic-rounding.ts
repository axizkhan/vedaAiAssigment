export const deterministicFloor = (value: number): number => {
  return Math.floor(value + Number.EPSILON);
};

export const getFractionalPart = (value: number): number => {
  return value - Math.floor(value + Number.EPSILON);
};
