import * as React from "react";
import { Download, Printer, Share2, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaperExport } from "../hooks/use-paper-export";
import { usePaperPrint } from "../hooks/use-paper-print";
import { usePaperViewerStore } from "../stores/paper-viewer.store";

export function PaperToolbar() {
  const { exportToPdf, exportState } = usePaperExport();
  const { handlePrint } = usePaperPrint();
  const viewerScale = usePaperViewerStore(s => s.viewerScale);
  const setViewerScale = usePaperViewerStore(s => s.setViewerScale);

  const handleZoomIn = () => setViewerScale(Math.min(viewerScale + 0.1, 1.5));
  const handleZoomOut = () => setViewerScale(Math.max(viewerScale - 0.1, 0.5));

  const isExporting = exportState === "loading";

  return (
    <div className="w-full bg-surface border-b border-border shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={viewerScale <= 0.5}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-small font-medium text-foreground-muted w-12 text-center">
          {Math.round(viewerScale * 100)}%
        </span>
        <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={viewerScale >= 1.5}>
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
        
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Print</span>
        </Button>
        
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Share</span>
        </Button>

        <Button size="sm" onClick={exportToPdf} disabled={isExporting}>
          <Download className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">
            {isExporting ? "Exporting..." : "Download PDF"}
          </span>
        </Button>
      </div>
    </div>
  );
}
