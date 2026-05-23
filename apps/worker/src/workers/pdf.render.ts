import { renderPdfFromHtml, withRenderTimeout } from '@assessment-ai/pdf';
import { PdfRenderError } from './pdf.errors';

export const executeRenderPipeline = async (
  htmlContent: string,
  assignmentId: string,
  version: number
): Promise<Buffer> => {
  try {
    const renderPromise = renderPdfFromHtml(htmlContent, {
      title: \`Assignment \${assignmentId} (Version \${version})\`,
      version,
    });
    
    // Wraps the render with a 90 second timeout
    return await withRenderTimeout(renderPromise, 90000);
  } catch (error: any) {
    throw new PdfRenderError(\`Pipeline failed: \${error.message}\`);
  }
};
