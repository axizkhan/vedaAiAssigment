import { create } from "zustand";
import { Paper, ExportState } from "../types/paper.types";

interface PaperViewerState {
  currentPaper: Paper | null;
  exportState: ExportState;
  exportError: string | null;
  viewerScale: number;
  currentPage: number;
  
  setPaper: (paper: Paper) => void;
  setExportState: (state: ExportState, error?: string | null) => void;
  setViewerScale: (scale: number) => void;
  setCurrentPage: (page: number) => void;
  reset: () => void;
}

export const usePaperViewerStore = create<PaperViewerState>((set) => ({
  currentPaper: null,
  exportState: "idle",
  exportError: null,
  viewerScale: 1,
  currentPage: 1,

  setPaper: (paper) => set({ currentPaper: paper }),
  setExportState: (state, error = null) => set({ exportState: state, exportError: error }),
  setViewerScale: (scale) => set({ viewerScale: scale }),
  setCurrentPage: (page) => set({ currentPage: page }),
  reset: () => set({
    currentPaper: null,
    exportState: "idle",
    exportError: null,
    viewerScale: 1,
    currentPage: 1,
  }),
}));
