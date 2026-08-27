/**
 * Generate responsive renditions for the product screenshots.
 *
 * The masters in `public/assets` are 2000x1250. Lighthouse measured where they
 * actually land: 429x242 for a card in the two-up grid, 1118x629 for the widest
 * panel on desktop, ~372 wide on a phone. So every visitor was downloading a
 * 2000px image to paint it at a quarter of that — `image-delivery` put the
 * waste at ~300 KiB, and on a throttled mobile connection those bytes are in
 * front of the metrics the page is judged on.
 *
 * This writes `<name>-<width>.webp` beside each master and records what exists
 * in `image-variants.json`, which `AssetSlot` reads to build a `srcSet`. The
 * master stays as the top rung, so a 2x desktop panel still gets a sharp image.
 *
 * Idempotent: a variant that already exists and is newer than its master is
 * left alone. Run: `node scripts/gen-image-variants.mjs`
 */
import { readdirSync, statSync, existsSync, writeFileSync } from 'fs';
import { join, extname, basename } from 'path';
import sharp from 'sharp';

const DIR = join(process.cwd(), 'public', 'assets');
const MANIFEST = join(process.cwd(), 'components', 'redesign', 'image-variants.json');

/** Rungs to emit. A master narrower than a rung never produces that rung. */
const WIDTHS = [480, 768, 1200];
/** Below this the master is already small enough to serve everywhere. */
const MIN_MASTER_WIDTH = 1024;
/** Masters that are not content images — the hero poster is art-directed by
 *  <picture> in HeroSection and must not be rewritten here. */
const SKIP = new Set(['hero-poster.webp', 'hero-poster-mobile.webp']);

const manifest = {};
let made = 0;

for (const file of readdirSync(DIR)) {
  if (extname(file).toLowerCase() !== '.webp') continue;
  if (SKIP.has(file)) continue;
  if (/-\d+\.webp$/.test(file)) continue; // already a variant

  const master = join(DIR, file);
  const meta = await sharp(master).metadata();
  if (!meta.width || meta.width < MIN_MASTER_WIDTH) continue;

  const stem = basename(file, '.webp');
  const rungs = [];

  for (const w of WIDTHS) {
    if (w >= meta.width) continue;
    const outName = `${stem}-${w}.webp`;
    const out = join(DIR, outName);
    const fresh =
      existsSync(out) && statSync(out).mtimeMs >= statSync(master).mtimeMs;
    if (!fresh) {
      await sharp(master).resize({ width: w }).webp({ quality: 76 }).toFile(out);
      made += 1;
    }
    rungs.push({ w, src: `/assets/${outName}` });
  }

  rungs.push({ w: meta.width, src: `/assets/${file}` });
  manifest[`/assets/${file}`] = rungs;
}

writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
console.log(
  `Image variants: ${made} written, ${Object.keys(manifest).length} masters mapped ` +
    `→ components/redesign/image-variants.json`,
);
