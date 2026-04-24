// @ts-check
/**
 * Brand-mark converter for /public.
 *
 * Re-reads the canonical brand-kit sources from
 * `.claude/skills/numu-design/assets/` and produces transparent-bg WebPs
 * in `/public`. "Transparent-bg" matters because the marks are displayed
 * on the navbar's cream pill / the auth navy panel — any solid rectangular
 * background leaks at the edges.
 *
 * Pipeline per mark:
 *   1. Load PNG as raw RGBA
 *   2. Chroma-key out the matte colour (cream or navy) with a tolerance
 *      band for anti-aliased edges (soft fade, not hard cutoff)
 *   3. Re-encode as WebP quality 92
 *
 * Run with:  bun run convert:logos
 *
 * Idempotent — skips files whose .webp counterpart is already newer than
 * its source PNG.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SKILL_ASSETS = path.join(
  ROOT,
  '.claude',
  'skills',
  'numu-design',
  'assets',
);
// Landing page lives at .../NUMU/NUMU-Landingpage, user's Downloads is
// at .../Downloads — two levels up from cwd.
const DOWNLOADS_EXPORTED = path.join(
  ROOT,
  '..',
  '..',
  'Downloads',
  'numu (1)',
  'exported-images',
);
const PUBLIC_DIR = path.join(ROOT, 'public');

/**
 * @typedef {'rgb' | 'brightness' | 'none'} KeyMode
 *
 * @typedef {[number, number, number]} RGB
 *
 * @typedef {Object} SecondaryKey
 * @property {RGB} color - additional RGB triple to knock out after the
 *   primary key runs. Used when a single source PNG has multiple matte
 *   colours to strip (e.g. cream bg + a terracotta brand-accent line).
 * @property {number} tolerance - per-channel distance tolerance for this
 *   secondary pass.
 *
 * @typedef {Object} MarkJob
 * @property {string | string[]} source - Source PNG path, or list of
 *   candidate paths (first existing wins).
 * @property {string} output - Output WebP filename in /public
 * @property {KeyMode} [keyMode] - 'rgb' = key an RGB colour to
 *   transparent; 'brightness' = drop dark pixels, keep bright ones (good
 *   for single-glyph marks over textured backgrounds); 'none' = pass
 *   through. Default 'rgb'.
 * @property {RGB | null} [chromaKey] - Used when keyMode === 'rgb'. RGB
 *   triple to key out.
 * @property {number} [tolerance] - RGB: per-channel distance tolerance
 *   (0–255). Brightness: luma cutoff (0–255), pixels below drop out.
 * @property {number} [softBand] - Brightness mode only: softness ramp
 *   size in luma units. Pixels in [tolerance, tolerance + softBand]
 *   receive partial alpha for clean anti-aliased edges.
 * @property {SecondaryKey[]} [extraKeys] - optional additional RGB keys
 *   applied after the primary one, in order. Each drops its colour to
 *   alpha 0 with its own tolerance band.
 */

/** @type {MarkJob[]} */
const JOBS = [
  {
    // Primary: navy N on cream → key out the cream, leave navy glyph
    // with transparent bg. Only the Downloads/B asset matches this
    // orientation; the skill's numu-logo-navy-mark.png is actually a
    // cream N on navy and must not fall back here.
    //
    // Tolerance 150 is wider than it looks — cream and navy are ~245
    // channel-distance apart, so the N glyph and its anti-alias band
    // are safe. Wide tolerance + the post-key snap pass ensures the
    // corner compression noise collapses to full transparency so the
    // bbox crop can actually shrink the output to the glyph.
    //
    // extraKeys knocks out the small terracotta accent dash baked into
    // the source (below the N glyph) — the brand kit ships it as part
    // of the mark, but on product surfaces it reads as an orange line
    // directly under the logo and adds noise. Strip it so the output
    // is ONLY the navy N glyph on transparent.
    source: [path.join(DOWNLOADS_EXPORTED, 'B___N_on_Cream.png')],
    output: 'numu-mark-cream.webp',
    chromaKey: [245, 239, 230], // #F5EFE6 cream
    tolerance: 150,
    extraKeys: [
      { color: [193, 74, 28], tolerance: 90 }, // #C14A1C terracotta
    ],
  },
  {
    // Cream N glyph for navy/dark surfaces. We intentionally don't use
    // A___N_on_Navy__primary_.png — that file has decorative stars in
    // the far corners which any background key would keep, anchoring
    // the bbox crop at the image edges. numu-logo-cream-mark.png is
    // the clean "cream N on white" source — key out the white to get
    // a pure cream glyph with transparent bg + a tight crop.
    source: [path.join(SKILL_ASSETS, 'numu-logo-cream-mark.png')],
    output: 'numu-mark-navy.webp',
    chromaKey: [255, 255, 255],
    tolerance: 40,
  },
  {
    // Saffron N on white (accent / compact chips)
    source: [path.join(SKILL_ASSETS, 'numu-logo-saffron-mark.png')],
    output: 'numu-mark-saffron.webp',
    chromaKey: [255, 255, 255],
    tolerance: 12,
  },
  {
    // Cream N on white (for use against navy)
    source: [path.join(SKILL_ASSETS, 'numu-logo-cream-mark.png')],
    output: 'numu-mark-cream-on-dark.webp',
    chromaKey: [255, 255, 255],
    tolerance: 12,
  },
  {
    // Arabic wordmark — navy souk-tile poster, leave as-is (it's an
    // editorial tile, not a logo glyph)
    source: [path.join(DOWNLOADS_EXPORTED, 'C___Arabic_wordmark.png')],
    output: 'numu-wordmark-ar.webp',
    chromaKey: null,
    tolerance: 0,
  },
];

