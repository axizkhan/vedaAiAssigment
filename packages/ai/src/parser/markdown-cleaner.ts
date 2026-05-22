export const cleanMarkdownWrappers = (rawContent: string): string => {
  if (!rawContent) return '';

  let cleaned = rawContent.trim();

  // Try to match standard markdown code fence: \`\`\`json ... \`\`\`
  // The match uses non-greedy \`[\s\S]*?\` to pull the first valid fence,
  // but if the AI returns trailing text it is safely ignored.
  const jsonMatch = cleaned.match(/\`\`\`(?:json)?\\n?([\\s\\S]*?)\\n?\`\`\`/i);
  
  if (jsonMatch && jsonMatch[1]) {
    cleaned = jsonMatch[1].trim();
  }

  return cleaned;
};
