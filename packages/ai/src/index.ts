// Context extraction and processing
export {
  extractTextFromPDF,
  extractTextFromTXT,
  extractText,
} from "./context/extractor";
export type { ExtractionResult } from "./context/extractor";

export { sanitizeExtractedText } from "./context/sanitizer";
export type { SanitizationResult } from "./context/sanitizer";

export {
  estimateTokens,
  calculateTokenCost,
  fitsWithinTokenBudget,
  getTokenStats,
} from "./context/token-estimator";

export {
  detectPromptInjection,
  calculateInjectionRiskScore,
  hasHighRiskInjection,
} from "./context/injection-detector";
export type { InjectionDetectionResult } from "./context/injection-detector";

export {
  truncateContent,
  exceedsMaxLength,
  getContentLengthWarning,
  MAX_EXTRACTED_CONTENT_CHARS,
} from "./context/content-truncator";
export type { TruncationResult } from "./context/content-truncator";

export {
  validateExtractedContext,
  isContentSafe,
  getContentQualityScore,
} from "./context/context-validator";
export type { ContextValidationResult } from "./context/context-validator";

export class AIOrchestrator {
  // AI Provider logic
}
