import { logger } from "@assessment-ai/logger";

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(?:previous|prior|above)\s+(?:instructions?|prompts?|messages?)/gi,
  /system\s+prompt/gi,
  /developer\s+message/gi,
  /act\s+as/gi,
  /override\s+(?:instructions?|settings?|rules?)/gi,
  /disregard\s+(?:instructions?|prompts?)/gi,
  /forget\s+(?:instructions?|prompts?)/gi,
  /you\s+are\s+now/gi,
  /new\s+(?:instructions?|prompts?|rules?)/gi,
  /this\s+is\s+a\s+(?:jailbreak|test|prompt|instruction)/gi,
  /instructions?\s+for\s+(?:ai|assistant|model)/gi,
  /do\s+not\s+follow|do\s+not\s+respect/gi,
  /bypass\s+(?:filters?|restrictions?|safety)/gi,
  /escape\s+(?:sandbox|restrictions)/gi,
];

const HTML_TAG_PATTERN = /<[^>]*>/g;
const SCRIPT_TAG_PATTERN = /<script[^>]*>[\s\S]*?<\/script>/gi;
const STYLE_TAG_PATTERN = /<style[^>]*>[\s\S]*?<\/style>/gi;

/**
 * Remove HTML tags and scripts from text
 */
function removeHTMLAndScripts(text: string): string {
  // Remove script tags
  let cleaned = text.replace(SCRIPT_TAG_PATTERN, "");

  // Remove style tags
  cleaned = cleaned.replace(STYLE_TAG_PATTERN, "");

  // Remove remaining HTML tags
  cleaned = cleaned.replace(HTML_TAG_PATTERN, "");

  return cleaned;
}

/**
 * Remove control characters and invisible characters
 */
function removeControlCharacters(text: string): string {
  return text
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0);
      // Remove control characters except common whitespace (tab, newline, carriage return)
      if ([9, 10, 13].includes(code)) return true;
      if (code < 32) return false;
      // Remove various invisible Unicode characters
      if (
        [
          8288, 8289, 8290, 8291, 8192, 8193, 8194, 8195, 8196, 8197, 8198,
          8199, 8200,
        ].includes(code)
      )
        return false;
      // Remove zero-width characters
      if ([8203, 8204, 8205, 8206, 8207].includes(code)) return false;
      return true;
    })
    .join("");
}

/**
 * Remove null bytes
 */
function removeNullBytes(text: string): string {
  return text.replace(/\0/g, "");
}

/**
 * Detect and redact prompt injection attempts
 */
function redactPromptInjection(text: string): {
  text: string;
  suspiciousPhrases: string[];
} {
  const suspiciousPhrases: string[] = [];

  let cleaned = text;
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    const matches = cleaned.match(pattern);
    if (matches) {
      suspiciousPhrases.push(...matches.map((m) => m.trim()));
      cleaned = cleaned.replace(pattern, "[REDACTED_INJECTION]");
    }
  }

  return {
    text: cleaned,
    suspiciousPhrases: [
      ...new Set(suspiciousPhrases.map((p) => p.toLowerCase())),
    ],
  };
}

/**
 * Normalize whitespace
 */
function normalizeWhitespace(text: string): string {
  return (
    text
      // Normalize line endings
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      // Collapse multiple newlines
      .replace(/\n{3,}/g, "\n\n")
      // Collapse multiple spaces (but preserve intentional spacing)
      .replace(/[ \t]{2,}/g, " ")
      // Trim
      .trim()
  );
}

export interface SanitizationResult {
  text: string;
  suspiciousPhrases: string[];
  riskScore: number;
  sanitizationApplied: string[];
}

/**
 * Comprehensive text sanitization
 * Removes HTML, control characters, and prompt injection attempts
 * Returns sanitized text with security metrics
 */
export function sanitizeExtractedText(
  text: string,
  traceId?: string,
): SanitizationResult {
  const appliedSanitizations: string[] = [];
  let cleaned = text;

  // Remove scripts and HTML
  if (/<[^>]*>|<script|<style/i.test(cleaned)) {
    cleaned = removeHTMLAndScripts(cleaned);
    appliedSanitizations.push("html_removal");
  }

  // Remove null bytes
  if (cleaned.includes("\0")) {
    cleaned = removeNullBytes(cleaned);
    appliedSanitizations.push("null_byte_removal");
  }

  // Remove control characters
  const beforeControlRemoval = cleaned;
  cleaned = removeControlCharacters(cleaned);
  if (beforeControlRemoval !== cleaned) {
    appliedSanitizations.push("control_char_removal");
  }

  // Detect and redact prompt injection
  const injectionResult = redactPromptInjection(cleaned);
  cleaned = injectionResult.text;
  if (injectionResult.suspiciousPhrases.length > 0) {
    appliedSanitizations.push("injection_redaction");
  }

  // Normalize whitespace
  const beforeNormalization = cleaned;
  cleaned = normalizeWhitespace(cleaned);
  if (beforeNormalization !== cleaned) {
    appliedSanitizations.push("whitespace_normalization");
  }

  // Calculate risk score (0-100)
  let riskScore = 0;
  if (injectionResult.suspiciousPhrases.length > 0) {
    riskScore = Math.min(
      100,
      20 + injectionResult.suspiciousPhrases.length * 10,
    );
  }

  if (appliedSanitizations.length > 0) {
    logger.info(
      {
        suspiciousPhrases: injectionResult.suspiciousPhrases,
        sanitizationsApplied: appliedSanitizations,
        riskScore,
        traceId,
      },
      "Text sanitization completed",
    );
  }

  return {
    text: cleaned,
    suspiciousPhrases: injectionResult.suspiciousPhrases,
    riskScore,
    sanitizationApplied: appliedSanitizations,
  };
}
