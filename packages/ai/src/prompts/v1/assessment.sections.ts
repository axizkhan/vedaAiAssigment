import { PromptSection } from '../prompt.types';
import { PromptInput } from '../../providers/provider.types';
import { AllocationResult } from '../../engine/allocator.types';
import { buildSystemInstructions } from '../instruction-builder';
import { buildOutputContract } from '../output-contract';
import { buildSchemaEnforcer } from '../schema-enforcer';
import { buildContextWrapper } from '../context-wrapper';
import { enforceContextBudget } from '../prompt-budget';
import { buildAssessmentConstraints } from './assessment.constraints';
import { V1_ASSESSMENT_SCHEMA } from './assessment.schema';
import { V1_ASSESSMENT_EXAMPLE } from './assessment.examples';
import { estimateTokens } from '../prompt.utils';

export const buildV1Sections = (
  input: PromptInput,
  allocation: AllocationResult
): { sections: PromptSection[], truncated: boolean, charsUsed: number } => {
  const instructions = buildSystemInstructions(input.subject, input.title, input.instructions);
  const contract = buildOutputContract();
  const constraints = buildAssessmentConstraints(
    input.totalQuestions,
    input.totalMarks,
    input.questionTypes,
    allocation
  );
  const schema = buildSchemaEnforcer(V1_ASSESSMENT_SCHEMA, V1_ASSESSMENT_EXAMPLE);

  // Estimate base tokens to figure out how much budget is left for context
  const baseTokenCost = estimateTokens(instructions + contract + constraints + schema);

  const contextResult = enforceContextBudget(input.extractedContent || '', baseTokenCost);
  const contextWrapped = buildContextWrapper(contextResult.text);

  const sections: PromptSection[] = [
    { name: 'instructions', content: instructions, priority: 10 },
    { name: 'contract', content: contract, priority: 20 },
    { name: 'constraints', content: constraints, priority: 30 },
    { name: 'schema', content: schema, priority: 40 }
  ];

  if (contextWrapped) {
    sections.push({ name: 'context', content: contextWrapped, priority: 50 });
  }

  return {
    sections,
    truncated: contextResult.truncated,
    charsUsed: contextResult.charsUsed
  };
};
