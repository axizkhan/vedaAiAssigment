import * as React from "react";
import { usePaperViewerStore } from "../stores/paper-viewer.store";

export function PaperHeader() {
  const currentPaper = usePaperViewerStore(s => s.currentPaper);

  if (!currentPaper) return null;

  return (
    <div className="w-full text-center border-b-2 border-black pb-4 mb-8 text-black print:border-black">
      <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest font-serif">
        {currentPaper.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold">
        <span>Subject: {currentPaper.subject}</span>
        <span>Duration: {currentPaper.durationMinutes} mins</span>
        <span>Max Marks: {currentPaper.totalMarks}</span>
      </div>
      
      {currentPaper.instructions && currentPaper.instructions.length > 0 && (
        <div className="mt-6 text-left p-4 border border-black break-inside-avoid bg-white">
          <h3 className="font-bold underline mb-2 uppercase text-sm">General Instructions:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm font-serif">
            {currentPaper.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
