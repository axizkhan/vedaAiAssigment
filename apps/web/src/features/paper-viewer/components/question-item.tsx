import * as React from "react";
import { cn } from "@/lib/ui/component.utils";
import { Question } from "../types/paper.types";
import { DifficultyBadge } from "@/components/badges/difficulty-badge";
import { MarksBadge } from "@/components/badges/marks-badge";

export interface QuestionItemProps {
  question: Question;
}

export function QuestionItem({ question }: QuestionItemProps) {
  return (
    <div className={cn(
      "w-full flex space-x-3",
      "break-inside-avoid print:break-inside-avoid",
      "text-black" // Force black text for print realism
    )}>
      {/* Question Number */}
      <div className="font-bold font-serif text-base shrink-0 min-w-[24px]">
        {question.number}.
      </div>

      {/* Question Content & Metadata */}
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between space-x-4">
          <p className="text-base font-serif leading-relaxed text-black print:text-black">
            {question.text}
          </p>
          <div className="shrink-0 mt-0.5">
            <MarksBadge marks={question.marks} />
          </div>
        </div>

        {/* Dashboard-only badges (Hidden in print) */}
        <div className="flex items-center space-x-2 print:hidden">
          <DifficultyBadge level={question.difficulty} />
        </div>
      </div>
    </div>
  );
}
