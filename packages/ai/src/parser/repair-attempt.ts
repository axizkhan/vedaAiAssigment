import { ParserRepairError } from './parser.errors';
import { cleanMarkdownWrappers } from './markdown-cleaner';
import { extractLargestJsonObject } from './json-extractor';

export const attemptSafeRepair = (rawContent: string): any => {
  try {
    // Attempt 1: Just parse
    return JSON.parse(rawContent);
  } catch (e) {}

  try {
    // Attempt 2: Strip markdown code fences and parse
    const cleaned = cleanMarkdownWrappers(rawContent);
    return JSON.parse(cleaned);
  } catch (e) {}

  try {
    // Attempt 3: Extract the largest JSON-looking object string
    const extracted = extractLargestJsonObject(rawContent);
    if (extracted) {
      return JSON.parse(extracted);
    }
  } catch (e) {}

  throw new ParserRepairError('Failed to safely repair JSON payload');
};
