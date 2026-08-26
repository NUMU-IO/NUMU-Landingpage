/**
 * Generates `components/redesign/brandIcons.ts` from the `simple-icons`
 * package.
 *
 * Why generate instead of importing at runtime: `simple-icons` ships 3,453
 * marks. Even with tree-shaking that is a large dependency to trust for a
 * dozen paths, and it would sit in the production bundle. Baking the handful
 * we actually use into one small file keeps the bundle honest and makes the
 * exact path data reviewable in the diff.
 *
 * `simple-icons` is therefore a devDependency. Re-run this after adding a
 * name to WANTED:
 *   node scripts/gen-brand-icons.mjs
 */
import { writeFileSync } from 'fs';
import * as si from 'simple-icons';

/** slug -> the key we expose. Only real, official marks belong here. */
const WANTED = [
  'meta', 'facebook', 'instagram', 'tiktok', 'whatsapp',
  'stripe', 'googleanalytics', 'zoho', 'quickbooks', 'googletagmanager',
];

const out = [];
const missing = [];
for (const slug of WANTED) {
  const key = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1);
  const ic = si[key];
  if (!ic) { missing.push(slug); continue; }
  out.push({ slug, title: ic.title, hex: ic.hex, path: ic.path });
}
if (missing.length) console.warn('NOT IN simple-icons: ' + missing.join(', '));

const body = `/**
 * Official brand marks, generated — do not hand-edit.
 *
 * Source: the \`simple-icons\` package (devDependency), which distributes each
 * company's own mark. Regenerate with \`node scripts/gen-brand-icons.mjs\`.
 *
 * These are real logos, not drawings. Nothing here is authored by us, no mark
 * is recoloured away from its official \`hex\`, and a company with no entry in
 * simple-icons gets no mark at all — never a hand-drawn stand-in and never
 * its initial set in our own typeface. See \`partners.tsx\`.
 *
 * Generated from simple-icons v${si.siMeta ? (process.env.npm_package_dependencies_simple_icons || '16.x') : '16.x'}.
 */

export interface BrandMark {
  /** The company's own name, as simple-icons records it. */
  title: string;
  /** Official brand colour, without the leading #. */
  hex: string;
  /** Single-path SVG glyph on a 24x24 viewBox. */
  path: string;
}

export const BRAND_MARKS = {
${out.map((i) => `  ${i.slug}: {\n    title: ${JSON.stringify(i.title)},\n    hex: ${JSON.stringify(i.hex)},\n    path: ${JSON.stringify(i.path)},\n  },`).join('\n')}
} satisfies Record<string, BrandMark>;

export type BrandKey = keyof typeof BRAND_MARKS;

export const hasBrandMark = (k: string): k is BrandKey => k in BRAND_MARKS;
`;

writeFileSync('components/redesign/brandIcons.ts', body, 'utf8');
console.log(`wrote components/redesign/brandIcons.ts with ${out.length} marks`);