/**
 * First existing path from a candidate list.
 * @param {string | string[]} candidates
 * @returns {Promise<string | null>}
 */
async function firstExisting(candidates) {
  const list = Array.isArray(candidates) ? candidates : [candidates];
  for (const p of list) {
    try {
      await fs.access(p);
      return p;
    } catch {
      // try next
    }
  }
  return null;
}

/**
 * Apply a soft chroma-key: pixels whose per-channel distance to `key` is
 * within `tolerance` become alpha-scaled from 0 (exact match) to full
 * (at tolerance boundary). The soft band prevents halos around letter
 * edges that anti-alias into the matte colour.
 *
 * @param {Buffer} buf - RGBA raw buffer
 * @param {[number, number, number]} key
 * @param {number} tolerance
 */
function applyChromaKey(buf, key, tolerance) {
  const [kr, kg, kb] = key;
  for (let i = 0; i < buf.length; i += 4) {
    const dr = Math.abs(buf[i] - kr);
    const dg = Math.abs(buf[i + 1] - kg);
    const db = Math.abs(buf[i + 2] - kb);
    const d = Math.max(dr, dg, db);
    if (d <= tolerance) {
      const existing = buf[i + 3];
      const target = Math.round((d / tolerance) * 255);
      buf[i + 3] = Math.min(existing, target);
    }
  }
}

/**
 * Drop dark pixels, keep bright ones. Useful for single-glyph marks over
 * textured dark backgrounds (navy + stars + dot grid) where a plain RGB
 * key misses the texture bits.
 *
 * - luma < threshold              → alpha 0
 * - threshold ≤ luma < threshold + softBand → alpha ramps 0→1 linearly
 * - luma ≥ threshold + softBand   → alpha preserved
 *
 * @param {Buffer} buf
 * @param {number} threshold - 0..255; pixels below are fully transparent
 * @param {number} softBand - anti-alias fade width in luma units
 */
function applyBrightnessKey(buf, threshold, softBand) {
  const band = Math.max(1, softBand);
  for (let i = 0; i < buf.length; i += 4) {
    // Rec. 601 luma — matches how eyes perceive brightness
    const y = 0.299 * buf[i] + 0.587 * buf[i + 1] + 0.114 * buf[i + 2];
    if (y < threshold) {
      buf[i + 3] = 0;
    } else if (y < threshold + band) {
      const ramp = (y - threshold) / band;
      buf[i + 3] = Math.round(buf[i + 3] * ramp);
    }
    // else: keep existing alpha
  }
}

/**
 * Find the tight bounding box of "meaningful" (non-transparent) pixels.
 * More reliable than sharp.trim() because it's driven by a minimum alpha
 * threshold we control, ignoring sub-threshold compression noise in the
 * padding area.
 *
 * @param {Buffer} buf - RGBA raw buffer
 * @param {number} width
 * @param {number} height
 * @param {number} minAlpha - pixels with alpha ≥ this count as "glyph"
 * @returns {{ left: number, top: number, width: number, height: number } | null}
 *   null when the buffer is fully transparent.
 */
