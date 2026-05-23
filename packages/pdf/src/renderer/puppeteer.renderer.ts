import { loadPrintStyles } from '../styles';
import { getBrowserFromPool, releaseBrowserToPool } from './browser.pool';
import { getHeaderTemplate, getFooterTemplate } from './render.templates';
import { HeaderFooterData } from './render.types';
import { RenderTelemetry } from './render.telemetry';
import { ChromiumCrashError } from './render.errors';

export const renderPdfFromHtml = async (
  htmlContent: string,
  headerData: HeaderFooterData
): Promise<Buffer> => {
  const browser = await getBrowserFromPool();
  let page = null;

  try {
    page = await browser.newPage();
    
    RenderTelemetry.logEvent('page_created', {});

    const cssContent = loadPrintStyles();
    const fullHtml = htmlContent.replace('{{{injectedStyles}}}', cssContent);

    // Load content and wait for network idle to ensure assets are ready
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    RenderTelemetry.logEvent('content_loaded', {});

    // Ensure all fonts are loaded
    await page.evaluateHandle('document.fonts.ready');

    // Emulate print media to enforce @media print styles
    await page.emulateMediaType('print');

    // Generate PDF with exact print specifications
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '25mm',
        right: '25mm'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: getHeaderTemplate(headerData),
      footerTemplate: getFooterTemplate(),
    });

    RenderTelemetry.logEvent('pdf_generated', { fileSizeBytes: pdfBuffer.length });
    return pdfBuffer;
  } catch (error: any) {
    RenderTelemetry.logEvent('render_failed', { error: error.message });
    throw new ChromiumCrashError(\`Chromium crash during render: \${error.message}\`);
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
    // CRITICAL: Prevent zombie processes by releasing to pool/closing
    await releaseBrowserToPool(browser);
  }
};
