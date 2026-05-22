import { DangerousPattern } from './sanitizer.types';

// Helper to create a regex that allows optional spaces/punctuation between letters
// e.g. "i g n o r e" or "i.g.n.o.r.e"
const createObfuscationResistantRegex = (phrase: string): RegExp => {
  const spacedPattern = phrase
    .split('')
    .map(char => (char.trim() === '' ? '\\\\s+' : \`\${char}[\\\\s\\\\W]*\`))
    .join('');
  return new RegExp(spacedPattern, 'gi');
};

const rawPhrases = [
  'ignore previous instructions',
  'ignore all instructions',
  'forget previous prompts',
  'system prompt',
  'developer prompt',
  'assistant instructions',
  'you are chatgpt',
  'reveal hidden instructions',
  'bypass restrictions',
  'disable safety',
  'jailbreak',
  'simulate developer mode',
  'act as system',
];

export const INJECTION_PATTERNS: DangerousPattern[] = rawPhrases.map(phrase => ({
  name: phrase.replace(/\\s+/g, '_').toUpperCase(),
  regex: createObfuscationResistantRegex(phrase),
}));
