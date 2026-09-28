import type { Bi } from './copy';
import type { AssetKey } from './assets';

/**
 * Merchants selling on numu — the roster behind the marquee in section 02
 * (`docs/Plans/landing page updates/02-merchants-marquee.md`).
 *
 * The owner named these four for the banner on 2026-09-25. Every entry is a
 * live store a visitor can open; nothing here is a claim about their orders,
 * revenue or growth. The category line is each merchant's own public wording
 * (their store title or their directory description), translated.
 *
 * Logos are the merchants' own files as served by their storefronts
 * (cdn.numueg.app), cropped square to 160 px and never recoloured. Vionne's
 * mark is a white line drawing made for a dark header, so it sits on a dark
 * swatch — the background changes, the logo does not.
 *
 * Thumbnails are their live home pages, captured 2026-09-26 at 1280×800 with
 * every pixel, tracker and beacon blocked so the capture never reached their
 * analytics. Rabbit's hero has no image configured, so its frame is the
 * category row just below it.
 *
 * Before this ships: confirm with each merchant that they are happy to be
 * shown. To drop one, delete its entry — nothing else references it.
 */
export interface Merchant {
  slug: string;
  name: string;
  url: string;
  category: Bi;
  /** Square logo in `public/merchants/`. */
  logo: string;
  /** The mark is light and needs a dark swatch behind it. */
  logoOnDark?: boolean;
  /** Home-page capture, registered in `assets.ts`. */
  thumb: AssetKey;
}

export const MERCHANTS: Merchant[] = [
  {
    slug: 'vionne',
    name: 'Vionne',
    url: 'https://vionneeg.com',
    category: { ar: 'أوشحة وموضة محتشمة', en: 'Scarves & modest fashion' },
    logo: '/merchants/vionne.webp',
    logoOnDark: true,
    thumb: 'merchantVionneHome',
  },
  {
    slug: 'genova',
    name: 'Genova',
    url: 'https://genova.numueg.app',
    category: { ar: 'جينز وموضة حريمي', en: "Women's jeans & fashion" },
    logo: '/merchants/genova.webp',
    thumb: 'merchantGenovaHome',
  },
  {
    slug: 'pixelprint',
    name: 'Pixel Print',
    url: 'https://pixelprinteg.com',
    category: { ar: 'مكتبة كتب أونلاين', en: 'Online bookstore' },
    logo: '/merchants/pixelprint.webp',
    thumb: 'merchantPixelprintHome',
  },
  {
    slug: 'rabbit',
    name: 'Rabbit',
    url: 'https://rabbit.numueg.app',
    category: { ar: 'شرابات وملابس كاجوال', en: 'Socks & casual wear' },
    logo: '/merchants/rabbit.webp',
    thumb: 'merchantRabbitHome',
  },
];
