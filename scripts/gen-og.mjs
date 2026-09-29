#!/usr/bin/env node
/**
 * Social share card — `public/og-image.png` (1200 × 630).
 *
 * `index.html` and `hooks/useSEO.ts` have pointed at `/og-image.png` since the
 * redesign, but the file was never generated: `vercel.json` rewrites every
 * unknown path to `index.html`, so the URL answered 200 with HTML and every
 * share card on Facebook, WhatsApp, X and LinkedIn came out blank.
 *
 * The card is an HTML template painted by headless Chrome, so Arabic shaping,
 * the site's own font and the brand mark are exactly what a browser renders.
 * The PNG is committed; nothing runs at build time.
 *
 *   node scripts/gen-og.mjs                                   → public/og-image.png
 *   node scripts/gen-og.mjs --title "…" --sub "…" --out public/og/blog/slug.png
 *
 * Needs a local Chrome (same lookup as scripts/prerender.mjs) and network for
 * Google Fonts while rendering. `sharp` (already a devDependency for the image
 * variants) quantises the PNG so a flat card stays well under 100 KB.
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const a = process.argv[i];
  if (a.startsWith('--')) args[a.slice(2)] = process.argv[++i] ?? '';
}

// Same day count the static marketing copy uses (`lib/trialInfo.ts`).
const trialDays =
  /DEFAULT_TRIAL_DAYS\s*=\s*(\d+)/.exec(readFileSync(resolve(ROOT, 'lib/trialInfo.ts'), 'utf8'))?.[1] ?? '37';
const arabicDigits = (s) => s.replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + Number(d)));

const title = args.title ?? 'افتح متجرك وابدأ البيع من غير تعقيد.';
const sub = args.sub ?? 'متجر عربي جاهز، دفع محلي، شحن أسهل، ودفع عند الاستلام معمول للسوق المصري.';
const out = resolve(ROOT, args.out ?? 'public/og-image.png');

const CHROME = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
]
  .filter(Boolean)
  .find((p) => existsSync(p));
if (!CHROME) {
  console.error('gen-og: no Chrome found — set CHROME_PATH');
  process.exit(1);
}

// Inlined so the page (about:blank) needs no file:// access.
const mark = readFileSync(resolve(ROOT, 'public/numu-mark-cream-on-dark.webp')).toString('base64');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;700&family=JetBrains+Mono:wght@500&display=block">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden;
    background: #003366; color: #F5EFE6; font-family: 'IBM Plex Sans Arabic', sans-serif; }
  .card { position: relative; box-sizing: border-box; width: 1200px; height: 630px;
    padding: 64px 88px 56px; display: flex; flex-direction: column; justify-content: space-between; }
  .bar { position: absolute; inset-inline-start: 0; top: 0; bottom: 0; width: 14px; background: #E8A430; }
  .brand { display: flex; align-items: center; gap: 18px; }
  .brand img { height: 60px; width: auto; }
  .brand span { font-size: 42px; font-weight: 700; letter-spacing: -0.01em; }
  h1 { margin: 0; font-size: 70px; line-height: 1.24; font-weight: 700; max-width: 1000px; }
  .sub { margin: 22px 0 0; font-size: 28px; line-height: 1.55; color: rgba(245, 239, 230, 0.78); max-width: 960px; }
  .foot { display: flex; justify-content: space-between; align-items: flex-end;
    font-family: 'JetBrains Mono', monospace; font-size: 19px; letter-spacing: 0.14em; text-transform: uppercase; color: #E8A430; }
</style>
</head>
<body>
<div class="card">
  <div class="bar"></div>
  <div class="brand"><img src="data:image/webp;base64,${mark}" alt=""><span>نُمُو</span></div>
  <div><h1>${esc(title)}</h1><p class="sub">${esc(sub)}</p></div>
  <div class="foot"><span>تجربة ${arabicDigits(trialDays)} يوم · من غير بطاقة</span><span dir="ltr">numueg.app</span></div>
</div>
</body>
</html>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // The viewport is the card. A `clip` here is what produced a blank image:
  // puppeteer captures beyond the viewport for clipped shots, and Chrome paints
  // nothing for a page whose html/body are `overflow: hidden` in that mode.
  const png = await page.screenshot({ type: 'png', captureBeyondViewport: false });
  mkdirSync(dirname(out), { recursive: true });
  const info = await sharp(png).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(out);
  console.log(`gen-og: wrote ${out} (${info.width}×${info.height}, ${(info.size / 1024).toFixed(1)} KB)`);
} finally {
  await browser.close();
}
