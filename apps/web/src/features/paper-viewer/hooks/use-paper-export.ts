import { useState } from "react";
import { usePaperViewerStore } from "../stores/paper-viewer.store";
import { paperTemplate } from "../templates/paper.template";

export function usePaperExport() {
  const currentPaper = usePaperViewerStore(s => s.currentPaper);
  const setExportState = usePaperViewerStore(s => s.setExportState);
  const exportState = usePaperViewerStore(s => s.exportState);

  const exportToPdf = async () => {
    if (!currentPaper) return;

    try {
      setExportState("loading");
      
      // MOCK: Generate HTML payload using Handlebars approach
      // In a real app, you'd send `currentPaper` to the backend, which compiles the template.
      console.log("Compiling PDF for", currentPaper.title, "using template:\n", paperTemplate.slice(0, 100), "...");

      // Simulate API latency for Puppeteer generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setExportState("success");
      
      // Reset state after a few seconds so user can export again
      setTimeout(() => setExportState("idle"), 3000);
      
    } catch (error: any) {
      setExportState("error", error.message || "Failed to generate PDF");
    }
  };

  return {
    exportState,
    exportToPdf,
  };
}
