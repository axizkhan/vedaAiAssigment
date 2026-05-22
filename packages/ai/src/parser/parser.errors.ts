export class ParserError extends Error {
  constructor(message: string, public code: string, public retryable: boolean = false) {
    super(message);
    this.name = 'ParserError';
  }
}

export class JSONParseError extends ParserError {
  constructor(message: string) {
    super(message, 'JSON_PARSE_ERROR', true); // JSON parse errors are usually retryable
  }
}

export class SchemaValidationError extends ParserError {
  constructor(message: string) {
    super(message, 'SCHEMA_VALIDATION_ERROR', false);
  }
}

export class MarksMismatchError extends ParserError {
  constructor(message: string) {
    super(message, 'MARKS_MISMATCH', false);
  }
}

export class QuestionCountMismatchError extends ParserError {
  constructor(message: string) {
    super(message, 'QUESTION_COUNT_MISMATCH', false);
  }
}

export class DuplicateQuestionError extends ParserError {
  constructor(message: string) {
    super(message, 'DUPLICATE_QUESTIONS', false);
  }
}

export class SemanticValidationError extends ParserError {
  constructor(message: string) {
    super(message, 'SEMANTIC_FAILURE', false);
  }
}

export class ParserRepairError extends ParserError {
  constructor(message: string) {
    super(message, 'PARSER_REPAIR_FAILED', true);
  }
}

export class PayloadSizeError extends ParserError {
  constructor(message: string) {
    super(message, 'PAYLOAD_TOO_LARGE', false);
  }
}
