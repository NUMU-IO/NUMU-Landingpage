/**
 * Production asset register — `assets/asset-plan.md`.
 *
 * The redesign package fixes both the filenames and the rule that a
 * placeholder must never reach production:
 *
 *   "Until the user supplies an asset, the implementation must show a
 *    neutral placeholder with a visible `ASSET REQUIRED` note in the
 *    development environment only. No placeholder may ship to production."
 *
 * `delivered: false` therefore does two things at once — it shows the
 * developer exactly what is outstanding, and it keeps the unfinished visual
 * out of the production build. Flip a flag to `true` in the same commit that
 * adds the real file; nothing else needs to change.
 */

export interface AssetEntry {
  /** Public URL once delivered. */
  src: string;
  /** Whether the real file exists in `public/`. */
  delivered: boolean;
  /** Who owes this file — `asset-plan.md` § "Required production assets". */
  owner: string;
}

export const ASSETS = {
  /* ── Hero — derived from the supplied master `hero-video.mp4` ── */
  heroVideo: { src: '/assets/hero-video.mp4', delivered: true, owner: 'User/marketing' },
  heroVideoWebm: { src: '/assets/hero-video.webm', delivered: true, owner: 'Developer' },
  heroVideoMobile: { src: '/assets/hero-video-mobile.mp4', delivered: true, owner: 'Developer' },
  heroPoster: { src: '/assets/hero-poster.webp', delivered: true, owner: 'User/marketing' },
  heroPosterMobile: { src: '/assets/hero-poster-mobile.webp', delivered: true, owner: 'Developer' },

  /* ── Merchant proof — portraits blocked on written consent, not on files.
     The section renders real product surfaces meanwhile; see
     `MerchantProof.tsx`. ── */
  merchantLead: { src: '/assets/merchant-lead.webp', delivered: false, owner: 'Marketing' },
  merchantSupport01: { src: '/assets/merchant-support-01.webp', delivered: false, owner: 'Marketing' },
  merchantSupport02: { src: '/assets/merchant-support-02.webp', delivered: false, owner: 'Marketing' },

  /* ── Product system ──
     Captured from the live merchant hub on 2026-08-23 with every real value
     replaced in the DOM before the shot: customer names, emails, phone
     numbers and the shipping address are fictional, the store identity is a
     stand-in, and the revenue, order, visitor and conversion figures are
     round demo numbers. See `docs/screenshot-redaction.md`. */
  themeEngine: { src: '/assets/theme-engine.webp', delivered: true, owner: 'Product' },
  storefrontPreview: { src: '/assets/storefront-preview.webp', delivered: true, owner: 'Product' },
  dashboardHome: { src: '/assets/dashboard-home.webp', delivered: true, owner: 'Product' },
  analytics: { src: '/assets/analytics.webp', delivered: true, owner: 'Product' },

  /* ── COD operations ── */
  ordersWorkflow: { src: '/assets/orders-workflow.webp', delivered: true, owner: 'Product' },

  /* ── WhatsApp — not in the original asset plan; added because the
     merchant-facing WhatsApp surface is one of the local-commerce claims. */
  whatsapp: { src: '/assets/whatsapp.webp', delivered: true, owner: 'Product' },

  /* ── Trust Network — the merchant-facing risk screen, used as the closing
     visual. Same redaction pass as the other hub captures. */
  trustNetwork: { src: '/assets/trust-network.webp', delivered: true, owner: 'Product' },

  /* ── Inbox — the real omnichannel inbox. Customer display names were
     replaced positionally (the live threads are real conversations), and
     phone numbers and emails were pattern-replaced, before capture. */
  inbox: { src: '/assets/inbox.webp', delivered: true, owner: 'Product' },

  /* ── Vionne — a real merchant's live storefront, captured from
     vionneeg.com. NOT redacted, and deliberately so: this is the merchant's
     own public shopfront, which is the whole point of showing it. It carries
     Vionne's brand and product photography, so it ships only with Vionne's
     permission — tracked as an open launch gate. */
  storeVionne: { src: '/assets/store-vionne.webp', delivered: true, owner: 'Marketing' },

  /* ── "More from numu" gallery ──
     Each of these is a screenshot of the actual route it links to, captured
     from the running app with the (identical on every page) navbar band
     cropped off, so a card shows what is really behind the link. Nothing is
     drawn or mocked up. Regenerate by re-running the capture against a dev
     server whenever one of those pages is redesigned. */
  exploreThemes: { src: '/assets/explore-themes.webp', delivered: true, owner: 'Developer' },
  exploreApps: { src: '/assets/explore-apps.webp', delivered: true, owner: 'Developer' },
  exploreTools: { src: '/assets/explore-tools.webp', delivered: true, owner: 'Developer' },
  exploreLearn: { src: '/assets/explore-learn.webp', delivered: true, owner: 'Developer' },
  exploreDevelopers: { src: '/assets/explore-developers.webp', delivered: true, owner: 'Developer' },
} satisfies Record<string, AssetEntry>;

export type AssetKey = keyof typeof ASSETS;

/** True when the real file is in place and may be rendered in production. */
export const hasAsset = (key: AssetKey): boolean => ASSETS[key].delivered;

/**
 * Marketing has not delivered written consent for any merchant story yet, so
 * the story cards stay out of the production build entirely —
 * `02-merchant-proof.md`: "A story without consent is not eligible for
 * production." Flip this only when all three stories are signed off.
 */
export const MERCHANT_STORIES_APPROVED = false;

/**
 * `true` while running `vite dev`. Used to show the `ASSET REQUIRED` state to
 * developers and hide it from every production build.
 */
export const IS_DEV: boolean =
  typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);
