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

function findChrome() {
  for (const p of CHROME_PATHS) {
    if (existsSync(p)) return p;
  }
  throw new Error('Chrome not found. Install Chrome or set CHROME_PATH env var.');
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
  const chromePath = findChrome();
  console.log(`Using Chrome: ${chromePath}`);

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
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

  console.log('\n✅ Prerender complete!');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Prerender failed:', err);
    process.exit(1);
  });
