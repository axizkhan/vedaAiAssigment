import { INJECTION_PATTERNS } from './sanitizer.patterns';
import { InjectionDetectionResult } from './sanitizer.types';
import { SANITIZER_CONSTANTS } from './sanitizer.constants';

export const detectAndRedactInjection = (text: string): InjectionDetectionResult => {
  let redactedText = text;
  const matches: string[] = [];
  let detected = false;

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.regex.test(redactedText)) {
      detected = true;
      matches.push(pattern.name);
      redactedText = redactedText.replace(pattern.regex, SANITIZER_CONSTANTS.REDACTION_TEXT);
    }
  }

  return {
    detected,
    matches,
    redactedText
  };
};
