"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "Focus on critical thinking and application of concepts.",
  "Include real-world examples in the multiple choice options.",
  "Ensure the essay prompt is open-ended and thought-provoking.",
  "Vary difficulty levels across easy, medium, and hard.",
];

export interface AiSuggestionsProps {
  onInsert: (text: string) => void;
}

export function AiSuggestions({ onInsert }: AiSuggestionsProps) {
  const [dismissed, setDismissed] = React.useState<Set<number>>(new Set());

  const visibleSuggestions = SUGGESTIONS.filter((_, i) => !dismissed.has(i));

  if (visibleSuggestions.length === 0) return null;

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-small font-semibold text-foreground">AI Suggestions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {SUGGESTIONS.map((suggestion, idx) => {
            if (dismissed.has(idx)) return null;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onInsert(suggestion);
                    setDismissed((prev) => new Set(prev).add(idx));
                  }}
                  className="text-caption bg-surface text-foreground-muted hover:text-accent hover:border-accent border-dashed whitespace-normal text-left h-auto py-2"
                >
                  {suggestion}
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
