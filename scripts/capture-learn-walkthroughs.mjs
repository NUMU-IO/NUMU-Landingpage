#!/usr/bin/env node
/**
 * Capture how-to walkthrough frames for the landing Academy (/learn/:slug).
 *
 *   HUB_EMAIL=… HUB_PASSWORD=… node scripts/capture-learn-walkthroughs.mjs scripts/learn-walkthroughs.spec.json [outDir]
 *
 *   Local sandbox hub only (http://localhost:8080 on the local API). Copy the
 *   frames you keep to public/assets/learn-<slug>-s<n>.webp — NOT "-<n>.webp",
 *   which gen-image-variants treats as a rung — update pages/learn/walkthroughs.ts
 *   (src, spot, caption) and run `npm run gen:image-variants`.
 *
 * spec.json:
 * { "guides": [ { "slug": "paymob-vs-fawry", "steps": [
 *     { "url": "/payment-setup",                    // hub path, or a full URL (landing :3095)
 *       "actions": [ {"click": "ربط"}, {"wait": 1200} ],   // optional, run after load
 *       "target": { "text": "Paymob" },             // or { "sel": "css" }; optional "nth"
 *       "caption": { "ar": "…", "en": "…" } } ] } ] }
 *
 * Queries (target, clickQ, fill): {text} | {sel} | {sel,text} (sel filtered by text),
 *   optional "nth", and "pick": css — from the match, walk up to the nearest
 *   ancestor holding a visible `pick` element and use that (e.g. the switch
 *   beside a label: {"text":"تأكيد الطلب على واتساب","pick":"[role=switch]"}).
 *
 * Actions: {click:text} {clickSel:css} {clickQ:query} {type:[css,value]}
 *          {fill:query,value} (select-all + type) {press:key} {wait:ms}
 *          {scrollTo:text} {goto:path} {hover:text}
 *
 * Requests to *.numueg.app are aborted: this tool never touches production.
 *
 * Every frame: 1280×800 viewport at DPR 2 → 1600×1000 WebP (q80), Arabic UI,
 * the local test store's names swapped for neutral ones (REDACT, same list as
 * scripts/redact-and-capture.mjs), broken local images hidden. The target's
 * box is written as percentages of the frame, for the animated cursor.
 * Output: <outDir>/learn-<slug>-<n>.webp + <outDir>/manifest.json
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const [specPath, outArg] = process.argv.slice(2);
if (!specPath) { console.error('usage: node scripts/capture-learn-walkthroughs.mjs <spec.json> [outDir]'); process.exit(1); }
const OUT = outArg ?? 'learn-captures';
const HUB = process.env.HUB_URL ?? 'http://localhost:8080';
const STORE_ID = process.env.STORE_ID ?? 'cc8f3673-90a7-4b7c-b4a0-f594b6e06ec5';
const EMAIL = process.env.HUB_EMAIL;
const PASSWORD = process.env.HUB_PASSWORD;
if (!EMAIL || !PASSWORD) { console.error('set HUB_EMAIL and HUB_PASSWORD'); process.exit(1); }
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
mkdirSync(OUT, { recursive: true });

const REDACT = [
  ['hello@testlocal.com', 'hello@example.com'],
  ['Yosef morad', 'سارة فؤاد'],
  ['Ws6 Buyer', 'منى خالد'],
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
  // B: sandbox QA labels on the promotions / products lists
  ['TEEN QA untagged gate 2 for 300', 'قطعتين بـ ٣٠٠ ج.م'],
  ['TEEN QA 2 for 350', 'قطعتين بـ ٣٥٠ ج.م'],
  ['TEEN QA 3 for 500', '٣ قطع بـ ٥٠٠ ج.م'],
  ['WS6 Ultimate Trio 3 for EGP 650', '٣ قطع بـ ٦٥٠ ج.م'],
  ['WS6 Trio Offer', 'عرض التلاتة'],
  ['WS6 Second Auto 10%', 'خصم ١٠٪ تلقائي'],
  ['WS6 ', ''],
];
// The login email is masked too, whatever account runs this.
if (EMAIL) REDACT.push([EMAIL, 'owner@example.com']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Runs in the page: the element whose text contains `text`, preferring controls. */
const FIND = `(function find(q) {
  function v(el) { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; }
  function up(el) { if (!el || !q.pick) return el;
    for (let a = el; a; a = a.parentElement) { const m = [...a.querySelectorAll(q.pick)].filter(v); if (m.length) return m[0]; }
    return null; }
  if (q.sel) { const all = [...document.querySelectorAll(q.sel)].filter(v).filter((el) => !q.text || (el.innerText || '').includes(q.text)); return up(all[q.nth || 0] || null); }
  const t = q.text.trim();
  const controls = [...document.querySelectorAll('button, a, [role=button], [role=tab], [role=switch], [role=menuitem], [role=option], label, input, select, textarea, summary')]
    .filter(v).filter((el) => (el.innerText || el.value || el.getAttribute('aria-label') || el.placeholder || '').includes(t));
  if (controls.length) { controls.sort((a, b) => (a.innerText || '').length - (b.innerText || '').length); return up(controls[q.nth || 0] || controls[0]); }
  const any = [...document.querySelectorAll('body *')].filter(v).filter((el) => (el.innerText || '').includes(t));
  any.sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
  return up(any[q.nth || 0] || null);
})`;

