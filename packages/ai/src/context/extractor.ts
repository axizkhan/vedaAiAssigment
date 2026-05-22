import * as pdfjs from "pdfjs-dist";
import { logger } from "@assessment-ai/logger";

const EXTRACTION_TIMEOUT = 30000; // 30 seconds per extraction

export interface ExtractionResult {
  text: string;
  pageCount?: number;
  extractionDurationMs: number;
}

/**
 * Extract text from PDF buffer
 * Handles malformed PDFs gracefully and extracts text page by page
 */
export async function extractTextFromPDF(
  buffer: Buffer,
  traceId?: string,
): Promise<ExtractionResult> {
  const startTime = Date.now();

  try {
    // Set up PDF.js worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    // Load PDF from buffer
    const pdf = await pdfjs.getDocument({ data: buffer }).promise;
    const pageCount = pdf.numPages;

    if (pageCount === 0) {
      logger.warn({ traceId }, "PDF has no pages");
      return {
        text: "",
        pageCount: 0,
        extractionDurationMs: Date.now() - startTime,
      };
    }

    const texts: string[] = [];

    // Extract text from each page with timeout
    for (let i = 1; i <= pageCount; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || "")
          .join("");

        if (pageText.trim()) {
          texts.push(pageText);
        }
      } catch (pageError) {
        logger.warn(
          { page: i, pageError, traceId },
          "Failed to extract text from PDF page, continuing",
        );
        // Continue with next page
        continue;
      }

      // Safety check: timeout after 30 seconds
      if (Date.now() - startTime > EXTRACTION_TIMEOUT) {
        logger.warn(
          { pageCount, processedPages: i, traceId },
          "PDF extraction timeout, returning partial result",
        );
        break;
      }
    }

    const extractedText = texts.join("\n\n");

    logger.info(
      { pageCount, extractedLength: extractedText.length, traceId },
      "PDF text extraction completed",
    );

    return {
      text: extractedText,
      pageCount,
      extractionDurationMs: Date.now() - startTime,
    };
  } catch (error) {
    logger.error({ error, traceId }, "PDF extraction failed");
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extract text from plain text file
 * Validates UTF-8 encoding and detects binary content
 */
export async function extractTextFromTXT(
  buffer: Buffer,
  traceId?: string,
): Promise<ExtractionResult> {
  const startTime = Date.now();

  try {
    // Validate UTF-8 encoding
    let text: string;
    try {
      text = buffer.toString("utf-8");
    } catch (error) {
      logger.error({ error, traceId }, "Failed to decode TXT as UTF-8");
      throw new Error("File is not valid UTF-8 encoded text");
    }

    // Check for binary content (control characters)
    const controlCharCount = text.split("").filter((char) => {
      const code = char.charCodeAt(0);
      // Allow common whitespace and tabs
      if ([9, 10, 13].includes(code)) return false;
      // Flag control characters
      return code < 32 && code !== 0;
    }).length;

    if (controlCharCount > text.length * 0.1) {
      // More than 10% control characters - likely binary
      logger.warn(
        { controlCharCount, totalLength: text.length, traceId },
        "TXT file contains binary content",
      );
      throw new Error("File appears to contain binary content");
    }

    // Remove null bytes
    text = text.replace(/\0/g, "");

    // Normalize line endings
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    logger.info(
      { extractedLength: text.length, traceId },
      "TXT text extraction completed",
    );

    return {
      text,
      pageCount: 1,
      extractionDurationMs: Date.now() - startTime,
    };
  } catch (error) {
    logger.error({ error, traceId }, "TXT extraction failed");
    throw new Error(
      `Failed to extract text from TXT: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extract text from file based on MIME type
 */
export async function extractText(
  buffer: Buffer,
  mimeType: string,
  traceId?: string,
): Promise<ExtractionResult> {
  if (mimeType === "application/pdf") {
    return extractTextFromPDF(buffer, traceId);
  } else if (mimeType === "text/plain") {
    return extractTextFromTXT(buffer, traceId);
  } else {
    throw new Error(`Unsupported MIME type for extraction: ${mimeType}`);
  }
}
