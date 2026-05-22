export const getByteSize = (text: string): number => {
  if (!text) return 0;
  return Buffer.byteLength(text, 'utf8');
};
