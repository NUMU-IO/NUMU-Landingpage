import React from 'react';
import { Bi } from './copy';
import type { BrandKey } from './brandIcons';

/**
 * Approved integration roster — `sections/06-ecosystem.md`.
 *
 * "Only confirmed integrations may appear as logos." There is no "coming
 * soon" tier — the spec forbids it on the homepage — so an unconfirmed
 * integration is simply absent.
 *
 * ─── Every entry was verified against the API, not against marketing copy ──
 * Each `evidence` line points at the code that makes the integration real. An
 * integration is only listed if a merchant can actually use it end to end:
 *
 *   • a payment gateway needs an adapter that takes money, not just an enum
 *     entry (`core/interfaces/services/payment_service.py` lists Tap,
 *     HyperPay, Tabby, Tamara and STC Pay as well — all stubs, all absent
 *     from this file);
 *   • a courier needs a branch in `POST /stores/shipments` that creates a
 *     real waybill.
 *
 * Aramex is the instructive case and is deliberately NOT here. It has a
 * credential validator, and the merchant settings screen offers it as a
 * carrier — but `api/v1/routes/stores/shipments.py` has branches only for
 * Mylerz and J&T, and everything else falls through to `carrier = "bosta"`.
 * Picking Aramex therefore ships with Bosta. Listing it would be exactly the
 * "imply an integration exists when it does not" failure.
 *
 * ─── Source of truth for what is live ─────────────────────────────────────
 * `NUMU-api/src/application/services/carrier_registry.py` (couriers),
 * `NUMU-api/src/api/v1/schemas/tenant/settings.py` (payment rails) and the
 * hub's `src/lib/settings-sections.ts` (everything a merchant can switch on).
 * Re-verify this file, `public/llms.txt`, `/features` and `/about/facts` on
 * every change to those three. The audit with evidence per row lives in
 * `docs/Plans/landing page updates/01-integrations-and-features-audit.md`.
 *
 * ─── Real logos only ──────────────────────────────────────────────────────
 * `logoSrc` must point at that company's actual brand file. A wordmark set in
 * Numueg's own typeface is NOT that company's logo, and shipping one implies
 * a partnership asset that was never supplied.
 *
 * Owner decision 2026-09-28: every integration shows its real logo, taken
 * from what the merchant hub already ships in production (`origin/prod`
 * 4b5f896: `public/*-logo.png`, `public/couriers/`, the Moyasar mark in
 * `PaymentSetup.tsx`), from simple-icons for the global brands (Meta,
 * Facebook, Instagram, TikTok, Visa, Apple Pay), or from the company's own
 * site where the hub only types the name (Fawaterak, ValU, Meeza, ETA,
 * Mastercard). Files live in `public/logos/`. Nothing here is text styled to
 * look like a logo.
 *
 * `glyph` marks numu's OWN capabilities (bank transfer, own courier, custom
 * domain, file import, MCP, AI descriptions): there is no company behind
 * them, so they get a numu pictogram — never another company's mark — and
 * stay out of the logo-only surfaces (`PARTNERS_WITH_LOGOS`,
 * `PARTNERS_WITH_MARKS`).
 */

export type PartnerCategory =
  | 'payments'
  | 'methods'
  | 'wallets'
  | 'shipping'
  | 'handoff'
  | 'messaging'
  | 'marketing'
  | 'tax'
  | 'domains'
  | 'imports'
  | 'ai';

export interface Partner {
  name: string;
  /** Arabic name where the brand is commonly written in Arabic. */
  nameAr?: string;
  category: PartnerCategory;
  /**
   * The company's real brand file in `public/`, or null while one is awaited.
   * Only a file can be used by the Interactive Grid, which takes image URLs.
   */
  logoSrc: string | null;
  /**
   * Key into `brandIcons.ts` — the company's official mark as distributed by
   * simple-icons. An alternative to `logoSrc` for React surfaces, and the
   * reason Meta, TikTok and the rest no longer need a hand-drawn stand-in.
   */
  brand?: BrandKey;
  /** numu's own capability, drawn as a numu pictogram — see the header. */
  glyph?: 'bank' | 'courier' | 'domain' | 'sheet' | 'plug' | 'sparkles';
  /** Short, factual capability line — never a performance claim. */
  desc: Bi;
  /** Where this integration lives in NUMU-api. The reason it may be listed. */
  evidence: string;
  /**
   * What the merchant does to switch it on, when the category's generic
   * sentence (`SETUP` in IntegrationsPage) would be wrong for this entry.
   */
  setup?: Bi;
}

