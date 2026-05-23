import * as React from "react";
import { cn } from "@/lib/ui/component.utils";
import { Section } from "../types/paper.types";
import { QuestionItem } from "./question-item";

export interface PaperSectionProps {
  section: Section;
  sectionIndex: number;
}

export function PaperSection({ section, sectionIndex }: PaperSectionProps) {
  const sectionLetter = String.fromCharCode(65 + sectionIndex); // A, B, C, etc.

  return (
    <section className={cn(
      "w-full space-y-6 mb-12",
      "break-inside-avoid print:break-inside-avoid",
      "text-black" // Print realism text color
    )}>
      <div className="border-b-2 border-black pb-2 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif tracking-tight">
            Section {sectionLetter}: {section.title}
          </h2>
          <span className="text-sm font-semibold whitespace-nowrap">
            [{section.totalMarks} Marks]
          </span>
        </div>
        {section.instructions && (
          <p className="text-sm italic mt-2 font-serif text-gray-800 print:text-black">
            {section.instructions}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {section.questions.map((question, index) => (
          <QuestionItem key={question.id} question={question} />
        ))}
      </div>
    </section>
  );
}
