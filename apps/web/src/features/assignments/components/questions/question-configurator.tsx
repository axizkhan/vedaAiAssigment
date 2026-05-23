"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuestionRow } from "./question-row";
import { QuestionValidation } from "./question-validation";
import { useQuestionConfig } from "../../hooks/use-question-config";

export function QuestionConfigurator() {
  const { fields, questions, addRow, removeRow, updateRow } = useQuestionConfig();

  // Handle case where questions might be undefined initially
  const currentQuestions = questions || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-h5 font-semibold text-foreground">Question Structure</h3>
          <p className="text-small text-foreground-muted mt-1">Define question types, counts, and marks.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Group
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {fields.map((field, index) => {
            const config = currentQuestions[index];
            if (!config) return null;
            return (
              <QuestionRow
                key={field.id}
                config={config}
                index={index}
                onChange={(updated) => updateRow(index, updated)}
                onRemove={() => removeRow(index)}
                canRemove={fields.length > 1}
              />
            );
          })}
        </AnimatePresence>
      </div>

      <QuestionValidation questions={currentQuestions} />
    </div>
  );
}
