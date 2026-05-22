import { AllocationResult } from '../../engine/allocator.types';

export const buildAssessmentConstraints = (
  totalQuestions: number,
  totalMarks: number,
  allowedTypes: string[],
  allocation: AllocationResult
): string => {
  return \`
[STRICT MATHEMATICAL CONSTRAINTS]
You MUST perfectly satisfy the following boundaries. If you deviate by even 1 mark, the entire generation fails.

Total Questions Required: EXACTLY \${totalQuestions}
Total Marks Required: EXACTLY \${totalMarks}

[DIFFICULTY & MARK ALLOCATION MATRIX]
You MUST generate the exact number of questions per difficulty tier below, and their individual marks must sum exactly to the specified totals:

1. EASY TIER: \${allocation.questions.easy} questions summing exactly to \${allocation.marks.easy} marks.
2. MEDIUM TIER: \${allocation.questions.medium} questions summing exactly to \${allocation.marks.medium} marks.
3. HARD TIER: \${allocation.questions.hard} questions summing exactly to \${allocation.marks.hard} marks.

[ALLOWED QUESTION TYPES]
You may only generate questions of the following types: \${allowedTypes.join(', ')}

[MCQ RULES]
If generating multiple-choice questions ('mcq' or 'multiple-choice'), you MUST provide EXACTLY 4 options labeled A, B, C, D.
\`.trim();
};