export const PARTNERS: Partner[] = [
  /* ── Payments ── */
  {
    name: 'Paymob',
    category: 'payments',
    logoSrc: '/paymob-icon.webp',
    desc: { ar: 'كروت · آبل باي · محافظ', en: 'Cards · Apple Pay · wallets' },
    evidence: 'external_services/paymob/ — full gateway adapter + webhooks',
  },
  {
    name: 'Fawry',
    nameAr: 'فوري',
    category: 'payments',
    logoSrc: '/fawry-icon.webp',
    desc: { ar: 'ادفع من أي فرع فوري', en: 'Pay at any Fawry outlet' },
    evidence: 'external_services/fawry/ — reference codes + settlement',
  },
  {
    name: 'Kashier',
    category: 'payments',
    logoSrc: '/kashier-icon.webp',
    desc: { ar: 'بوابة دفع متكاملة', en: 'Unified payment gateway' },
    evidence: 'external_services/kashier/ + webhooks/kashier.py',
  },
  {
    name: 'InstaPay',
    nameAr: 'إنستاباي',
    category: 'payments',
    logoSrc: '/instapay-logo.svg',
    desc: { ar: 'تحويل فوري من البنك', en: 'Instant bank transfer' },
    evidence: 'external_services/instapay/ — IPA transfer + proof upload',
  },
  {
    name: 'Fawaterak',
    nameAr: 'فواتيرك',
    category: 'payments',
    logoSrc: '/logos/fawaterak.webp',
    desc: { ar: 'بوابة دفع مصرية', en: 'Egyptian payment gateway' },
    evidence: 'external_services/fawaterak/ — gateway adapter; logo: the F symbol from fawaterak.com header logo',
  },
  {
    name: 'Moyasar',
    nameAr: 'ميسّر',
    category: 'payments',
    logoSrc: '/logos/moyasar.svg',
    desc: { ar: 'بوابة دفع للمتاجر في السعودية', en: 'Payment gateway for stores in Saudi Arabia' },
    evidence: 'external_services/moyasar/ + hub PaymentSetup.tsx (Moyasar credentials; the official mark from docs.moyasar.com)',
  },

  /* ── Payment methods the shopper picks at checkout, through the gateways
        above (W1 audit: Paymob cards, Meeza, wallets, ValU, Apple Pay;
        Kashier Visa/Mastercard + Apple Pay) ── */
  {
    name: 'Visa',
    category: 'methods',
    logoSrc: '/logos/visa.svg',
    desc: { ar: 'كروت فيزا عن طريق Paymob أو Kashier', en: 'Visa cards through Paymob or Kashier' },
    evidence: 'external_services/paymob/ + external_services/kashier/ (card payments)',
  },
  {
    name: 'Apple Pay',
    nameAr: 'آبل باي',
    category: 'methods',
    logoSrc: '/logos/applepay.svg',
    desc: { ar: 'آبل باي عن طريق Paymob أو Kashier', en: 'Apple Pay through Paymob or Kashier' },
    evidence: 'SavePaymobCredentialsRequest.apple_pay_integration_id + Kashier Apple Pay toggle',
  },
  {
    name: 'Mastercard',
    category: 'methods',
    logoSrc: '/logos/mastercard.svg',
    desc: { ar: 'كروت ماستركارد عن طريق Paymob أو Kashier', en: 'Mastercard cards through Paymob or Kashier' },
    evidence: 'external_services/paymob/ + external_services/kashier/ (card payments); logo: Mastercard Brand Center symbol SVG',
  },
  {
    name: 'Meeza',
    nameAr: 'ميزة',
    category: 'methods',
    logoSrc: '/logos/meeza.webp',
    desc: { ar: 'كروت ميزة عن طريق Paymob', en: 'Meeza cards through Paymob' },
    evidence: 'hub Paymob methods (Visa, Mastercard, Meeza, Wallets, ValU); logo: meeza-eg.com header mark',
  },
  {
    name: 'ValU',
    nameAr: 'فاليو',
    category: 'methods',
    logoSrc: '/logos/valu.svg',
    desc: { ar: 'تقسيط فاليو عن طريق Paymob', en: 'valU instalments through Paymob' },
    evidence: 'hub Paymob methods (… ValU); logo: valugroup.com header SVG',
  },

  /* ── Wallets and transfers (manual rails: the shopper transfers, uploads
        the receipt, the merchant confirms) ── */
  {
    name: 'Vodafone Cash',
    nameAr: 'فودافون كاش',
    category: 'wallets',
    logoSrc: '/logos/vodafone-cash.webp',
    desc: { ar: 'العميل يحوّل ويرفع الإيصال، والأوردر يتأكد', en: 'The customer transfers and uploads the receipt; the order confirms' },
    evidence: 'schemas/tenant/settings.py SaveVodafoneCashCredentialsRequest + storefront /vodafone-cash',
  },
  {
    name: 'WE Pay',
    category: 'wallets',
    logoSrc: '/logos/we-pay.webp',
    desc: { ar: 'العميل يحوّل ويرفع الإيصال، والأوردر يتأكد', en: 'The customer transfers and uploads the receipt; the order confirms' },
    evidence: 'schemas/tenant/settings.py we_pay + storefront /we-pay',
  },
  {
    name: 'Orange Cash',
    nameAr: 'أورنج كاش',
    category: 'wallets',
    logoSrc: '/logos/orange-cash.webp',
    desc: { ar: 'العميل يحوّل ويرفع الإيصال، والأوردر يتأكد', en: 'The customer transfers and uploads the receipt; the order confirms' },
    evidence: 'schemas/tenant/settings.py orange_cash + storefront /orange-cash',
  },
  {
    name: 'Bank transfer',
    nameAr: 'تحويل بنكي',
    category: 'wallets',
    logoSrc: null,
    glyph: 'bank',
    desc: { ar: 'تحويل على حساب المتجر مع رفع الإيصال', en: 'A transfer to the store account, with the receipt uploaded' },
    evidence: 'schemas/tenant/settings.py bank_transfer + bank_accounts_count',
  },

  /* ── Shipping ── */
  {
    name: 'Bosta',
    nameAr: 'بوسطة',
    category: 'shipping',
    logoSrc: '/bosta-logo.svg',
    desc: { ar: 'بوالص · أسعار بالمحافظة', en: 'Waybills · governorate rates' },
    evidence: 'external_services/bosta/ — create, track, return',
  },
  {
    name: 'Mylerz',
    category: 'shipping',
    logoSrc: '/logos/mylerz.webp',
    desc: { ar: 'شحن وتتبّع للأوردرات', en: 'Shipping and order tracking' },
    evidence: 'external_services/mylerz/ + shipments.py branch',
  },
  {
    name: 'J&T Express',
    category: 'shipping',
    logoSrc: '/logos/jt.webp',
    desc: { ar: 'شحن وتتبّع للأوردرات', en: 'Shipping and order tracking' },
    evidence: 'external_services/jt/ + shipments.py branch',
  },

  {
    name: 'Your own courier',
    nameAr: 'مندوبك الخاص',
    category: 'shipping',
    logoSrc: null,
    glyph: 'courier',
    desc: { ar: 'بوليصة من نُمُو وصفحة تتبّع للعميل', en: 'A numu waybill and a tracking page for the customer' },
    setup: {
      ar: 'بتفعّل «مندوبك الخاص» من إعدادات الشحن، ونُمُو بيطلع البوليصة وصفحة التتبّع لكل أوردر.',
      en: 'You switch on "your own courier" in shipping settings; numu issues the waybill and the tracking page for every order.',
    },
    evidence: 'application/services/carrier_registry.py "manual" (مندوب خاص) + storefront /track',
  },

  /* ── Couriers without an API: numu hands the day's parcels over as a CSV
        sheet plus a WhatsApp message, and the outcomes come back by file.
        Logos are the hub's own files ("only marks confirmed to belong to the
        company", hub courierLogos.ts). ── */
  {
    name: 'Egypt Post',
    nameAr: 'البريد المصري',
    category: 'handoff',
    logoSrc: '/logos/egypt_post.svg',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },
  {
    name: 'Cathedis',
    category: 'handoff',
    logoSrc: '/logos/cathedis.webp',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },
  {
    name: 'MCS',
    category: 'handoff',
    logoSrc: '/logos/mcs.webp',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },
  {
    name: 'R2S',
    category: 'handoff',
    logoSrc: '/logos/r2s.webp',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },
  {
    name: 'Xceed',
    category: 'handoff',
    logoSrc: '/logos/xceed.webp',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },
  {
    name: 'EGL',
    category: 'handoff',
    logoSrc: '/logos/egl.webp',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },
  {
    name: 'Waselha',
    category: 'handoff',
    logoSrc: '/logos/waselha.webp',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },
  {
    name: 'Flextock',
    category: 'handoff',
    logoSrc: '/logos/flextock.webp',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },
  {
    name: 'Holy Ship',
    category: 'handoff',
    logoSrc: '/logos/holyship.webp',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },
  {
    name: 'Barashout',
    category: 'handoff',
    logoSrc: '/logos/barashout.webp',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },
  {
    name: 'Sprint',
    category: 'handoff',
    logoSrc: '/logos/sprint.webp',
    desc: { ar: 'تسليم بكشف CSV ورسالة واتساب، والنتايج بترجع بملف', en: 'Handed over with a CSV sheet and a WhatsApp message; outcomes come back by file' },
    evidence: 'hub CourierManager.tsx (CSV + WhatsApp handoff) + StatusImport.tsx; logo from hub public/couriers/',
  },

  /* ── Messaging ── */
  {
    name: 'WhatsApp',
    nameAr: 'واتساب',
    category: 'messaging',
    logoSrc: '/whatsapp-logo.svg',
    brand: 'whatsapp',
    desc: { ar: 'تحديثات الأوردرات والدعم', en: 'Order updates · support' },
    evidence: 'external_services/whatsapp/ — Cloud API + templates',
  },
  {
    name: 'Facebook',
    nameAr: 'فيسبوك',
    category: 'messaging',
    logoSrc: '/logos/facebook.svg',
    brand: 'facebook',
    desc: { ar: 'رسايل الصفحة في صندوق واحد', en: 'Page messages in the shared inbox' },
    evidence: 'external_services/meta/ — inbox channel',
  },
  {
    name: 'Instagram',
    nameAr: 'إنستغرام',
    category: 'messaging',
    logoSrc: '/logos/instagram.svg',
    brand: 'instagram',
    desc: { ar: 'رسايل إنستغرام في نفس الصندوق', en: 'Instagram messages in the same inbox' },
    evidence: 'external_services/meta/ — inbox channel',
  },

  /* ── Marketing ── */
  {
    name: 'Meta',
    category: 'marketing',
    logoSrc: '/logos/meta.svg',
    brand: 'meta',
    desc: { ar: 'بيكسل وConversions API وفيد الكتالوج', en: 'Pixel, Conversions API and catalogue feed' },
    evidence: 'external_services/meta/ — pixel + CAPI delivery outbox; storefront/meta_feed.py — catalogue feed',
  },
  {
    name: 'TikTok',
    nameAr: 'تيك توك',
    category: 'marketing',
    logoSrc: '/logos/tiktok.svg',
    brand: 'tiktok',
    desc: { ar: 'بيكسل وEvents API', en: 'Pixel and Events API' },
    evidence: 'external_services/tiktok/ — pixel + events',
  },

  /* ── Tax ── */
  {
    name: 'ETA',
    nameAr: 'الفاتورة الإلكترونية',
    category: 'tax',
    logoSrc: '/logos/eta.webp',
    desc: { ar: 'فواتير مصلحة الضرايب المصرية', en: 'Egyptian Tax Authority e-invoicing' },
    evidence: 'external_services/eta/ — e-invoice submission; logo: invoicing.eta.gov.eg portal emblem',
  },

  /* ── Store: domain ── */
  {
    name: 'Custom domain',
    nameAr: 'دومين خاص',
    category: 'domains',
    logoSrc: null,
    glyph: 'domain',
    desc: { ar: 'اربط دومينك في دقايق، والشهادة بتتعمل لوحدها', en: 'Connect your domain in minutes; the certificate is issued automatically' },
    evidence: 'hub components/settings/CustomDomainCard.tsx — Cloudflare for SaaS CNAME flow; vionneeg.com and pixelprinteg.com run on it',
  },

  /* ── Imports ── */
  {
    name: 'Instagram & Facebook import',
    nameAr: 'استيراد من إنستغرام وفيسبوك',
    category: 'imports',
    logoSrc: null,
    brand: 'instagram',
    desc: { ar: 'اسحب منتجات صفحتك للكتالوج', en: 'Pull the products on your page into the catalogue' },
    evidence: 'hub /social (SocialImport.tsx)',
  },
  {
    name: 'CSV & Excel import',
    nameAr: 'استيراد من إكسل وCSV',
    category: 'imports',
    logoSrc: null,
    glyph: 'sheet',
    desc: { ar: 'منتجات وعملاء وأوردرات من ملف', en: 'Products, customers and orders from a file' },
    evidence: 'hub /customers/import, /orders/import, product import (CSV, Excel)',
  },

  /* ── AI ── */
  {
    name: 'Connect your AI (MCP)',
    nameAr: 'اربط الذكاء الاصطناعي (MCP)',
    category: 'ai',
    logoSrc: null,
    glyph: 'plug',
    desc: { ar: 'شغّل متجرك من Claude أو ChatGPT أو Cursor', en: 'Run your store from Claude, ChatGPT or Cursor' },
    evidence: 'hub /settings/mcp + numu-mcp (mcp.numueg.app)',
  },
  {
    name: 'AI product descriptions',
    nameAr: 'وصف منتجات بالذكاء الاصطناعي',
    category: 'ai',
    logoSrc: null,
    glyph: 'sparkles',
    desc: { ar: 'وصف عربي وإنجليزي لكل منتج، دفعة واحدة', en: 'Arabic and English descriptions for every product, in bulk' },
    setup: {
      ar: 'مفيش إعداد: من صفحة المنتج في لوحة التحكم بتطلب الوصف وبتراجعه قبل ما تحفظه.',
      en: 'No setup: from the product page in the dashboard you request the description and review it before saving.',
    },
    evidence: 'routes/stores/ai — /stores/{id}/ai/*',
  },
];

