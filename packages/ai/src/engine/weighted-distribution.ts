import { ALLOCATOR_CONSTANTS } from './allocator.constants';

export const getBaseWeights = () => {
  return { ...ALLOCATOR_CONSTANTS.DEFAULT_WEIGHTS };
};
