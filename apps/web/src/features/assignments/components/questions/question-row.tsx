"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormLabel } from "@/components/forms";
import { QuestionTypeSelector } from "./question-type-selector";
import { QuestionCountSelector } from "./question-count-selector";
import { MarksSelector } from "./marks-selector";
import type { QuestionConfig } from "../../types/assignment-flow.types";

export interface QuestionRowProps {
  config: QuestionConfig;
  onChange: (updated: QuestionConfig) => void;
  onRemove: () => void;
  canRemove: boolean;
  index: number;
}

export function QuestionRow({ config, onChange, onRemove, canRemove, index }: QuestionRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col sm:flex-row gap-4 items-start sm:items-end p-4 rounded-xl border border-border bg-surface-secondary/30 relative group"
    >
      <FormField className="w-full sm:w-1/3">
        <FormLabel>Type</FormLabel>
        <QuestionTypeSelector
          value={config.type}
          onChange={(type) => onChange({ ...config, type: type as QuestionConfig["type"] })}
        />
      </FormField>

      <FormField className="w-full sm:w-1/4">
        <FormLabel>Count</FormLabel>
        <QuestionCountSelector
          value={config.count}
          onChange={(count) => onChange({ ...config, count })}
        />
      </FormField>

      <FormField className="w-full sm:w-1/4">
        <FormLabel>Marks (each)</FormLabel>
        <MarksSelector
          value={config.marks}
          onChange={(marks) => onChange({ ...config, marks })}
        />
      </FormField>

      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 text-foreground-muted hover:text-danger hover:bg-danger/10"
          aria-label={`Remove question group ${index + 1}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </motion.div>
  );
}
