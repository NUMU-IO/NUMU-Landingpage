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
  /* ── Hero film — the owner's 48 s motion video (2026-09-27). Masters in
     `docs/Plans/landing page updates/motion video i want to use it/`
     (1080p60); these are 720p30 web cuts: VP9 + Opus WebM, H.264 + AAC MP4
     for Safari. Posters are the 5.5 s frame (mark + «افتح متجرك»). ── */
  heroFilm: { src: '/assets/hero-film.webm', delivered: true, owner: 'User/marketing' },
  heroFilmMp4: { src: '/assets/hero-film.mp4', delivered: true, owner: 'User/marketing' },
  heroFilmMobile: { src: '/assets/hero-film-mobile.webm', delivered: true, owner: 'User/marketing' },
  heroFilmMobileMp4: { src: '/assets/hero-film-mobile.mp4', delivered: true, owner: 'User/marketing' },
  heroFilmPoster: { src: '/assets/hero-film-poster.webp', delivered: true, owner: 'Developer' },
  heroFilmPosterMobile: { src: '/assets/hero-film-poster-mobile.webp', delivered: true, owner: 'Developer' },

  /* ── Previous hero footage — derived from the supplied master
     `hero-video.mp4`. Not rendered since 2026-09-27 (the film above replaced
     it); the files are kept so the owner can switch back. ── */
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

  /* ── Hub captures, 2026-09-25 — local sandbox stack (API :8001, hub :8080),
     the test store, synthetic data. The store name, customer names, emails,
     phone numbers and the one product name were substituted in the DOM
     before each shot (`scripts/redact-and-capture.mjs`; the leak re-scan
     came back empty), so no real merchant or shopper appears. Arabic UI,
     1600×1000 at DPR 2, cropped to 16:10. Consumed by the sections that
     follow (order pipeline, /features proof, onboarding chat); a key nothing
     imports costs nothing at runtime. */
  hubHome: { src: '/assets/hub-home.webp', delivered: true, owner: 'Product' },
  hubOrders: { src: '/assets/hub-orders.webp', delivered: true, owner: 'Product' },
  hubOrderDetail: { src: '/assets/hub-order-detail.webp', delivered: true, owner: 'Product' },
  hubPaymentSetup: { src: '/assets/hub-payment-setup.webp', delivered: true, owner: 'Product' },
  hubLogistics: { src: '/assets/hub-logistics.webp', delivered: true, owner: 'Product' },
  hubSettingsMcp: { src: '/assets/hub-settings-mcp.webp', delivered: true, owner: 'Product' },
  hubThemesMarketplace: { src: '/assets/hub-themes-marketplace.webp', delivered: true, owner: 'Product' },

  /* ── Onboarding chat — the hub's setup wizard with the chat's answers
     already selected, captured from the local stack (synthetic account, no
     real merchant). Shown beside the chat on desktop. */
  hubWizardPrefilled: { src: '/assets/hub-wizard-prefilled.webp', delivered: true, owner: 'Product' },

  /* ── Merchant storefronts — the four live stores' home pages, for the
     second row of the merchants marquee (`merchants.ts`). Public pages,
     captured 2026-09-26 at 1280×800 with every tracker blocked; not
     redacted, because each is the merchant's own public shopfront — which
     is the point of showing it. Ships only after each merchant is asked. */
  merchantVionneHome: { src: '/assets/merchant-vionne-home.webp', delivered: true, owner: 'Marketing' },
  merchantGenovaHome: { src: '/assets/merchant-genova-home.webp', delivered: true, owner: 'Marketing' },
  merchantPixelprintHome: { src: '/assets/merchant-pixelprint-home.webp', delivered: true, owner: 'Marketing' },
  merchantRabbitHome: { src: '/assets/merchant-rabbit-home.webp', delivered: true, owner: 'Marketing' },

  /* ── Illustrations — supplied by the owner on 2026-09-25
     (`docs/Plans/landing page updates/imgs/`: six PNGs in the brand palette,
     drawn characters, no real person or merchant). They set the mood where a
     section or page had no visual; the hub captures stay the proof of the
     product and none of them was removed or replaced by these. WebP masters
     at ≤ 2000 px, q80, each under 170 KB. Placement and alt-text rules:
     `docs/Plans/landing page updates/10-owner-illustrations.md`. */
  illoOpenStore: { src: '/assets/illo-open-store.webp', delivered: true, owner: 'User/marketing' },
  illoMerchantStore: { src: '/assets/illo-merchant-store.webp', delivered: true, owner: 'User/marketing' },
  illoCodDecision: { src: '/assets/illo-cod-decision.webp', delivered: true, owner: 'User/marketing' },
  illoConnectedTools: { src: '/assets/illo-connected-tools.webp', delivered: true, owner: 'User/marketing' },
  illoInboxOnTheGo: { src: '/assets/illo-inbox-on-the-go.webp', delivered: true, owner: 'User/marketing' },
  illoPackingOrders: { src: '/assets/illo-packing-orders.webp', delivered: true, owner: 'User/marketing' },
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