/** DUMP=1: list visible controls (y | x | tag | text) to pick targets from. */
const DUMP = `(() => [...document.querySelectorAll('button, a, [role=button], [role=tab], [role=switch], [role=checkbox], [role=radio], [role=combobox], [role=option], label, input, select, textarea')]
  .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
  .map((el) => { const r = el.getBoundingClientRect();
    return [Math.round(r.y), Math.round(r.x), Math.round(r.width) + 'x' + Math.round(r.height),
      el.tagName.toLowerCase() + (el.getAttribute('role') ? '[' + el.getAttribute('role') + ']' : '') + (el.id ? '#' + el.id : '') + (el.name ? '@' + el.name : ''),
      (el.innerText || el.value || el.getAttribute('aria-label') || el.placeholder || '').replace(/\\s+/g, ' ').slice(0, 70)].join(' | '); })
  .join('\\n'))()`;

async function redact(page) {
  await page.evaluate((pairs) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) {
      let t = n.nodeValue;
      for (const [from, to] of pairs) if (t.includes(from)) t = t.split(from).join(to);
      if (t !== n.nodeValue) n.nodeValue = t;
    }
    for (const el of document.querySelectorAll('input, textarea')) {
      for (const [from, to] of pairs) if (el.value && el.value.includes(from)) el.value = el.value.split(from).join(to);
    }
    for (const img of document.querySelectorAll('img')) {
      // B: the test store's uploaded logo looks like a live store's brand mark — hide it too.
      if (/:5181\//.test(img.src) || /\/customization\/[^/]+\/logo_/.test(img.src) || (img.complete && img.naturalWidth === 0)) img.style.visibility = 'hidden';
    }
  }, REDACT);
  return page.evaluate((pairs) => pairs.map(([f]) => f).filter((f) => document.body.innerText.includes(f)), REDACT);
}

