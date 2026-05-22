import { createHash } from 'crypto';
import { ContextFingerprint } from './context.types';

export const generateFingerprint = (text: string): ContextFingerprint => {
  if (!text) {
    return { hash: 'empty', algorithm: 'sha256' };
  }

  const hash = createHash('sha256').update(text).digest('hex');
  
  return {
    hash,
    algorithm: 'sha256'
  };
};
