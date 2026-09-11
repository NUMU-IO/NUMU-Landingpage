/**
 * Post-build prerender script.
 * Launches a local preview server, visits each route with headless Chrome,
 * and saves the rendered HTML to dist/<route>/index.html.
 *
 * After rendering, per-route <title>, meta description, canonical, OG URL
 * and route-specific JSON-LD are injected so that each URL is a distinct,
 * fully-indexable document — not a copy of the homepage shell.
 */
import { spawn } from 'child_process';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer-core';

const DIST = join(process.cwd(), 'dist');
const PORT = 4173;
const SITE = 'https://numueg.app';

// Public, unauthenticated API calls the prerendered pages make (today only
// the store directory /stores is built from), matched BY PATH and fulfilled
// from Node — see the interception handler for why the browser cannot fetch
// them itself.
//
// Path, not full URL, because `.env` ships `VITE_API_URL=/api/v1`: in the
// browser that is same-origin against numueg.app and works, but here the
// app is served from http://localhost:4173, so the very same call resolves
// to http://localhost:4173/api/v1/... — a path the static preview server
// does not have. Matching the absolute production URL therefore matched
// nothing at all.
const API_PATH_RE = /^\/api\/v1\/public\//;
const API_ORIGIN = SITE;

/** The real API URL to serve an intercepted request from, or null. */
function apiTargetFor(requestUrl) {
  let parsed;
  try {
    parsed = new URL(requestUrl);
  } catch {
    return null;
  }
  if (!API_PATH_RE.test(parsed.pathname)) return null;
  return `${API_ORIGIN}${parsed.pathname}${parsed.search}`;
}

/** Fetch JSON as text for `req.respond`. Throws so the caller can fall back
 *  to `req.continue()` — a directory blip must never fail the whole build. */
async function fetchJsonForPage(url) {
  const res = await fetch(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return await res.text();
}

/** The free tools, as [path, name] — kept in one place so /tools's ItemList and
 *  each tool's own WebApplication block can't drift apart. Adding a tool here
 *  gets it prerendered and schema'd; it still needs a route in App.tsx, a card
 *  in pages/Tools.tsx, and a sitemap.xml entry. */
const TOOLS = [
  ['/tools/store-names', 'Store Name Generator'],
  ['/tools/profit-margin', 'Profit Margin Calculator'],
  ['/tools/invoice', 'Invoice Generator'],
  ['/tools/ai-description', 'AI Product Description Writer'],
  ['/tools/vat', 'VAT Calculator'],
  ['/tools/cod', 'COD & RTO Cost Calculator'],
];

/** BreadcrumbList builder: crumb('Apps', '/apps') or crumb(parent, parentPath, leaf, leafPath). */
function crumb(...pairs) {
  const items = [['NUMU', '/']];
  for (let i = 0; i < pairs.length; i += 2) items.push([pairs[i], pairs[i + 1]]);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE}${path}`,
    })),
  };
}

/**
 * Per-route prerender config.
 *
 * Title, description, canonical, OG URL, and the default robots/OG tags are set
 * by the `useSEO` hook inside each page component, which runs before puppeteer
 * captures `page.content()`. We therefore do NOT rewrite those — they are the
 * source of truth.
 *
 * What we DO inject per route:
 *   - extraJsonLd: BreadcrumbList / Product / ContactPage / etc.
 *   - x-numu-prerendered marker (verifies in CI that prerender ran)
 */
/** Secondary pages added by the v1 redesign — prerendered so each is an
 *  indexable document rather than an empty SPA shell. */
const REDESIGN_ROUTES = [
  ['/features', 'Features'],
  ['/integrations', 'Integrations'],
  ['/product-tour', 'Product tour'],
  ['/trust-network', 'Trust Network'],
  ['/support', 'Support'],
  ['/about', 'About'],
  ['/resources', 'Resources'],
].map(([path, name]) => ({
  path,
  extraJsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'NUMU', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
      ],
    },
  ],
}));

const ROUTES = [
  {
    path: '/',
    extraJsonLd: [],
  },
  ...REDESIGN_ROUTES,
  {
    path: '/pricing',
    extraJsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'NUMU', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${SITE}/pricing` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'NUMU E-commerce Platform',
        description: 'Egyptian e-commerce platform with Paymob, Fawry, Bosta, and ETA e-invoicing integration.',
        brand: { '@type': 'Brand', name: 'NUMU' },
        offers: [
          {
            '@type': 'Offer',
            name: '37-Day Free Trial',
            price: '0',
            priceCurrency: 'EGP',
            availability: 'https://schema.org/InStock',
            url: `${SITE}/pricing`,
          },
          {
            '@type': 'Offer',
            name: 'Starter',
            price: '250',
            priceCurrency: 'EGP',
            availability: 'https://schema.org/InStock',
            url: `${SITE}/pricing`,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '250',
              priceCurrency: 'EGP',
              unitText: 'MONTH',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/contact',
    extraJsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact NUMU',
        url: `${SITE}/contact`,
        mainEntity: {
          '@type': 'Organization',
          name: 'NUMU',
          url: SITE,
          contactPoint: [
            {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: 'support@numueg.app',
              availableLanguage: ['English', 'Arabic'],
              areaServed: ['EG', 'SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
            },
            {
              '@type': 'ContactPoint',
              contactType: 'sales',
              email: 'sales@numueg.app',
              availableLanguage: ['English', 'Arabic'],
            },
          ],
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'NUMU', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE}/contact` },
        ],
      },
    ],
  },
  ...[
    ['/apps', 'Apps'],
    ['/themes', 'Themes'],
    ['/developers', 'Developers'],
    ['/learn', 'Learn'],
    ['/stores', 'Stores'],
  ].map(([path, name]) => ({ path, extraJsonLd: [crumb(name, path)] })),
  {
    path: '/tools',
    extraJsonLd: [
      crumb('Free Tools', '/tools'),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Free e-commerce tools for Egyptian merchants',
        itemListElement: TOOLS.map(([path, name], i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name,
          url: `${SITE}${path}`,
        })),
      },
    ],
  },
  ...TOOLS.map(([path, name]) => ({
    path,
    extraJsonLd: [
      crumb('Free Tools', '/tools', name, path),
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name,
        url: `${SITE}${path}`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EGP' },
        provider: { '@type': 'Organization', name: 'NUMU', url: SITE },
      },
    ],
  })),
  {
    path: '/privacy',
    extraJsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'NUMU', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${SITE}/privacy` },
        ],
      },
    ],
  },
  {
    path: '/terms',
    extraJsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'NUMU', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: `${SITE}/terms` },
        ],
      },
    ],
  },
  {
    path: '/404',
    extraJsonLd: [],
  },
  {
    path: '/refund',
    extraJsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'NUMU', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Refund Policy', item: `${SITE}/refund` },
        ],
      },
    ],
  },
  {
    path: '/data-deletion',
    extraJsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'NUMU', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'User Data Deletion', item: `${SITE}/data-deletion` },
        ],
      },
    ],
  },
];

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);

