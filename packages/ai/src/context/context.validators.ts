import { CONTEXT_CONSTANTS } from './context.constants';
import { getByteSize } from './context.utils';

export const validateExtractedTextSecurity = (text: string): void => {
  if (!text) return;

  if (text.length > CONTEXT_CONSTANTS.MAX_CHAR_LIMIT) {
    throw new Error(\`Extracted text exceeds absolute safety limit of \${CONTEXT_CONSTANTS.MAX_CHAR_LIMIT} characters\`);
  }

  // Null byte spoofing check
  if (text.includes('\\u0000')) {
    throw new Error('Context contains illegal null bytes');
  }
};
