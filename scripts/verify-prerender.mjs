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

const { routes, indexedRoutes } = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
const homeTitles = Object.fromEntries(
  ['ar', 'en'].map((locale) => [locale, pick(readFileSync(fileFor(`/${locale}`), 'utf-8'), /<title>(.*?)<\/title>/is)]),
);
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
  const locale = route.split('/')[1];
  if (route !== `/${locale}` && title && title === homeTitles[locale]) {
    errors.push(`${route}: <title> is a copy of the homepage's ("${title}")`);
  }

  const relative = route.replace(/^\/(ar|en)/, '');
  const alternateLocale = locale === 'ar' ? 'en' : 'ar';
  const alternate = `${SITE}/${alternateLocale}${relative}`;
  if (!html.includes(`hreflang="${alternateLocale}" href="${alternate}"`)) {
    errors.push(`${route}: missing reciprocal ${alternateLocale} hreflang (${alternate})`);
  }

  const unlocalizedLinks = [...html.matchAll(/<a\b[^>]*\bhref=["']\/(?!\/|ar(?:\/|["'#?])|en(?:\/|["'#?])|assets\/)([^"']*)/gi)];
  if (unlocalizedLinks.length) {
    errors.push(`${route}: ${unlocalizedLinks.length} internal link(s) escape the localized URL tree`);
  }
}

const sitemapFile = join(DIST, 'sitemap.xml');
if (!existsSync(sitemapFile)) {
  errors.push('sitemap.xml: missing from build');
} else {
  const sitemap = readFileSync(sitemapFile, 'utf-8');
  for (const route of indexedRoutes ?? routes) {
    if (!sitemap.includes(`<loc>${SITE}${route}</loc>`)) errors.push(`${route}: missing from sitemap.xml`);
  }
}

const releaseFile = join(DIST, 'release.json');
if (!existsSync(releaseFile)) {
  errors.push('release.json: missing from build');
} else {
  const release = JSON.parse(readFileSync(releaseFile, 'utf-8'));
  if (typeof release.sha !== 'string' || !release.sha) errors.push('release.json: missing sha');
}

for (const locale of ['ar', 'en']) {
  const pricing = readFileSync(fileFor(`/${locale}/pricing`), 'utf-8');
  if (!pricing.includes(locale === 'ar' ? '٣٧ يوم' : '37-day')) {
    errors.push(`/${locale}/pricing: missing the 37-day trial`);
  }
  const starter = pricing.match(/Starter[\s\S]{0,5000}?(?:Pro|Enterprise)/i)?.[0] ?? '';
  if (/50\s+(orders?|طلبات|اوردر|أوردر)/i.test(starter)) {
    errors.push(`/${locale}/pricing: Starter still advertises a 50-order limit`);
  }
}

// /stores earns its keep only if it ships with real outbound anchors: it is the
// sole crawl path from this domain to any <sub>.numueg.app storefront. It fills
// itself from GET /public/stores at prerender time, so an API that is down, slow,
// or missing the endpoint yields a valid-but-pointless page. Warn loudly rather
// than fail — a marketing API blip should not be able to block a deploy.
if (routes.includes('/ar/stores') && existsSync(fileFor('/ar/stores'))) {
  const html = readFileSync(fileFor('/ar/stores'), 'utf-8');
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
