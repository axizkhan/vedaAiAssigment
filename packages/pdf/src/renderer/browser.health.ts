import { Browser } from 'puppeteer';

export const checkBrowserHealth = async (browser: Browser): Promise<boolean> => {
  try {
    // A simple evaluation to ensure the browser process is responsive
    const pages = await browser.pages();
    if (pages.length > 0) {
      await pages[0].evaluate(() => 1 + 1);
    }
    return true;
  } catch (err) {
    return false;
  }
};
