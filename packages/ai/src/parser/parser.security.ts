import { PayloadSizeError } from './parser.errors';
import { PARSER_CONSTANTS } from './parser.constants';

export const validatePayloadSecurity = (rawContent: string): void => {
  if (!rawContent) {
    throw new PayloadSizeError('Empty payload received');
  }

  // Prevent enormous payloads from crashing V8 with string operations or regex
  const byteSize = Buffer.byteLength(rawContent, 'utf8');
  if (byteSize > PARSER_CONSTANTS.MAX_PAYLOAD_SIZE) {
    throw new PayloadSizeError(\`Payload size \${byteSize} exceeds maximum allowed \${PARSER_CONSTANTS.MAX_PAYLOAD_SIZE} bytes\`);
  }

  // Check for unicode spoofing or severe malformed UTF
  if (rawContent.includes('\\u0000')) {
    throw new Error('Payload contains null bytes');
  }
};
