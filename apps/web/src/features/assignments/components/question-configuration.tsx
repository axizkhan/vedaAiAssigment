"use client";

import * as React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormField, FormLabel, FormError } from "@/components/forms";
import type { ConfigureStepData } from "../schemas/create-assignment.schema";

export function QuestionConfiguration() {
  const { control, register, formState: { errors } } = useFormContext<ConfigureStepData>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-h5 font-semibold text-foreground">Question Structure</h3>
          <p className="text-small text-foreground-muted">Define the types and marks for your assessment.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ id: Math.random().toString(), type: "multiple_choice", count: 1, marks: 1 })}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Group
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end p-4 rounded-xl border border-border bg-surface-secondary/30 relative group">
            <FormField className="w-full sm:w-1/3">
              <FormLabel>Type</FormLabel>
              <Select {...register(`questions.${index}.type`)}>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="short_answer">Short Answer</option>
                <option value="essay">Essay</option>
              </Select>
            </FormField>

            <FormField className="w-full sm:w-1/4">
              <FormLabel>Count</FormLabel>
              <Input
                type="number"
                min={1}
                max={50}
                {...register(`questions.${index}.count`, { valueAsNumber: true })}
                error={!!errors.questions?.[index]?.count}
              />
            </FormField>

            <FormField className="w-full sm:w-1/4">
              <FormLabel>Marks (each)</FormLabel>
              <Input
                type="number"
                min={1}
                max={100}
                {...register(`questions.${index}.marks`, { valueAsNumber: true })}
                error={!!errors.questions?.[index]?.marks}
              />
            </FormField>

            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 text-foreground-muted hover:text-danger hover:bg-danger/10"
                aria-label="Remove question group"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {errors.questions && !Array.isArray(errors.questions) && (
        <FormError>{errors.questions.message}</FormError>
      )}
    </div>
  );
}
