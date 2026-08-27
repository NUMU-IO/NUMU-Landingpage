/**
 * Regenerate the inlined webfont CSS in index.html.
 *
 * Why the CSS is inlined rather than <link>ed to fonts.googleapis.com:
 * that link was the single most expensive render-blocking request on the site.
 * Lighthouse charged it 442 ms on desktop and 861 ms on mobile, because it is a
 * cross-origin stylesheet the browser cannot even begin to parse until a
 * separate connection has been opened and a round trip completed — and only
 * THEN can it discover the .woff2 files. The LCP element is the hero headline,
 * set in IBM Plex Sans Arabic, so that chain sat directly in front of the metric
 * this page is judged on.
 *
 * Inlining collapses it: the @font-face rules are in the HTML, so the font files
 * are discovered during parse and fetched on the connection that is already
 * warm (preconnect to fonts.gstatic.com stays in index.html).
 *
 * Two reductions are applied on the way in:
 *
 *   1. Only the families and weights the site renders. `font-light` (300) and
 *      `font-extrabold` (800) appear nowhere in the source. Cairo is a fallback
 *      in the Tailwind stack that IBM Plex Sans Arabic never falls through to,
 *      so it was declared and never downloaded. Material Symbols Outlined is
 *      reachable only from ShowcaseTabs, which nothing imports — dead weight.
 *
 *   2. Only the `arabic` and `latin` unicode subsets. Google ships cyrillic,
 *      greek, vietnamese and latin-ext blocks too; `unicode-range` means they
 *      are never fetched, but they were still ~60% of the CSS being inlined.
 *
 * Run: node scripts/fetch-font-css.mjs
 * The block between the two markers in index.html is replaced in place.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const URL_ =
  'https://fonts.googleapis.com/css2' +
  '?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700' +
  '&family=JetBrains+Mono:wght@400;500' +
  '&display=swap';

// Google serves woff2 only to browsers it believes support it. Ask as Chrome.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const START = '<!-- FONT-CSS:START -->';
const END = '<!-- FONT-CSS:END -->';
const KEEP = new Set(['arabic', 'latin']);

const res = await fetch(URL_, { headers: { 'User-Agent': UA } });
if (!res.ok) throw new Error(`Google Fonts responded ${res.status}`);
const raw = await res.text();

// The response is a flat list of `/* subset */ @font-face { … }` pairs.
const blocks = [...raw.matchAll(/\/\*\s*([a-z-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/gi)];
if (!blocks.length) throw new Error('No @font-face blocks parsed — did the format change?');

const kept = blocks
  .filter(([, subset]) => KEEP.has(subset))
  .map(([, subset, rule]) => `/* ${subset} */\n${rule.trim()}`);

const css = kept.join('\n');

/**
 * Preload the two faces the hero itself is set in.
 *
 * Inlining the CSS is only half the fix. A face guarded by `unicode-range` is
 * not requested when the rule is parsed - the browser waits until layout proves
 * a glyph in that range is actually on the page. Measured on the built site,
 * that put the first .woff2 request at ~140 ms, BEHIND nineteen already-issued
 * requests including four below-the-fold images of 65-86 KiB each. Under
 * Lighthouse's throttled model those images then had the bandwidth and the font
 * did not - and since the LCP element is the Arabic hero headline, LCP waited
 * on the swap.
 *
 * A preload states the need up front, so the request is issued alongside the
 * document's other critical resources instead of after the image flood.
 *
 * Deliberately only two: the Arabic subset at 400 (body) and 700 (the H1 is
 * `font-bold`). The site is `<html lang="ar">`, so the arabic subset is certain
 * to be needed; preloading anything else would only move waste around.
 */
const PRELOAD = [
  { family: 'IBM Plex Sans Arabic', weight: '400', subset: 'arabic' },
  { family: 'IBM Plex Sans Arabic', weight: '700', subset: 'arabic' },
];
const preloads = PRELOAD.map(({ family, weight, subset }) => {
  const hit = blocks.find(
    ([, sub, rule]) =>
      sub === subset &&
      rule.includes("font-family: '" + family + "'") &&
      rule.includes('font-weight: ' + weight + ';'),
  );
  if (!hit) throw new Error('No ' + family + ' ' + weight + ' (' + subset + ') face in the CSS');
  const url = (hit[2].match(/url\(([^)]+)\)/) || [])[1];
  if (!url) throw new Error('No src url for ' + family + ' ' + weight);
  return '<link rel="preload" as="font" type="font/woff2" href="' + url + '" crossorigin />';
}).join('\n    ');

const path = join(process.cwd(), 'index.html');
const html = readFileSync(path, 'utf-8');
const a = html.indexOf(START);
const b = html.indexOf(END);
if (a === -1 || b === -1) throw new Error(`Markers ${START} / ${END} not found in index.html`);

const next =
  html.slice(0, a + START.length) +
  `\n    ${preloads}\n    <style>\n${css}\n    </style>\n    ` +
  html.slice(b);
writeFileSync(path, next, 'utf-8');

console.log(
  `Inlined ${kept.length}/${blocks.length} @font-face blocks ` +
    `(${(css.length / 1024).toFixed(1)} KiB) + ${PRELOAD.length} preloads into index.html`,
);