/**
 * The subset with an actual image file. The Interactive Grid takes image URLs,
 * so it can only use these — a `brand` key is React-only.
 */
export const PARTNERS_WITH_LOGOS = PARTNERS.filter(
  (p): p is Partner & { logoSrc: string } => Boolean(p.logoSrc),
);

/**
 * True when a real mark exists for this partner, from either source. Every
 * logo surface asks this rather than assuming — a partner with neither gets a
 * neutral glyph, never an invented mark. See `PartnerLogo.tsx`.
 */
export const hasMark = (p: Partner) => Boolean(p.logoSrc || p.brand);

/** Partners we can show a real mark for, in roster order. */
export const PARTNERS_WITH_MARKS = PARTNERS.filter(hasMark);

/** Everything in one category, logo or not — for prose that names them. */
export const partnersIn = (category: PartnerCategory) =>
  PARTNERS.filter((p) => p.category === category);

export const partnerSlug = (name: string) =>
  name.toLowerCase().replace('&', '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const CATEGORY_LABEL: Record<PartnerCategory, Bi> = {
  payments: { ar: 'دفع', en: 'Payments' },
  methods: { ar: 'طرق دفع', en: 'Payment methods' },
  shipping: { ar: 'شحن', en: 'Shipping' },
  handoff: { ar: 'شحن بالتسليم', en: 'Handoff couriers' },
  messaging: { ar: 'تواصل', en: 'Messaging' },
  marketing: { ar: 'تسويق', en: 'Marketing' },
  tax: { ar: 'فواتير', en: 'Invoicing' },
  wallets: { ar: 'محافظ وتحويل', en: 'Wallets & transfer' },
  domains: { ar: 'دومين', en: 'Domain' },
  imports: { ar: 'استيراد', en: 'Imports' },
  ai: { ar: 'ذكاء اصطناعي', en: 'AI' },
};

/** Category → brand accent. Colour is never the only status carrier. */
export const CATEGORY_ACCENT: Record<PartnerCategory, string> = {
  payments: 'text-navy',
  methods: 'text-navy',
  shipping: 'text-terracotta',
  handoff: 'text-terracotta',
  messaging: 'text-sage',
  marketing: 'text-navy',
  tax: 'text-ink-soft',
  wallets: 'text-navy',
  domains: 'text-ink-soft',
  imports: 'text-sage',
  ai: 'text-terracotta',
};
