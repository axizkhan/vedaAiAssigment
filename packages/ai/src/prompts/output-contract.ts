export const buildOutputContract = (): string => {
  return \`
[CRITICAL OUTPUT CONTRACT]
1. You MUST respond with ONLY valid, raw JSON.
2. DO NOT wrap the output in markdown blocks (e.g. no \`\`\`json).
3. DO NOT include conversational text, preambles, or explanations before or after the JSON.
4. Your response must be directly parsable by \`JSON.parse()\`.
\`.trim();
};
