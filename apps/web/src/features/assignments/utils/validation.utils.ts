import { QuestionFormData } from "../schemas/question.schema";

export const validateTotalMarks = (questions: QuestionFormData["questions"]): number => {
  return questions.reduce((total, config) => {
    return total + (config.count * config.marks);
  }, 0);
};

export const checkDuplicateQuestionTypes = (questions: QuestionFormData["questions"]): boolean => {
  const types = questions.map(c => c.type);
  return new Set(types).size !== types.length;
};

