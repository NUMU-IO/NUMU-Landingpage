import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'E:/NUMU/v3-themes';
const OUT = 'E:/NUMU/numu-landing-page (1)/components/redesign/themesData.ts';

// Verified in-browser against cdn.numueg.app on 2026-08-24.
const NO_THUMB = new Set(['genova-v3', 'teen-v3']);

const rows = [];
for (const d of fs.readdirSync(ROOT).filter((x) => x.endsWith('-engine-V3')).sort()) {
  const p = path.join(ROOT, d, 'theme.json');
  if (!fs.existsSync(p)) continue;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const id = j.id || j.slug;
  if (!id) continue;
  rows.push({
    id,
    name: j.name || id,
    description: (j.description || '').trim(),
    hasThumb: !NO_THUMB.has(id),
  });
}

const lines = [];
lines.push(`/**`);
lines.push(` * The real NUMU V3 theme catalogue.`);
lines.push(` *`);
lines.push(` * Generated from each theme's own \`theme.json\` in \`v3-themes/\` — the id,`);
lines.push(` * name and description below are the theme's own manifest values, not`);
lines.push(` * marketing copy written for this page.`);
lines.push(` *`);
lines.push(` * \`previewUrl\` points at the published marketplace thumbnail on`);
lines.push(` * cdn.numueg.app — the same image the merchant dashboard shows under`);
lines.push(` * Online store → Themes. These are real rendered storefronts, not mockups.`);
lines.push(` *`);
lines.push(` * Two themes have no published thumbnail yet; \`previewUrl: null\` makes them`);
lines.push(` * render a neutral panel rather than borrow another theme's screenshot.`);
lines.push(` *`);
lines.push(` * There is deliberately NO category field. The themes have not been`);
lines.push(` * categorised, and inventing a taxonomy here would publish an approval that`);
lines.push(` * does not exist.`);
lines.push(` *`);
lines.push(` * Regenerate with scripts/gen-themes.mjs after adding a theme.`);
lines.push(` */`);
lines.push(``);
lines.push(`export interface ThemeEntry {`);
lines.push(`  /** Theme id, as published to the marketplace. */`);
lines.push(`  id: string;`);
lines.push(`  /** Name from the theme's own manifest. */`);
lines.push(`  name: string;`);
lines.push(`  /** Description from the theme's own manifest. */`);
lines.push(`  description: string;`);
lines.push(`  /** Published marketplace thumbnail, or null when none exists yet. */`);
lines.push(`  previewUrl: string | null;`);
lines.push(`}`);
lines.push(``);
lines.push(`const CDN = 'https://cdn.numueg.app/marketplace-thumbs';`);
lines.push(``);
lines.push(`export const THEMES: ThemeEntry[] = [`);
for (const r of rows) {
  lines.push(`  {`);
  lines.push(`    id: ${JSON.stringify(r.id)},`);
  lines.push(`    name: ${JSON.stringify(r.name)},`);
  lines.push(`    description: ${JSON.stringify(r.description)},`);
  lines.push(`    previewUrl: ${r.hasThumb ? '`${CDN}/' + r.id + '.png`' : 'null'},`);
  lines.push(`  },`);
}
lines.push(`];`);
lines.push(``);
lines.push(`/** Themes that currently have a real published preview image. */`);
lines.push(`export const THEMES_WITH_PREVIEW = THEMES.filter((t) => t.previewUrl !== null);`);
lines.push(``);

fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`wrote ${rows.length} themes, ${rows.filter((r) => r.hasThumb).length} with real previews`);
