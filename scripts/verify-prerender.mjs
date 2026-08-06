/**
 * Post-prerender gate.
 *
 * Runs as the last step of `build:ssg`, so it fails the build on Vercel, in CI,
 * and locally alike. It exists because the failure mode is silent: a build that
 * skips prerender still produces a working, good-looking site — every route just
 * serves the homepage shell with `<link rel="canonical" href="https://numueg.app/">`,
 * which tells Google all 15 URLs are duplicates of the homepage. That is exactly
 * what happened between the Vercel migration and 2026-08: 1 page indexed, 14 not.
 *
 * Checks, per route in dist/prerender-manifest.json:
 *   1. the file exists
 *   2. it carries the x-numu-prerendered marker (i.e. it really was rendered)
 *   3. its canonical points at that route, not at the homepage
 *   4. its <title> is not a byte-for-byte copy of the homepage's
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DIST = join(process.cwd(), 'dist');
const SITE = 'https://numueg.app';
const MANIFEST = join(DIST, 'prerender-manifest.json');

function fileFor(route) {
  return route === '/' ? join(DIST, 'index.html') : join(DIST, route.slice(1), 'index.html');
}

const pick = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};

if (!existsSync(MANIFEST)) {
  console.error(
    `::error::${MANIFEST} missing — prerender did not run.\n` +
      "Check that vercel.json's buildCommand is `npm run build:ssg`, not `vite build`.",
  );
  process.exit(1);
}

const { routes } = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
const homeTitle = pick(readFileSync(fileFor('/'), 'utf-8'), /<title>(.*?)<\/title>/is);
const errors = [];

for (const route of routes) {
  const file = fileFor(route);
  if (!existsSync(file)) {
    errors.push(`${route}: missing ${file}`);
    continue;
  }

  const html = readFileSync(file, 'utf-8');
  const title = pick(html, /<title>(.*?)<\/title>/is);
  const canonical = pick(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const expected = `${SITE}${route === '/' ? '/' : route}`;

  if (!html.includes('x-numu-prerendered')) {
    errors.push(`${route}: no prerender marker — this is a raw SPA shell`);
  }
  if (canonical !== expected) {
    errors.push(`${route}: canonical is "${canonical}", expected "${expected}"`);
  }
  if (route !== '/' && title && title === homeTitle) {
    errors.push(`${route}: <title> is a copy of the homepage's ("${title}")`);
  }
}

// /stores earns its keep only if it ships with real outbound anchors: it is the
// sole crawl path from this domain to any <sub>.numueg.app storefront. It fills
// itself from GET /public/stores at prerender time, so an API that is down, slow,
// or missing the endpoint yields a valid-but-pointless page. Warn loudly rather
// than fail — a marketing API blip should not be able to block a deploy.
if (routes.includes('/stores') && existsSync(fileFor('/stores'))) {
  const html = readFileSync(fileFor('/stores'), 'utf-8');
  const links = html.match(/href="https:\/\/[a-z0-9-]+\.numueg\.app/g) ?? [];
  if (links.length === 0) {
    console.warn(
      '::warning::/stores prerendered with 0 storefront links — GET /public/stores ' +
        'was unreachable or empty at build time. The page is live but passes no ' +
        'crawl signal to any storefront until the next build sees the API.',
    );
  } else {
    console.log(`   /stores carries ${links.length} storefront link(s).`);
  }
}

if (errors.length) {
  for (const e of errors) console.error(`::error::${e}`);
  console.error(`\n❌ Prerender verification failed (${errors.length} problem(s)).`);
  process.exit(1);
}

console.log(`✅ Prerender verified — ${routes.length} routes, each with its own canonical + title.`);
