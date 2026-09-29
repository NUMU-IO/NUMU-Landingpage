#!/usr/bin/env node
/**
 * Redact-and-capture for merchant-hub screenshots (`docs/screenshot-redaction.md`).
 *
 * Logs into a hub as a merchant, forces the Arabic UI, opens each route, swaps
 * the values in REDACT inside the DOM, hides images that failed to load,
 * re-scans the page text for anything from the REDACT list that survived, and
 * writes a 1600×1000 DPR-2 PNG plus a 2000-px-wide 16:10 WebP (q82) per route.
 *
 *   HUB_URL=http://localhost:8080 HUB_EMAIL=… HUB_PASSWORD=…  *   STORE_ID=<store uuid> SHOTS="orders=/orders,detail=/orders/<id>@Button text"  *   node scripts/redact-and-capture.mjs
 *
 * `SHOTS` is "id=path" pairs; an optional "@text" clicks the first button or
 * link containing that text before the capture. Output goes to `OUT` (default:
 * a folder in the OS temp dir). Copy the WebP you want into `public/assets/`,
 * register it in `components/redesign/assets.ts`, then run
 * `npm run gen:image-variants`. Credentials come only from the environment.
 *
 * In Git Bash, prefix the command with MSYS_NO_PATHCONV=1 — otherwise a
 * single "/route" inside SHOTS is rewritten to a C:/Program Files/Git path.
 *
 * Against production, extend REDACT with the real store's values first and
 * ship nothing whose re-scan is not empty — a leaked phone number in a
 * marketing screenshot is a production incident.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const HUB = process.env.HUB_URL ?? 'http://localhost:8080';
const OUT = process.env.OUT ?? join(tmpdir(), 'numu-hub-captures');
const STORE_ID = process.env.STORE_ID; // the hub reads it from localStorage ("numu-current-store")
const LANG = process.env.LANG_UI ?? 'ar';
const EMAIL = process.env.HUB_EMAIL;
const PASSWORD = process.env.HUB_PASSWORD;
if (!EMAIL || !PASSWORD) { console.error('set HUB_EMAIL and HUB_PASSWORD'); process.exit(1); }

const SHOTS = (process.env.SHOTS?.split(',') ?? [
  'S1-onboarding=/onboarding-wizard',
  'S3-orders=/orders',
  'S6-shipments=/shipments',
  'S7-cod=/cod',
  'S8-payment-setup=/payment-setup',
  'S9-logistics=/logistics',
  'S10-channels=/channels',
  'S11-tracking=/settings/tracking',
  'S12-settings-mcp=/settings/mcp',
  'S13-themes=/online-store/themes',
  'S14-analytics=/analytics/overview',
  'S16-health-score=/health-score',
]).map((s) => { const i = s.indexOf('='); const id = s.slice(0, i); const [path, click] = s.slice(i + 1).split('@'); return { id, path, click }; });

// Text substitutions applied in the page before every capture (synthetic
// local data, so only the store's own name needs a neutral stand-in).
const REDACT = [
  ['testlocal-QA Lab', 'هدير محمود'],
  ['testlocal', 'متجر نُمُو'],
  ['Testlocal', 'متجر نُمُو'],
  ['QA Tester', 'أحمد سمير'],
  ['Yousef Mansour', 'محمد عادل'],
  ['Yousef', 'أحمد'],
  ['QA Lab', 'هدير محمود'],
  ['Fbclid Shopper', 'نورهان علي'],
  ['AOV Tester', 'كريم حسن'],
  ['qatest@example.com', 'ahmed.samir@example.com'],
  ['Test Street 12', '12 شارع التحرير'],
  ['Test Street', 'شارع التحرير'],
  ['+201012345678', '+201000000000'],
  ['01012345678', '01000000000'],
  ['solo leveling', 'تيشيرت قطن — أبيض'],
];
// The login email is masked too, whatever account runs this.
if (EMAIL) REDACT.push([EMAIL, 'owner@example.com']);
// Optional per-shot click, "id=path@button text": pressed after load, before capture.

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const results = [];
try {
  const page = await browser.newPage();
  // DPR 1 while logging in and navigating; the 2x viewport is applied per shot
  // (a 2x viewport from the start made the hub bounce some routes to `/`).
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument((lang, store) => {
    try { localStorage.setItem('i18nextLng', lang); if (store) localStorage.setItem('numu-current-store', store); } catch {}
  }, LANG, STORE_ID);

  await page.goto(`${HUB}/login`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('#email', { timeout: 30000 });
  await page.type('#email', EMAIL);
  await page.type('#password', PASSWORD);
  await Promise.all([
    page.waitForFunction(() => !location.pathname.startsWith('/login'), { timeout: 30000 }),
    page.keyboard.press('Enter'),
  ]);
  await new Promise((r) => setTimeout(r, 6000)); // let the post-login redirect and the store load settle
  console.log('logged in, now at', page.url());

  for (const shot of SHOTS) {
    try {
      await page.goto(`${HUB}${shot.path}`, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => { /* busy pages never go idle; capture anyway */ });
      await new Promise((r) => setTimeout(r, 2500));
      // The hub's post-login redirect can race the first navigation; go again.
      for (let attempt = 0; attempt < 3 && !page.url().includes(shot.path.split('?')[0]); attempt += 1) {
        await new Promise((r) => setTimeout(r, 3000));
        await page.goto(`${HUB}${shot.path}`, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
        await new Promise((r) => setTimeout(r, 2500));
      }
      await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });
      await new Promise((r) => setTimeout(r, 1000));
      if (shot.click) {
        await page.evaluate((text) => {
          const btn = [...document.querySelectorAll('button, a')].find((b) => b.textContent?.includes(text));
          if (btn) btn.click();
        }, shot.click);
        await new Promise((r) => setTimeout(r, 2000));
      }
      // Redact + hide broken local product images (the dead :5181 image server).
      await page.evaluate((pairs) => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        for (const n of nodes) {
          let t = n.nodeValue.replace(/ /g, ' ');
          for (const [from, to] of pairs) if (t.includes(from)) t = t.split(from).join(to);
          if (t !== n.nodeValue) n.nodeValue = t;
        }
        for (const el of document.querySelectorAll('input, textarea')) {
          for (const [from, to] of pairs) if (el.value && el.value.includes(from)) el.value = el.value.split(from).join(to);
        }
        for (const img of document.querySelectorAll('img')) {
          if (/:5181\//.test(img.src) || img.naturalWidth === 0) { img.style.visibility = 'hidden'; }
        }
      }, REDACT);
      const leaks = await page.evaluate((pairs) => {
        const t = document.body.innerText;
        return pairs.map(([from]) => from).filter((from) => t.includes(from));
      }, REDACT);
      const png = await page.screenshot({ type: 'png', captureBeyondViewport: false });
      writeFileSync(join(OUT, `${shot.id}.png`), png);
      await sharp(png).resize({ width: 2000, height: 1250, fit: 'cover', position: 'top' }).webp({ quality: 82 }).toFile(join(OUT, `${shot.id}.webp`));
      results.push({ id: shot.id, url: page.url(), leaks, title: await page.title() });
      console.log(`${shot.id}: ${page.url()} ${leaks.length ? 'LEAKS ' + leaks.join(',') : 'clean'}`);
    } catch (err) {
      results.push({ id: shot.id, error: String(err.message).slice(0, 160) });
      console.log(`${shot.id}: ERROR ${String(err.message).slice(0, 160)}`);
    }
  }
} finally {
  await browser.close();
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(results, null, 2));