/**
 * Resolve a launchable browser.
 *
 * Local dev (Windows) and GitHub Actions (`/usr/bin/google-chrome`) have a
 * system Chrome. Vercel's build container does not — and `apt-get` isn't an
 * option there — so we fall back to @sparticuz/chromium, a statically-linked
 * Chromium built for Amazon Linux / Lambda, which is exactly what Vercel runs.
 *
 * Without this fallback the build silently degrades to plain `vite build`
 * output: 15 URLs all serving the homepage shell with `canonical=/`, which is
 * what kept 14 of 15 pages out of Google's index.
 */
async function resolveBrowser() {
  for (const p of CHROME_PATHS) {
    if (existsSync(p)) {
      return {
        executablePath: p,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        source: p,
      };
    }
  }

  // @sparticuz/chromium gates unpacking its bundled shared libraries on actually
  // running inside Lambda (helper.js: isRunningInAwsLambdaNode20 reads
  // AWS_LAMBDA_JS_RUNTIME / AWS_EXECUTION_ENV / CODEBUILD_BUILD_IMAGE). Vercel's
  // build container is Amazon Linux 2023 but sets none of them, so the package
  // happily unpacks chromium.br to /tmp/chromium and then skips al2023.tar.br —
  // and the binary dies with `libnss3.so: cannot open shared object file`.
  //
  // Declaring the runtime is not a workaround for a safety check; it is telling
  // the package which libc flavour it is on, and AL2023 is the true answer for
  // this image. It must be set BEFORE the import: setupLambdaEnvironment() runs
  // at module scope and is what puts /tmp/al2023/lib on LD_LIBRARY_PATH.
  process.env.AWS_LAMBDA_JS_RUNTIME ??= 'nodejs20.x';

  try {
    const { default: chromium } = await import('@sparticuz/chromium');
    return {
      executablePath: await chromium.executablePath(),
      // Drop --single-process. It exists to dodge a `prctl(PR_SET_NO_NEW_PRIVS)`
      // failure under Lambda's seccomp profile, which does not apply in a build
      // container — and it makes Chrome flaky when pages are opened and closed in
      // a loop, which is precisely what prerendering 18 routes does.
      args: chromium.args.filter((a) => a !== '--single-process'),
      source: '@sparticuz/chromium (AL2023)',
    };
  } catch (err) {
    throw new Error(
      'No Chrome found and @sparticuz/chromium could not be loaded ' +
        `(${err.message}). Install Chrome, set CHROME_PATH, or run \`npm i\`.`,
    );
  }
}