function alphaBBox(buf, width, height, minAlpha) {
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = buf[(y * width + x) * 4 + 3];
      if (a >= minAlpha) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0 || maxY < 0) return null;
  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/** @param {MarkJob} job */
async function processJob(job) {
  const outputPath = path.join(PUBLIC_DIR, job.output);
  const sourcePath = await firstExisting(job.source);

  if (!sourcePath) {
    console.warn(`✗  ${job.output} — no source found in candidate list`);
    return;
  }

  const [srcStat, outStat] = await Promise.all([
    fs.stat(sourcePath),
    fs.stat(outputPath).catch(() => null),
  ]);
  if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
    console.log(`↷  ${job.output} — already current, skipped`);
    return;
  }

  /** @type {sharp.Sharp} */
  let pipeline = sharp(sourcePath).ensureAlpha();
  const mode = job.keyMode ?? (job.chromaKey ? 'rgb' : 'none');

  if (mode !== 'none') {
    const { data, info } = await pipeline
      .raw()
      .toBuffer({ resolveWithObject: true });
    const buf = Buffer.from(data);

    if (mode === 'rgb') {
      if (!job.chromaKey) {
        throw new Error(`${job.output}: keyMode 'rgb' needs chromaKey`);
      }
      applyChromaKey(buf, job.chromaKey, job.tolerance ?? 24);
    } else if (mode === 'brightness') {
      // tolerance here = the luma cutoff; softBand defaults to 40 which
      // gives enough anti-alias ramp for the N glyph edges.
      applyBrightnessKey(buf, job.tolerance ?? 128, job.softBand ?? 40);
    }

    // Secondary chroma-keys — run in order, each strips another matte
    // colour. Used to knock out brand-accent decorations baked into the
    // source PNG (e.g. the terracotta dash beneath the cream N glyph).
    if (job.extraKeys) {
      for (const extra of job.extraKeys) {
        applyChromaKey(buf, extra.color, extra.tolerance);
      }
    }

    // Snap near-transparent pixels to fully transparent. PNG sources can
    // carry compression noise outside the glyph that sits just above the
    // chroma-key band and retains ~200+ alpha — which anchors the bbox
    // crop at the image edges. This pass cleans that up without touching
    // the meaningful anti-alias ramp (alpha > 40 is inside the glyph).
    for (let i = 3; i < buf.length; i += 4) {
      if (buf[i] < 40) buf[i] = 0;
    }

    // Crop to the tight bounding box of non-transparent pixels. Done
    // manually rather than via sharp.trim() because the soft-fade key
    // leaves the padding with sub-threshold alpha noise that confuses
    // trim(). alphaBBox uses a minAlpha cutoff we control so PNG
    // compression artifacts in the padding don't anchor the crop.
    const bbox = alphaBBox(buf, info.width, info.height, 16);
    if (bbox) {
      const shrank =
        bbox.width < info.width || bbox.height < info.height;
      if (!shrank) {
        // Diagnostic: no crop happened, surface the 4 corner alphas so
        // the tolerance / threshold can be tuned.
        /** @param {number} x @param {number} y */
        const corner = (x, y) => buf[(y * info.width + x) * 4 + 3];
        console.warn(
          `⚠  ${job.output} — bbox returned full frame (${info.width}×${info.height}); corner alphas TL=${corner(0, 0)} TR=${corner(info.width - 1, 0)} BL=${corner(0, info.height - 1)} BR=${corner(info.width - 1, info.height - 1)}`,
        );
      }
      pipeline = sharp(buf, {
        raw: { width: info.width, height: info.height, channels: 4 },
      }).extract(bbox);
    } else {
      pipeline = sharp(buf, {
        raw: { width: info.width, height: info.height, channels: 4 },
      });
    }
  }

  await pipeline
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(outputPath);

  const finalStat = await fs.stat(outputPath);
  const note =
    mode === 'rgb'
      ? '  (rgb-keyed bg)'
      : mode === 'brightness'
        ? '  (brightness-keyed)'
        : '';
  console.log(
    `✓  ${path.basename(sourcePath)}  →  ${job.output}   ${(srcStat.size / 1024).toFixed(1)} KB → ${(finalStat.size / 1024).toFixed(1)} KB${note}`,
  );
}

async function main() {
  for (const job of JOBS) {
    try {
      await processJob(job);
    } catch (err) {
      console.error(
        `✗  ${job.output} — ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}

main().catch((err) => {
  console.error('[convert-logos] fatal:', err);
  process.exit(1);
});
