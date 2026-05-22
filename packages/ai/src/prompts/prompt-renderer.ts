import { PromptSection } from './prompt.types';

export const renderPrompt = (sections: PromptSection[]): string => {
  // Ensure sections are rendered in exact priority order
  const sorted = [...sections].sort((a, b) => a.priority - b.priority);
  return sorted.map(s => s.content).join('\\n\\n---\\n\\n');
};