/**
 * Inject route-specific JSON-LD and a prerender marker just before </head>.
 * Title / meta / canonical are already set by useSEO in each page component.
 */
/**
 * Read the modulepreload hints Vite itself put in the built template.
 *
 * These are the entry chunk's STATIC dependencies — the handful of files the
 * browser genuinely needs before anything can run. Everything else that ends up
 * in the captured DOM was appended at runtime; see `stripRuntimePreloads`.
 */
function templatePreloadHrefs() {
  try {
    const tpl = readFileSync(join(DIST, 'index.html'), 'utf-8');
    return new Set(
      [...tpl.matchAll(/<link[^>]+rel=["']modulepreload["'][^>]*>/gi)]
        .map((m) => (m[0].match(/href=["']([^"']+)["']/i) || [])[1])
        .filter(Boolean),
    );
  } catch {
    return new Set();
  }
}

/**
 * Drop the `<link rel="modulepreload">` tags the APP added while puppeteer was
 * looking at it.
 *
 * `page.content()` serializes the live DOM, so anything the running app
 * appended to `<head>` is baked into the file we ship. Vite's `__vitePreload`
 * appends one of these for every dynamically-imported chunk it resolves — and
 * this page lazy-loads a component per homepage section — so the served HTML
 * carried **18** of them. That is 18 extra High-priority script requests fired
 * during HTML parse, competing for bandwidth with the two render-blocking
 * stylesheets that actually gate First Contentful Paint. Measured on the
 * desktop run: 21 scripts all queued at ~355 ms while `index.css` was still in
 * flight, and FCP landed at 2.1 s against a 240 ms TTFB.
 *
 * Removing them does not remove the chunks — the lazy imports still fetch them,
 * just after the entry has run, which is when they are first needed. Hydration
 * of below-the-fold sections happens a beat later; first paint happens a lot
 * sooner.
 *
 * The template's own hints are preserved: those are the entry's static graph,
 * and dropping them would only trade this problem for a slower boot.
 */
function stripRuntimePreloads(html, allowed) {
  return html.replace(
    /<link[^>]+rel=["']modulepreload["'][^>]*>\s*/gi,
    (tag) => {
      const href = (tag.match(/href=["']([^"']+)["']/i) || [])[1];
      return href && allowed.has(href) ? tag : '';
    },
  );
}

function injectRouteMeta(html, route) {
  const blocks = (route.extraJsonLd || [])
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n    ');

  const marker = `<meta name="x-numu-prerendered" content="${route.path}">`;
  const injection = [blocks, marker].filter(Boolean).join('\n    ');

  return html.replace('</head>', `    ${injection}\n</head>`);
}

/** Polls a URL until it answers, or the timeout elapses. */
async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastErr;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok || res.status === 404) return;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Preview server never became ready at ${url}: ${lastErr}`);
}

async function main() {
  const browserConfig = await resolveBrowser();
  console.log(`Using Chrome: ${browserConfig.source}`);

  // `detached: true` puts the server into its own process group so we can
  // kill the whole group later — killing just the shell wrapper leaves the
  // `serve` grandchild alive with open pipes and Node never exits.
  // DIST is quoted: this project's directory name contains a space and
  // parentheses, and with `shell: true` on Windows an unquoted path is split
  // by the shell, so `serve` never starts and every prerender fails with
  // ERR_CONNECTION_REFUSED.
  const distArg = process.platform === 'win32' ? `"${DIST}"` : DIST;
  const server = spawn('npx', ['serve', distArg, '-s', '-l', String(PORT)], {
    stdio: 'ignore',
    shell: process.platform === 'win32',
    detached: process.platform !== 'win32',
  });

  // Wait for the server to actually answer, rather than sleeping a fixed
  // interval and hoping. `npx serve` cold-starts well past 2s on Windows,
  // which made this race and fail the whole prerender with
  // ERR_CONNECTION_REFUSED.
  await waitForServer(`http://localhost:${PORT}/`, 30000);

  const browser = await puppeteer.launch({
    executablePath: browserConfig.executablePath,
    headless: true,
    args: browserConfig.args,
  });

  // Render all routes first, then write — otherwise the preview server's SPA
  // fallback will pick up an already-written (and marker-polluted) dist/index.html
  // when rendering later routes, cross-contaminating the output.
  // Snapshot the template's own preload hints BEFORE the first capture — the
  // loop below overwrites dist/index.html with the prerendered `/`.
  const templatePreloads = templatePreloadHrefs();
  console.log(`  Template modulepreloads kept: ${templatePreloads.size}`);

  const rendered = [];
  try {
    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route.path}`;
      console.log(`Prerendering: ${route.path}`);

      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'font', 'media'].includes(type)) {
          req.abort();
          return;
        }
        // Serve the public API from Node instead of the browser.
        //
        // The page runs at http://localhost:4173 here, so every call to
        // https://numueg.app/api/v1/... is CROSS-ORIGIN and the API's CORS
        // allowlist does not include this port (it has :5000, the dev
        // server). The browser therefore dropped the response, Stores.tsx
        // hit its .catch(), and /stores prerendered with an empty list —
        // silently, because a directory that fails to load looks exactly
        // like a directory with no approved stores. That is why /stores
        // shipped 0 storefront links even after stores were approved.
        //
        // Node's fetch has no same-origin policy, so proxying the request
        // here fixes it at build time only: no localhost origin has to be
        // added to the production CORS allowlist, and no app code changes.
        const apiTarget = apiTargetFor(req.url());
        if (apiTarget) {
          fetchJsonForPage(apiTarget)
            .then((body) => {
              console.log(`  → API proxied: ${apiTarget} (${body.length}b)`);
              return req.respond({
                status: 200,
                contentType: 'application/json; charset=utf-8',
                headers: { 'Access-Control-Allow-Origin': '*' },
                body,
              });
            })
            .catch((err) => {
              console.warn(`  → API proxy FAILED: ${apiTarget} — ${err.message}`);
              return req.continue();
            });
          return;
        }
        req.continue();
      });

      // Surface in-page failures. A route whose data fetch dies renders an
      // empty-but-valid page, which is indistinguishable from "there is
      // legitimately nothing here" — that is exactly how /stores shipped
      // with zero storefront links without anyone noticing.
      page.on('console', (msg) => {
        if (msg.type() === 'warning' || msg.type() === 'error') {
          console.log(`  [page ${msg.type()}] ${msg.text().slice(0, 200)}`);
        }
      });
      page.on('requestfailed', (r) => {
        if (apiTargetFor(r.url())) {
          console.warn(`  [page request failed] ${r.url()} — ${r.failure()?.errorText}`);
        }
      });

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('#root > *:not(.skeleton-hero)', { timeout: 15000 });
      await new Promise((r) => setTimeout(r, 500));

      let html = await page.content();
      html = stripRuntimePreloads(html, templatePreloads);
      html = injectRouteMeta(html, route);
      rendered.push({ route, html });

      await page.close();
    }
  } finally {
    await browser.close();
    try {
      if (process.platform !== 'win32' && server.pid) {
        // Kill the whole process group (negative pid).
        process.kill(-server.pid, 'SIGTERM');
      } else {
        server.kill();
      }
    } catch {
      // Already dead.
    }
  }

  for (const { route, html } of rendered) {
    const outDir = route.path === '/' ? DIST : join(DIST, route.path.slice(1));
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, 'index.html');
    writeFileSync(outFile, html, 'utf-8');
    console.log(`  → Saved: ${outFile}`);
  }

  // Manifest so verify-prerender.mjs checks exactly what we rendered — a second
  // hand-maintained route list in CI is how /apps, /themes, /tools/* and the
  // rest went unverified (and therefore unprerendered) for months.
  writeFileSync(
    join(DIST, 'prerender-manifest.json'),
    JSON.stringify({ routes: ROUTES.map((r) => r.path) }, null, 2),
    'utf-8',
  );

  console.log(`\n✅ Prerender complete — ${rendered.length} routes.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Prerender failed:', err);
    process.exit(1);
  });
