import puppeteer from 'puppeteer';
import { loadPrintStyles } from '../styles';

export const renderPdfFromHtml = async (htmlContent: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Inject the CSS dynamically into the provided HTML content
    const cssContent = loadPrintStyles();
    // Assuming the template renders {{{injectedStyles}}} inside a <style> tag
    const fullHtml = htmlContent.replace('{{{injectedStyles}}}', cssContent);

    // Wait until network is idle (images loaded, etc.)
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    // Ensure all web fonts are fully loaded before rendering the PDF
    await page.evaluateHandle('document.fonts.ready');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '25mm',
        bottom: '20mm',
        left: '25mm'
      }
    });

    return pdfBuffer;
  } finally {
    // CRITICAL: Always close browser to prevent memory leaks and zombie processes
    await browser.close();
  }
};
