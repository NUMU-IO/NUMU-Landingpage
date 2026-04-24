// @ts-check
/**
 * Favicon generator. Produces a branded-square design — navy rounded
 * square with a cream N glyph centered inside — so the icon reads at
 * 16px in both light AND dark browser tab bars.
 *
 * Why not transparent? Navy-on-transparent disappears in dark tab
 * strips (Arc, Edge dark, Safari dark). Stripe/Shopify/GitHub all ship
 * solid-color favicons for this reason.
 *
 * Outputs:
 *   favicon.png           — 512×512 (linked as the hi-res modern icon)
 *   favicon-32.png        — 32×32
 *   favicon-16.png        — 16×16
 *   apple-touch-icon.png  — 180×180 (same design; iOS rounds to squircle)
 *   favicon.ico           — multi-size ICO packing 16 + 32 + 48
 *
 * Run with:  node scripts/make-favicons.mjs
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const SOURCE = path.join(PUBLIC_DIR, 'numu-mark-cream.webp');

const NAVY = { r: 0x00, g: 0x33, b: 0x66 };
const CREAM = { r: 0xf5, g: 0xef, b: 0xe6 };

/**
 * Render a single favicon at the given size. Palette is parameterized
 * so the same path generates both the navy-bg and cream-bg variants.
 *
 * @param {number} size
 * @param {{ r: number, g: number, b: number }} bg
 * @param {{ r: number, g: number, b: number }} fg
 */
async function renderFavicon(size, bg, fg) {
  // Source mark is navy-on-transparent. We use its alpha channel as a
  // shape mask and fill cream through it, producing a cream-glyph-on-
  // transparent asset to overlay on the navy square. Sharp's `.tint()`
  // multiplies RGB against the color which produces muddy mid-tones on
  // dark glyphs — a manual alpha-as-mask pass gives true cream.
  const glyphTarget = Math.round(size * 0.78);
  const resized = sharp(SOURCE).resize(glyphTarget, glyphTarget, {
    fit: 'inside',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  // Get the RGBA buffer of the resized glyph so we can rewrite the
  // RGB channels to cream while keeping the existing alpha channel.
  const { data, info } = await resized
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: glyphW, height: glyphH } = info;

  const fgRgba = Buffer.alloc(glyphW * glyphH * 4);
  for (let i = 0; i < glyphW * glyphH; i++) {
    const a = data[i * 4 + 3];
    fgRgba[i * 4 + 0] = fg.r;
    fgRgba[i * 4 + 1] = fg.g;
    fgRgba[i * 4 + 2] = fg.b;
    fgRgba[i * 4 + 3] = a;
  }
  const glyphBuf = await sharp(fgRgba, {
    raw: { width: glyphW, height: glyphH, channels: 4 },
  })
    .png()
    .toBuffer();

  const left = Math.round((size - glyphW) / 2);
  const top = Math.round((size - glyphH) / 2);

  // Rounded corner radius — scales with canvas but caps so 16×16 still
  // has visible corner rounding (minimum 2px).
  const radius = Math.max(2, Math.round(size * 0.18));
  const maskSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/>
     </svg>`,
  );

  // Filled canvas, clipped to a rounded square via an alpha mask.
  const bgCanvas = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { ...bg, alpha: 1 },
    },
  })
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  return sharp(bgCanvas)
    .composite([{ input: glyphBuf, top, left }])
    .png()
    .toBuffer();
}

async function main() {
  try {
    await fs.access(SOURCE);
  } catch {
    console.error(`[favicons] Source not found: ${SOURCE}`);
    process.exit(1);
  }

  // Two palette variants. Navy-bg is the default (linked from index.html);
  // cream-bg ships as `favicon-cream*.png` for contexts that want the
  // brand's canonical look (navy N on cream paper) — e.g. dark browser
  // chrome, Slack unfurls, open-graph thumbnails on light surfaces.
  const variants = [
    { suffix: '', bg: NAVY, fg: CREAM },
    { suffix: '-cream', bg: CREAM, fg: NAVY },
  ];

  for (const { suffix, bg, fg } of variants) {
    const jobs = [
      { name: `favicon${suffix}.png`, size: 512 },
      { name: `favicon${suffix}-32.png`, size: 32 },
      { name: `favicon${suffix}-16.png`, size: 16 },
      {
        name: suffix ? `apple-touch-icon${suffix}.png` : 'apple-touch-icon.png',
        size: 180,
      },
    ];

    for (const job of jobs) {
      const buf = await renderFavicon(job.size, bg, fg);
      await fs.writeFile(path.join(PUBLIC_DIR, job.name), buf);
      console.log(`[favicons] wrote ${job.name} (${job.size}×${job.size})`);
    }

    // Multi-size ICO per variant so Windows shortcuts + older browsers
    // resolve to the same look as the PNG favicons.
    const png16 = await renderFavicon(16, bg, fg);
    const png32 = await renderFavicon(32, bg, fg);
    const png48 = await renderFavicon(48, bg, fg);
    const ico = buildIco([
      { size: 16, png: png16 },
      { size: 32, png: png32 },
      { size: 48, png: png48 },
    ]);
    await fs.writeFile(path.join(PUBLIC_DIR, `favicon${suffix}.ico`), ico);
    console.log(`[favicons] wrote favicon${suffix}.ico (16+32+48)`);
  }
}

/**
 * @param {{ size: number, png: Buffer }[]} entries
 */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  const dirEntries = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;

  for (let i = 0; i < entries.length; i++) {
    const { size, png } = entries[i];
    const base = 16 * i;
    dirEntries.writeUInt8(size >= 256 ? 0 : size, base + 0);
    dirEntries.writeUInt8(size >= 256 ? 0 : size, base + 1);
    dirEntries.writeUInt8(0, base + 2);
    dirEntries.writeUInt8(0, base + 3);
    dirEntries.writeUInt16LE(1, base + 4);
    dirEntries.writeUInt16LE(32, base + 6);
    dirEntries.writeUInt32LE(png.length, base + 8);
    dirEntries.writeUInt32LE(offset, base + 12);
    offset += png.length;
  }

  return Buffer.concat([header, dirEntries, ...entries.map((e) => e.png)]);
}

main().catch((err) => {
  console.error('[favicons] failed:', err);
  process.exit(1);
});
