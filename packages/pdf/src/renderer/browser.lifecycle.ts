import puppeteer, { Browser } from 'puppeteer';
import { BrowserLaunchError } from './render.errors';
import { RenderTelemetry } from './render.telemetry';

export const launchBrowser = async (): Promise<Browser> => {
  const startMs = Date.now();
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    });

    RenderTelemetry.logEvent('browser_started', { durationMs: Date.now() - startMs });
    return browser;
  } catch (error: any) {
    throw new BrowserLaunchError(\`Failed to launch browser: \${error.message}\`);
  }
};

export const closeBrowserSafely = async (browser: Browser | null) => {
  if (!browser) return;
  try {
    await browser.close();
    RenderTelemetry.logEvent('browser_closed', {});
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Browser Lifecycle] Failed to close browser', error);
    }
  }
};
