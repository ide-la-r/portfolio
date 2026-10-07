// Prints cv/es.html and cv/en.html to the PDFs the site serves from public/cv/.
// It drives a Chromium browser already installed on the machine (Edge on Windows by
// default, or whatever CHROME_PATH points to), so nothing big is downloaded.
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const browsers = [
  process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const executablePath = browsers.find((path) => existsSync(path));
if (!executablePath) {
  console.error('No Chromium-based browser found. Set CHROME_PATH to one.');
  process.exit(1);
}

const outputs = {
  es: 'CV-Ismael-de-la-Rosa-2026-ES.pdf',
  en: 'CV-Ismael-de-la-Rosa-2026-EN.pdf',
};

const browser = await puppeteer.launch({ executablePath, headless: true });
const page = await browser.newPage();
let failed = false;

for (const [language, file] of Object.entries(outputs)) {
  await page.goto(pathToFileURL(resolve('cv', `${language}.html`)).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({
    path: resolve('public', 'cv', file),
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
  });

  // A CV that spills onto a second page is a broken CV: fail loudly instead.
  const pages = (Buffer.from(pdf).toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length;
  console.log(`public/cv/${file} · ${pages} page${pages === 1 ? '' : 's'}`);
  if (pages !== 1) failed = true;
}

await browser.close();
if (failed) {
  console.error('A CV no longer fits on one page.');
  process.exit(1);
}
