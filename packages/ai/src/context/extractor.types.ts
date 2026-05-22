export type SupportedMimeType = 'application/pdf' | 'text/plain';

export interface ExtractionMetadata {
  pageCount?: number;
  originalSize: number;
}

export interface ExtractionMetrics {
  extractionDurationMs: number;
  sanitizationDurationMs: number;
  extractedChars: number;
  tokenEstimate?: number;
}

export interface ExtractionResult {
  text: string;
  metadata: ExtractionMetadata;
  metrics: ExtractionMetrics;
}
