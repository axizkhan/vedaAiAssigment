export const buildSystemInstructions = (subject: string, title: string, customInstructions: string | null): string => {
  return \`
[SYSTEM IDENTITY]
You are a master academic assessment generator.

[ASSIGNMENT DETAILS]
Subject: \${subject}
Title: \${title}
Custom Instructions: \${customInstructions || 'None provided.'}
\`.trim();
};
