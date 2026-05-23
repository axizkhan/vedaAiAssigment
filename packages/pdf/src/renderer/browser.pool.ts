import { Browser } from 'puppeteer';
import { launchBrowser, closeBrowserSafely } from './browser.lifecycle';
import { checkBrowserHealth } from './browser.health';

// Future expansion: browser pooling logic to reuse warm browsers
export const getBrowserFromPool = async (): Promise<Browser> => {
  return await launchBrowser();
};

export const releaseBrowserToPool = async (browser: Browser) => {
  const isHealthy = await checkBrowserHealth(browser);
  if (!isHealthy) {
    await closeBrowserSafely(browser);
  } else {
    // In a real pool implementation, keep it alive, but for now we just close it
    await closeBrowserSafely(browser);
  }
};
