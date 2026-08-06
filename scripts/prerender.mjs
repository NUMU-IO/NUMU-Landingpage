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
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer-core';

const DIST = join(process.cwd(), 'dist');
const PORT = 4173;
const SITE = 'https://numueg.app';

/** The four free tools, as [path, name] — kept in one place so /tools's
 *  ItemList and each tool's own WebApplication block can't drift apart. */
const TOOLS = [
  ['/tools/store-names', 'Store Name Generator'],
  ['/tools/profit-margin', 'Profit Margin Calculator'],
  ['/tools/invoice', 'Invoice Generator'],
  ['/tools/ai-description', 'AI Product Description Writer'],
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
const ROUTES = [
  {
    path: '/',
    extraJsonLd: [],
  },
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
            name: '30-Day Free Trial',
            price: '0',
            priceCurrency: 'EGP',
            availability: 'https://schema.org/InStock',
            url: `${SITE}/pricing`,
          },
          {
            '@type': 'Offer',
            name: 'Starter',
            price: '99',
            priceCurrency: 'EGP',
            availability: 'https://schema.org/InStock',
            url: `${SITE}/pricing`,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '99',
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
function injectRouteMeta(html, route) {
  const blocks = (route.extraJsonLd || [])
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n    ');

  const marker = `<meta name="x-numu-prerendered" content="${route.path}">`;
  const injection = [blocks, marker].filter(Boolean).join('\n    ');

  return html.replace('</head>', `    ${injection}\n</head>`);
}

async function main() {
  const browserConfig = await resolveBrowser();
  console.log(`Using Chrome: ${browserConfig.source}`);

  // `detached: true` puts the server into its own process group so we can
  // kill the whole group later — killing just the shell wrapper leaves the
  // `serve` grandchild alive with open pipes and Node never exits.
  const server = spawn('npx', ['serve', DIST, '-s', '-l', String(PORT)], {
    stdio: 'ignore',
    shell: process.platform === 'win32',
    detached: process.platform !== 'win32',
  });

  // Wait for server to be ready
  await new Promise((r) => setTimeout(r, 2000));

  const browser = await puppeteer.launch({
    executablePath: browserConfig.executablePath,
    headless: true,
    args: browserConfig.args,
  });

  // Render all routes first, then write — otherwise the preview server's SPA
  // fallback will pick up an already-written (and marker-polluted) dist/index.html
  // when rendering later routes, cross-contaminating the output.
  const rendered = [];
  try {
    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route.path}`;
      console.log(`Prerendering: ${route.path}`);

      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'font', 'media'].includes(type)) req.abort();
        else req.continue();
      });

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('#root > *:not(.skeleton-hero)', { timeout: 15000 });
      await new Promise((r) => setTimeout(r, 500));

      let html = await page.content();
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
