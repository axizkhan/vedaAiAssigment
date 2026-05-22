import { EXTRACTOR_CONSTANTS } from './extractor.constants';
import { ExtractionResult, SupportedMimeType } from './extractor.types';
import { UnsupportedMimeTypeError, ExtractionSizeLimitError } from './extractor.errors';
import { withTimeout } from './extraction-timeout';
import { guardAgainstMalformedPdf } from './malformed-pdf.guard';
import { normalizeText } from './text-normalizer';
import { sanitizeUnicode } from './unicode-sanitizer';
import { extractionMetrics } from './extractor.metrics';

export const extractTextFromFile = async (
  buffer: Buffer,
  mimeType: string,
  traceId?: string
): Promise<ExtractionResult> => {
  const startTime = Date.now();

  try {
    if (buffer.length > EXTRACTOR_CONSTANTS.MAX_FILE_SIZE_BYTES) {
      throw new ExtractionSizeLimitError(\`File exceeds \${EXTRACTOR_CONSTANTS.MAX_FILE_SIZE_MB}MB limit\`);
    }

    let rawText = '';
    let pageCount = 0;
    const abortController = new AbortController();

    if (mimeType === EXTRACTOR_CONSTANTS.SUPPORTED_MIME_TYPES.TXT) {
      rawText = buffer.toString('utf-8');
    } else if (mimeType === EXTRACTOR_CONSTANTS.SUPPORTED_MIME_TYPES.PDF) {
      guardAgainstMalformedPdf(buffer);
      
      const extractionPromise = async () => {
        // Use dynamic import to avoid bundling large dependencies if not used
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const loadingTask = pdfjs.getDocument({
          data: buffer,
          disableFontFace: true, // Speeds up extraction
        });
        
        const pdfDocument = await loadingTask.promise;
        pageCount = pdfDocument.numPages;

        if (pageCount > EXTRACTOR_CONSTANTS.MAX_PDF_PAGES) {
          throw new ExtractionSizeLimitError(\`PDF exceeds \${EXTRACTOR_CONSTANTS.MAX_PDF_PAGES} pages\`);
        }

        let text = '';
        // Extract sequentially to avoid memory spikes
        for (let i = 1; i <= pageCount; i++) {
          if (abortController.signal.aborted) break;
          const page = await pdfDocument.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(' ');
          text += pageText + '\\n\\n'; // Preserve paragraph spacing
          page.cleanup(); // Important for memory safety
        }
        return text;
      };

      rawText = await withTimeout(extractionPromise(), EXTRACTOR_CONSTANTS.TIMEOUT_MS, abortController);
    } else {
      throw new UnsupportedMimeTypeError(mimeType);
    }

    const extractionDurationMs = Date.now() - startTime;
    const sanitizationStartTime = Date.now();

    // Pipeline: Sanitize -> Normalize -> Truncate
    let processedText = sanitizeUnicode(rawText);
    processedText = normalizeText(processedText);

    if (processedText.length > EXTRACTOR_CONSTANTS.MAX_EXTRACTED_TEXT_CHARS) {
      processedText = processedText.substring(0, EXTRACTOR_CONSTANTS.MAX_EXTRACTED_TEXT_CHARS);
    }

    const sanitizationDurationMs = Date.now() - sanitizationStartTime;

    extractionMetrics.trackSuccess({
      traceId,
      mimeType,
      fileSize: buffer.length,
      extractedChars: processedText.length,
      pageCount,
      extractionDurationMs,
    });

    return {
      text: processedText,
      metadata: {
        pageCount,
        originalSize: buffer.length,
      },
      metrics: {
        extractionDurationMs,
        sanitizationDurationMs,
        extractedChars: processedText.length,
      }
    };
  } catch (error: any) {
    extractionMetrics.trackFailure({
      traceId,
      mimeType,
      errorType: error.name,
      errorMessage: error.message,
      durationMs: Date.now() - startTime,
    });
    throw error;
  }
};
