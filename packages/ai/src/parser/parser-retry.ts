import { ParserError, JSONParseError, ParserRepairError } from './parser.errors';

export const isRetryableParserFailure = (error: Error): boolean => {
  if (error instanceof ParserError) {
    return error.retryable;
  }
  
  // Syntax errors from native JSON.parse
  if (error instanceof SyntaxError) {
    return true;
  }

  return false;
};
