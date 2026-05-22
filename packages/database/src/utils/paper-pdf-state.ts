import { IPaperVersion, PaperPdfState } from '../types/generated-paper.types';

export function getPaperPdfState(version: IPaperVersion, newestVersionNumber?: number): PaperPdfState {
  if (!version.pdfS3Key || !version.pdfGeneratedAt) return PaperPdfState.NOT_GENERATED;
  if (newestVersionNumber !== undefined && version.version < newestVersionNumber) return PaperPdfState.STALE;
  return PaperPdfState.GENERATED;
}

export function isPdfGenerated(version: IPaperVersion): boolean {
  return getPaperPdfState(version) === PaperPdfState.GENERATED;
}
