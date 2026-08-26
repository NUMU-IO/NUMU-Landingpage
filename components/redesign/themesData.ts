/**
 * The real NUMU V3 theme catalogue.
 *
 * Generated from each theme's own `theme.json` in `v3-themes/` — the id,
 * name and description below are the theme's own manifest values, not
 * marketing copy written for this page.
 *
 * `previewUrl` points at the published marketplace thumbnail on
 * cdn.numueg.app — the same image the merchant dashboard shows under
 * Online store → Themes. These are real rendered storefronts, not mockups.
 *
 * Two themes have no published thumbnail yet; `previewUrl: null` makes them
 * render a neutral panel rather than borrow another theme's screenshot.
 *
 * There is deliberately NO category field. The themes have not been
 * categorised, and inventing a taxonomy here would publish an approval that
 * does not exist.
 *
 * Regenerate with scripts/gen-themes.mjs after adding a theme.
 */

export interface ThemeEntry {
  /** Theme id, as published to the marketplace. */
  id: string;
  /** Name from the theme's own manifest. */
  name: string;
  /** Description from the theme's own manifest. */
  description: string;
  /** Published marketplace thumbnail, or null when none exists yet. */
  previewUrl: string | null;
}

const CDN = 'https://cdn.numueg.app/marketplace-thumbs';

export const THEMES: ThemeEntry[] = [
  {
    id: "bazar-v3",
    name: "Bazar (V3)",
    description: "Bazar (V3) — bold Egyptian streetwear storefront. Amber + navy palette, souk-print product cards, wavy dividers, and a full multipage set (home, listing, product, cart, search, 404).",
    previewUrl: `${CDN}/bazar-v3.png`,
  },
  {
    id: "bon-younes-v3",
    name: "Bon Younes (V3)",
    description: "Mobile-first cafe & coffee storefront for Bon Younes — cream and espresso palette, looping drink strip hero, and a scroll-driven brand story.",
    previewUrl: `${CDN}/bon-younes-v3.png`,
  },
  {
    id: "boutique-v3",
    name: "Boutique (V3)",
    description: "Boutique (V3) — vibrant pink/magenta fashion-forward storefront, ported faithfully from the V2 in-tree theme.",
    previewUrl: `${CDN}/boutique-v3.png`,
  },
  {
    id: "editorial-v3",
    name: "Manshet",
    description: "Manshet (مانشيت) — the magazine theme. Front-page headlines in heavy uppercase type, editorial lookbook spreads, pull-quote testimonials and a newspaper masthead header, on warm paper with a deep editorial green and gold foil rules. For image-led fashion and lifestyle stores that want to read like a publication.",
    previewUrl: `${CDN}/editorial-v3.png`,
  },
  {
    id: "elegant-v3",
    name: "Elegant (V3)",
    description: "Elegant (V3) — rich warm-brown classic storefront, ported faithfully from the V2 in-tree theme.",
    previewUrl: `${CDN}/elegant-v3.png`,
  },
  {
    id: "empire-v3",
    name: "Empire (V3)",
    description: "Premium editorial e-commerce — monochromatic palette, wide uppercase display type, Arabic-first (RTL), content-first design.",
    previewUrl: `${CDN}/empire-v3.png`,
  },
  {
    id: "genova-v3",
    name: "Genova (V3)",
    description: "Genova (V3) — an editorial, strictly monochrome storefront built for denim. Wide image plates, hairline structure, no shadows and no accent colour, so the product photography carries the whole page. Ships denim-specific fit guidance, customer styling and store-visit sections.",
    previewUrl: null,
  },
  {
    id: "gilded-glamour-boutique-v3",
    name: "Gilded Glamour Boutique (V3)",
    description: "A bold, gold-accented luxury fashion theme — warm beige canvas, decorative Lobster + uppercase Montserrat display type, parallax hero, scroll-fill brand statement, and curated vertical layouts. A faithful V3 port of the V2 Gilded Glamour Boutique theme. Editable gold header + black footer on every page.",
    previewUrl: `${CDN}/gilded-glamour-boutique-v3.png`,
  },
  {
    id: "kick-game-v3",
    name: "Kick game (V3)",
    description: "Kick Game (V3) — warm minimalist luxury streetwear, dense editorial grid, ported faithfully from the V2 in-tree theme.",
    previewUrl: `${CDN}/kick-game-v3.png`,
  },
  {
    id: "luxury-minimal-v3",
    name: "Luxury Minimal (V3)",
    description: "Minimalist luxury fashion theme — ultra-clean uppercase typography, refined neutrals, a warm gold accent, sharp edges, and subtle motion. A faithful V3 port of the V2 luxury-minimal theme. Great for clothing, accessories, and beauty brands that want timeless polish. Editable monochrome header + footer on every page.",
    previewUrl: `${CDN}/luxury-minimal-v3.png`,
  },
  {
    id: "modern-v3",
    name: "Modern (V3)",
    description: "Modern (V3) — clean teal aesthetic, ported faithfully from the V2 in-tree theme.",
    previewUrl: `${CDN}/modern-v3.png`,
  },
  {
    id: "neo-brutalism-v3",
    name: "Neo Brutalism (V3)",
    description: "Neo Brutalism (V3) — bold, raw, unapologetic design with thick borders, hard shadows, and neon accents. Ported faithfully from the V2 in-tree theme.",
    previewUrl: `${CDN}/neo-brutalism-v3.png`,
  },
  {
    id: "rabbitsocks-v3",
    name: "Mashkal",
    description: "The kaleidoscope gallery theme: products framed in arches, diamonds and circles, with a built-in bundle builder and size chart.",
    previewUrl: `${CDN}/rabbitsocks-v3.png`,
  },
  {
    id: "skeuomorphic-v3",
    name: "Warsha",
    description: "The workshop theme for handmade and artisan sellers: tactile kraft-and-leather surfaces, wax-seal guarantees, and built-in How-It's-Made, Made-to-Order and Materials & Care sections.",
    previewUrl: `${CDN}/skeuomorphic-v3.png`,
  },
  {
    id: "street-v3",
    name: "Street (V3)",
    description: "Street (V3) — bold urban streetwear: yellow, navy and hot pink on cream, topographic grounds and 900-weight uppercase type.",
    previewUrl: `${CDN}/street-v3.png`,
  },
  {
    id: "tech-wave-v3",
    name: "Tech wave (V3)",
    description: "Tech Wave (V3) — futuristic dark storefront with neon accents and glassmorphism, ported faithfully from the V2 in-tree theme.",
    previewUrl: `${CDN}/tech-wave-v3.png`,
  },
  {
    id: "teen-v3",
    name: "Teen (V3)",
    description: "Teen (V3) — a loud, card-led storefront for youth streetwear and lifestyle. A floating capsule header over a full-bleed campaign hero, hairline-outlined product cards with hover-swap imagery and grid quick-add, black bundle promos with a fluorescent-lime discount language, and a purchase-first mobile layout with a sticky add-to-cart bar.",
    previewUrl: null,
  },
  {
    id: "vionne-v3",
    name: "Vionne (V3)",
    description: "Vionne (V3) — refined grayscale storefront for contemporary fashion & accessories, ported faithfully from the V2 in-tree theme. Now with an editable Vionne header + footer included across every page.",
    previewUrl: `${CDN}/vionne-v3.png`,
  },
];

/** Themes that currently have a real published preview image. */
export const THEMES_WITH_PREVIEW = THEMES.filter((t) => t.previewUrl !== null);