async function act(page, a) {
  if (a.wait) return sleep(a.wait);
  if (a.goto) { await page.goto(a.goto.startsWith('http') ? a.goto : HUB + a.goto, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {}); return sleep(2000); }
  if (a.press) { await page.keyboard.press(a.press); return sleep(800); }
  if (a.type) { await page.click(a.type[0]); await page.type(a.type[0], a.type[1]); return sleep(500); }
  // B additions: native <select>, keyboard-typed segmented inputs (datetime-local), toast settle.
  if (a.select) { const els = await page.$$(a.select[0]); await els[a.select[2] ?? 0].select(a.select[1]); return sleep(800); }
  if (a.clickIf) { // retry buttons on flaky sandbox cards: click only when present
    const el = (await page.evaluateHandle(`${FIND}(${JSON.stringify({ sel: 'button', text: a.clickIf })})`)).asElement();
    if (el) { await el.click(); await sleep(a.after ?? 2500); }
    return;
  }
  if (a.blur) { await page.evaluate(() => document.activeElement?.blur()); return sleep(300); }
  if (a.focusType) { await page.focus(a.focusType[0]); await page.keyboard.type(a.focusType[1], { delay: 40 }); return sleep(500); }
  if (a.keys) { await page.keyboard.type(a.keys, { delay: 40 }); return sleep(500); }
  if (a.noToast) { await page.waitForFunction(() => !document.querySelector('[data-sonner-toast]'), { timeout: a.noToast }).catch(() => {}); return sleep(300); }
  if (a.fill) {
    const el = (await page.evaluateHandle(`${FIND}(${JSON.stringify(a.fill)})`)).asElement();
    if (!el) throw new Error(`fill target not found: ${JSON.stringify(a.fill)}`);
    await el.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.keyboard.type(a.value);
    return sleep(500);
  }
  if (a.clickSel || a.clickQ || a.click || a.hover || a.scrollTo) {
    const q = a.clickQ ?? (a.clickSel ? { sel: a.clickSel } : { text: a.click ?? a.hover ?? a.scrollTo, nth: a.nth });
    const h = await page.evaluateHandle(`${FIND}(${JSON.stringify(q)})`);
    const el = h.asElement();
    if (!el) throw new Error(`action target not found: ${JSON.stringify(a)}`);
    await el.evaluate((e) => e.scrollIntoView({ block: 'center' }));
    await sleep(300);
    if (a.hover) await el.hover(); else if (!a.scrollTo) await el.click();
    return sleep(a.after ?? 1500);
  }
}

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--lang=en-GB'], // B: dd/mm/yyyy in native date inputs, the order Egyptian merchants read
});
const results = [];
const blocked = new Set();
try {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (r) => {
    const host = new URL(r.url()).hostname;
    if (host === 'numueg.app' || host.endsWith('.numueg.app')) { blocked.add(host); r.abort(); } else r.continue();
  });
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument((store) => {
    try {
      localStorage.setItem('i18nextLng', 'ar');
      localStorage.setItem('numu-current-store', store);
      localStorage.setItem('numu-cookie-consent', 'accepted');
    } catch {}
  }, STORE_ID);

  await page.goto(`${HUB}/login`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('#email', { timeout: 30000 });
  await page.type('#email', EMAIL);
  await page.type('#password', PASSWORD);
  await Promise.all([
    page.waitForFunction(() => !location.pathname.startsWith('/login'), { timeout: 30000 }),
    page.keyboard.press('Enter'),
  ]);
  await sleep(6000);

  for (const g of spec.guides) {
    let n = 0;
    for (const step of g.steps) {
      n += 1;
      const id = `learn-${g.slug}-${n}`;
      try {
        await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
        const url = step.url.startsWith('http') ? step.url : HUB + step.url;
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
        await sleep(2500);
        if (!step.url.startsWith('http')) {
          const want = step.url.split('?')[0];
          for (let i = 0; i < 3 && !new URL(page.url()).pathname.startsWith(want); i += 1) {
            await sleep(2500);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
            await sleep(2500);
          }
        }
        await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
        await sleep(800);
        for (const a of step.actions ?? []) await act(page, a);
        // B: let transient toasts (sandbox fetch errors) clear before the shot.
        if (!step.noSettle) await page.waitForFunction(() => !document.querySelector('[data-sonner-toast]'), { timeout: 12000 }).catch(() => {});
        if (process.env.DUMP) console.log(await page.evaluate(DUMP));
        await page.mouse.move(4, 400); // park the pointer on blank margin: no stray hover states
        await sleep(300);
        await redact(page); // before measuring: swapped names can reflow the layout
        let spot = null;
        if (step.target) {
          const h = await page.evaluateHandle(`${FIND}(${JSON.stringify(step.target)})`);
          const el = h.asElement();
          if (el) {
            const inView = await el.evaluate((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; });
            if (!inView) { await el.evaluate((e) => e.scrollIntoView({ block: 'center' })); await sleep(500); }
            const r = await el.evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
            const pct = (v, of) => Math.round((v / of) * 1000) / 10;
            spot = { x: pct(r.x, 1280), y: pct(r.y, 800), w: pct(r.w, 1280), h: pct(r.h, 800) };
          }
        }
        const leaks = await redact(page);
        const png = await page.screenshot({ type: 'png' });
        const file = join(OUT, `${id}.webp`);
        const info = await sharp(png).resize({ width: 1600, height: 1000, fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(file);
        results.push({ slug: g.slug, n, file, bytes: info.size, url: page.url(), spot, targetFound: !!spot || !step.target, leaks, caption: step.caption });
        console.log(`${id}: ${page.url()} spot=${JSON.stringify(spot)} ${Math.round(info.size / 1024)}KiB ${leaks.length ? 'LEAKS ' + leaks : ''}`);
      } catch (err) {
        results.push({ slug: g.slug, n, error: String(err.message).slice(0, 200) });
        console.log(`${id}: ERROR ${String(err.message).slice(0, 200)}`);
      }
    }
  }
} finally {
  await browser.close();
}
if (blocked.size) console.log(`aborted production requests to: ${[...blocked].join(', ')}`);
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(results, null, 2));
