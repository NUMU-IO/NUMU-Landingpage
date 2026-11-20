#!/usr/bin/env node
/**
 * Recolour unDraw illustrations into the numu palette.
 *
 *   node scripts/recolor-illustrations.mjs <dir of unDraw downloads>
 *
 * Reads the SVGs listed in PICKS from that directory, as downloaded from
 * undraw.co with its own "Download SVG" button, and writes
 * `public/assets/illo-*.svg`.
 *
 * unDraw draws everything in one accent colour, a few near-blacks and a few
 * cool greys. Left as supplied the accent is unDraw purple and the greys read
 * cold on the site's cream surfaces, so each of those is mapped to the nearest
 * brand colour. Skin tones and white are left alone. Nothing else in the
 * artwork is touched, and the `artist` / `source` attributes unDraw puts on
 * the root element stay in the file.
 *
 * License: https://undraw.co/license — free for commercial use, no attribution
 * required, modification allowed; the illustrations may not be redistributed
 * as a pack or used to build a competing library.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/recolor-illustrations.mjs <dir of unDraw downloads>');
  process.exit(1);
}

/** unDraw download → the asset it becomes (`components/redesign/assets.ts`). */
const PICKS = {
  'undraw_website-builder_4go7.svg': 'illo-open-store.svg',
  'undraw_web-shopping_xd5k.svg': 'illo-merchant-store.svg',
  'undraw_select-option_a16s.svg': 'illo-cod-decision.svg',
  'undraw_online-connection_ls95.svg': 'illo-connected-tools.svg',
  'undraw_texting_s1te.svg': 'illo-inbox-on-the-go.svg',
  'undraw_logistics_8vri.svg': 'illo-packing-orders.svg',
};

const PALETTE = {
  // accent
  '#6c63ff': '#E8A430', // saffron
  // near-blacks and dark indigos → ink and the navy ramp
  '#090814': '#0F1624',
  '#2f2e41': '#001F3F',
  '#3f3d56': '#003366',
  '#3a3768': '#1F4A7A',
  '#65617d': '#3B6593',
  // cool greys → warm neutrals that sit on cream and paper
  '#f2f2f2': '#F3ECDF',
  '#f1f1f1': '#F3ECDF',
  '#e6e6e6': '#EAE0CE',
  '#e4e4e4': '#EAE0CE',
  '#e2e2e2': '#E4D9C5',
  '#d6d6e3': '#DDD1BB',
  '#cacaca': '#CDBFA6',
  '#cbcbcb': '#CDBFA6',
};

const LEFT_ALONE = new Set(['#fff', '#ffffff', '#ed9da0', '#e49497', '#9f616a', '#a0616a']);

for (const [from, to] of Object.entries(PICKS)) {
  let svg = readFileSync(join(src, from), 'utf-8');
  const unmapped = new Set();
  svg = svg.replace(/#[0-9a-fA-F]{3,6}\b/g, (hex) => {
    const key = hex.toLowerCase();
    if (PALETTE[key]) return PALETTE[key];
    if (!LEFT_ALONE.has(key)) unmapped.add(key);
    return hex;
  });
  if (unmapped.size) {
    throw new Error(`${from}: colours with no mapping: ${[...unmapped].join(', ')}`);
  }
  writeFileSync(join(ROOT, 'public', 'assets', to), svg, 'utf-8');
  console.log(`${from} → public/assets/${to} (${(svg.length / 1024).toFixed(1)} KB)`);
}
