import { PARSER_CONSTANTS } from './parser.constants';

export const resolveParserVersion = (version: string): string => {
  if (version === PARSER_CONSTANTS.VERSIONS.V1) {
    return PARSER_CONSTANTS.VERSIONS.V1;
  }
  // Default fallback or throw error if strictly unsupported
  return PARSER_CONSTANTS.VERSIONS.V1;
};
