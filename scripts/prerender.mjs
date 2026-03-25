/**
 * Post-build prerender script.
 * Launches a local server, visits each route with headless Chrome,
 * and saves the rendered HTML back to dist/.
 * This gives us SSG-like performance without changing the app architecture.
 */
import { execSync, spawn } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import puppeteer from 'puppeteer-core';

const DIST = join(process.cwd(), 'dist');
const PORT = 4173;
const ROUTES = ['/', '/pricing', '/privacy', '/terms', '/contact'];

// Find Chrome executable
const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
];

function findChrome() {
  for (const p of CHROME_PATHS) {
    try {
      if (existsSync(p)) return p;
    } catch { /* ignore */ }
  }
  throw new Error('Chrome not found. Install Chrome or set CHROME_PATH env var.');
}

async function main() {
  const chromePath = process.env.CHROME_PATH || findChrome();
  console.log(`Using Chrome: ${chromePath}`);

  // Start preview server
  const server = spawn('npx', ['serve', DIST, '-s', '-l', String(PORT)], {
    stdio: 'pipe',
  });

  // Wait for server to start
  await new Promise(r => setTimeout(r, 2000));

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route}`;
      console.log(`Prerendering: ${route}`);

      const page = await browser.newPage();

      // Block external resources to speed up rendering
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        // Allow document, script, stylesheet — block images, fonts, media
        if (['image', 'font', 'media'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait a bit for React to finish rendering
      await page.waitForSelector('#root > *:not(.skeleton-hero)', { timeout: 15000 });
      await new Promise(r => setTimeout(r, 500));

      // Get the rendered HTML
      let html = await page.content();

      // Remove any script tags that Vite injected for HMR (shouldn't be any in dist)
      // Keep the module scripts

      // Determine output path
      const outDir = route === '/'
        ? DIST
        : join(DIST, route.slice(1));

      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }

      const outFile = join(outDir, 'index.html');
      writeFileSync(outFile, html, 'utf-8');
      console.log(`  → Saved: ${outFile}`);

      await page.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log('\n✅ Prerender complete!');
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
