import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export function StudentInfoSection() {
  return (
    <div className={cn(
      "w-full border border-gray-300 rounded-sm p-4 mb-8",
      "print:border-black print:text-black",
      "text-black" // Force black text for print realism
    )}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 print:text-black">Student Name</label>
          <div className="w-full border-b border-gray-400 border-dashed h-6 print:border-black" />
        </div>
        
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 print:text-black">Roll Number</label>
          <div className="w-full border-b border-gray-400 border-dashed h-6 print:border-black" />
        </div>

        <div className="w-24 space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 print:text-black">Section</label>
          <div className="w-full border-b border-gray-400 border-dashed h-6 print:border-black" />
        </div>
      </div>
    </div>
  );
}
