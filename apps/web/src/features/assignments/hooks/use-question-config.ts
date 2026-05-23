import { useFieldArray, useFormContext } from "react-hook-form";
import { QuestionFormData } from "../schemas/question.schema";
import { validateTotalMarks } from "../utils/validation.utils";
import { generateQuestionId } from "../utils/assignment-flow.utils";

export function useQuestionConfig() {
  const { control, watch, formState: { errors } } = useFormContext<QuestionFormData>();
  
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questions",
  });

  const questions = watch("questions");
  // Total marks logic based on count * marks
  const totalMarks = questions?.reduce((acc, q) => acc + (q.count * q.marks), 0) || 0;

  const addRow = () => {
    append({ id: generateQuestionId(), type: "mcq", count: 1, marks: 1 });
  };

  const removeRow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return {
    fields,
    questions,
    totalMarks,
    errors,
    addRow,
    removeRow,
    updateRow: update,
  };
}

