import { EXTRACTOR_CONSTANTS } from './extractor.constants';

export const isSupportedMimeType = (mimeType: string): boolean => {
  return Object.values(EXTRACTOR_CONSTANTS.SUPPORTED_MIME_TYPES).includes(mimeType as any);
};

export const isValidExtractionSize = (size: number): boolean => {
  return size > 0 && size <= EXTRACTOR_CONSTANTS.MAX_FILE_SIZE_BYTES;
};
