import { ParseResult, ValidatedPaper } from './parser.types';
import { validatePayloadSecurity } from './parser.security';
import { attemptSafeRepair } from './repair-attempt';
import { validateZodSchema } from './schema-validator';
import { validateQuestionCounts } from './question-validator';
import { validateMarkTotals } from './marks-validator';
import { validateNoDuplicates } from './duplicate-detector';
import { validateSemantics } from './semantic-validator';
import { validateBloomsTaxonomy } from './blooms-validator';
import { normalizeParsedPaper } from './normalization';
import { isRetryableParserFailure } from './parser-retry';
import { parserMetrics } from './parser.metrics';
import { ParserError } from './parser.errors';

export const parseAIResponse = (
  rawResponse: string,
  constraints: { expectedQuestions: number; expectedMarks: number },
  options: { traceId?: string; assignmentId?: string; version?: string } = {}
): ParseResult => {
  const startTime = Date.now();
  let repairApplied = false;

  try {
    // 1. Initial Security Checks (size, null bytes)
    validatePayloadSecurity(rawResponse);

    // 2. JSON Extraction & Parse
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawResponse);
    } catch (e) {
      parsedJson = attemptSafeRepair(rawResponse);
      repairApplied = true;
    }

    // 3. Strict Schema Validation (Zod)
    const schemaValidated = validateZodSchema(parsedJson) as ValidatedPaper;

    // 4. Normalization (trim strings, standardize casing before checks)
    const normalizedPaper = normalizeParsedPaper(schemaValidated);

    // 5. Semantic Rules (Placeholder detection, MCQ options A/B/C/D)
    validateSemantics(normalizedPaper);
    validateBloomsTaxonomy(normalizedPaper);

    // 6. Duplicate Detection
    const duplicateCount = validateNoDuplicates(normalizedPaper);

    // 7. Strict Business Rules (Exact Math Validation)
    validateQuestionCounts(normalizedPaper, constraints.expectedQuestions);
    validateMarkTotals(normalizedPaper, constraints.expectedMarks);

    const durationMs = Date.now() - startTime;

    parserMetrics.trackSuccess({
      traceId: options.traceId,
      assignmentId: options.assignmentId,
      parserVersion: options.version || 'v1',
      questionCount: constraints.expectedQuestions,
      totalMarks: constraints.expectedMarks,
      repairApplied,
      durationMs
    });

    return {
      success: true,
      paper: normalizedPaper,
      metrics: {
        durationMs,
        repairApplied,
        questionCount: constraints.expectedQuestions,
        totalMarks: constraints.expectedMarks,
        duplicateCount
      }
    };

  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    const retryable = isRetryableParserFailure(error);
    const code = error instanceof ParserError ? error.code : 'UNKNOWN_PARSE_ERROR';

    parserMetrics.trackFailure({
      traceId: options.traceId,
      assignmentId: options.assignmentId,
      parserVersion: options.version || 'v1',
      errorCode: code,
      errorMessage: error.message,
      retryable,
      durationMs
    });

    return {
      success: false,
      error: {
        code,
        message: error.message,
        retryable
      },
      metrics: {
        durationMs,
        repairApplied,
        questionCount: constraints.expectedQuestions,
        totalMarks: constraints.expectedMarks,
        duplicateCount: 0 // Cannot determine safely on failure
      }
    };
  }
};
