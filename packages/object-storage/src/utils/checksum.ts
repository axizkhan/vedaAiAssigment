import crypto from 'crypto';

export const calculateChecksum = (buffer: Buffer): string => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};
