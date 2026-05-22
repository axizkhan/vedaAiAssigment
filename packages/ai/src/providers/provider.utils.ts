import { PromptInput } from './provider.types';

// Generic prompt formatter used across multiple models if necessary
export const formatPromptForModel = (input: PromptInput): string => {
  return \`
You are an expert academic paper generator.
Title: \${input.title}
Subject: \${input.subject}
Instructions: \${input.instructions}

Context Material:
\${input.extractedContent || 'None'}

Please generate a structured exam paper with exactly \${input.totalQuestions} questions totaling \${input.totalMarks} marks.
Question Types: \${input.questionTypes.join(', ')}
Difficulty Distribution: Easy(\${input.difficultyDistribution.easy}%), Medium(\${input.difficultyDistribution.medium}%), Hard(\${input.difficultyDistribution.hard}%)

Return your response purely in valid JSON format matching the Assignment schema. No markdown wrapping.
\`;
};
