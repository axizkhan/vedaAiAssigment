import { BloomsLevel } from '../types/generated-paper.types';

export const BLOOMS_TAXONOMY_LEVELS = [
  BloomsLevel.REMEMBER,
  BloomsLevel.UNDERSTAND,
  BloomsLevel.APPLY,
  BloomsLevel.ANALYZE,
  BloomsLevel.EVALUATE,
  BloomsLevel.CREATE,
] as const;

export const BLOOMS_TAXONOMY_ORDER: Record<BloomsLevel, number> = {
  [BloomsLevel.REMEMBER]: 1,
  [BloomsLevel.UNDERSTAND]: 2,
  [BloomsLevel.APPLY]: 3,
  [BloomsLevel.ANALYZE]: 4,
  [BloomsLevel.EVALUATE]: 5,
  [BloomsLevel.CREATE]: 6,
};
