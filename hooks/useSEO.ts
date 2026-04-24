import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * useSEO — dynamically updates the document <title>, meta description,
 * canonical link, Open Graph / Twitter card tags, and hreflang alternates
 * for each page. Falls back to the defaults in index.html when unmounted.
 *
 * hreflang: numu is bilingual from a single URL (RTL switches client-side),
 * so the `<link rel="alternate" hreflang="...">` tags point to the same
 * canonical for `ar-EG`, `en`, and `x-default`. This signals to Google
 * that Arabic- and English-speaking searchers should both land here.
 */
const DEFAULT_TITLE = 'NUMU — Build Your Online Store in Egypt & MENA';
const DEFAULT_DESCRIPTION =
  'Launch your e-commerce store with bilingual Arabic-English support, Egyptian payment gateways (Paymob, Fawry), Bosta shipping, and ETA e-invoicing. Start selling online in Egypt, Saudi Arabia, and UAE today.';
const DEFAULT_CANONICAL = 'https://numueg.app/';
const DEFAULT_OG_IMAGE = 'https://numueg.app/og-image.png';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Idempotently upsert a <link rel="alternate" hreflang="..." href="..."> tag. */
function setHreflang(hreflang: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][hreflang="${hreflang}"]`,
  );
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSEO({ title, description, canonical, ogImage, noIndex }: SEOProps) {
  useEffect(() => {
    const canon = canonical ?? DEFAULT_CANONICAL;

    // Title
    document.title = title;
    setMeta('title', title);

    // Description
    setMeta('description', description);

    // Robots
    setMeta(
      'robots',
      noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    );

    // Canonical
    setLink('canonical', canon);

    // Open Graph
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', canon, 'property');
    setMeta('og:image', ogImage ?? DEFAULT_OG_IMAGE, 'property');

    // Twitter
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage ?? DEFAULT_OG_IMAGE);

    // hreflang alternates — same URL serves both languages
    setHreflang('ar-EG', canon);
    setHreflang('ar', canon);
    setHreflang('en', canon);
    setHreflang('x-default', canon);

    return () => {
      // Restore defaults on unmount
      document.title = DEFAULT_TITLE;
      setMeta('title', DEFAULT_TITLE);
      setMeta('description', DEFAULT_DESCRIPTION);
      setMeta(
        'robots',
        'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      );
      setLink('canonical', DEFAULT_CANONICAL);
      setMeta('og:title', DEFAULT_TITLE, 'property');
      setMeta('og:description', DEFAULT_DESCRIPTION, 'property');
      setMeta('og:url', DEFAULT_CANONICAL, 'property');
      setMeta('og:image', DEFAULT_OG_IMAGE, 'property');
      setMeta('twitter:title', DEFAULT_TITLE);
      setMeta('twitter:description', DEFAULT_DESCRIPTION);
      setMeta('twitter:image', DEFAULT_OG_IMAGE);
      setHreflang('ar-EG', DEFAULT_CANONICAL);
      setHreflang('ar', DEFAULT_CANONICAL);
      setHreflang('en', DEFAULT_CANONICAL);
      setHreflang('x-default', DEFAULT_CANONICAL);
    };
  }, [title, description, canonical, ogImage, noIndex]);
}
