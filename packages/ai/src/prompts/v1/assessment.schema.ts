export const V1_ASSESSMENT_SCHEMA = \`
{
  "sections": [
    {
      "id": "string (unique identifier, e.g. 'section-a')",
      "title": "string (e.g. 'Multiple Choice')",
      "instruction": "string (instructions for this section)",
      "questions": [
        {
          "id": "string (unique identifier, e.g. 'q1')",
          "text": "string (the actual question)",
          "type": "string (must be one of the allowed types)",
          "difficulty": "string (must be 'easy', 'medium', or 'hard')",
          "marks": "number (integer > 0)",
          "options": ["string", "string", "string", "string"] // EXACTLY 4 options, only required if type is 'mcq' or 'multiple-choice'. Omit for other types.
        }
      ]
    }
  ]
}
\`.trim();
