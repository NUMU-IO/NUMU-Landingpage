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
 * ─── Real logos only ──────────────────────────────────────────────────────
 * `logoSrc` must point at that company's actual brand file. A wordmark set in
 * Numueg's own typeface is NOT that company's logo, and shipping one implies
 * a partnership asset that was never supplied.
 *
 * `logoSrc: null` means the integration is real and working but no brand file
 * has been supplied yet. Those entries are named in prose — which is true and
 * costs nothing — and are excluded from every logo surface by
 * `PARTNERS_WITH_LOGOS`. The day partnerships supplies a file with written
 * permission to display it, set `logoSrc` and it appears in the grid and the
 * strip with no other change.
 *
 * Outstanding logo files: Fawaterak, Mylerz, J&T Express and ETA. Meta,
 * Facebook, Instagram, TikTok and WhatsApp are covered by `brand` keys —
 * simple-icons distributes their official marks, so none of them needs a
 * file supplied by partnerships.
 */

export type PartnerCategory = 'payments' | 'shipping' | 'messaging' | 'marketing' | 'tax';

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
  /** Short, factual capability line — never a performance claim. */
  desc: Bi;
  /** Where this integration lives in NUMU-api. The reason it may be listed. */
  evidence: string;
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
    logoSrc: null,
    desc: { ar: 'بوابة دفع مصرية', en: 'Egyptian payment gateway' },
    evidence: 'external_services/fawaterak/ — gateway adapter',
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
    logoSrc: null,
    desc: { ar: 'شحن وتتبّع للأوردرات', en: 'Shipping and order tracking' },
    evidence: 'external_services/mylerz/ + shipments.py branch',
  },
  {
    name: 'J&T Express',
    category: 'shipping',
    logoSrc: null,
    desc: { ar: 'شحن وتتبّع للأوردرات', en: 'Shipping and order tracking' },
    evidence: 'external_services/jt/ + shipments.py branch',
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
    logoSrc: null,
    brand: 'facebook',
    desc: { ar: 'رسايل الصفحة في صندوق واحد', en: 'Page messages in the shared inbox' },
    evidence: 'external_services/meta/ — inbox channel',
  },
  {
    name: 'Instagram',
    nameAr: 'إنستغرام',
    category: 'messaging',
    logoSrc: null,
    brand: 'instagram',
    desc: { ar: 'رسايل إنستغرام في نفس الصندوق', en: 'Instagram messages in the same inbox' },
    evidence: 'external_services/meta/ — inbox channel',
  },

  /* ── Marketing ── */
  {
    name: 'Meta',
    category: 'marketing',
    logoSrc: null,
    brand: 'meta',
    desc: { ar: 'بيكسل وConversions API', en: 'Pixel and Conversions API' },
    evidence: 'external_services/meta/ — pixel + CAPI delivery outbox',
  },
  {
    name: 'TikTok',
    nameAr: 'تيك توك',
    category: 'marketing',
    logoSrc: null,
    brand: 'tiktok',
    desc: { ar: 'بيكسل وEvents API', en: 'Pixel and Events API' },
    evidence: 'external_services/tiktok/ — pixel + events',
  },

  /* ── Tax ── */
  {
    name: 'ETA',
    nameAr: 'الفاتورة الإلكترونية',
    category: 'tax',
    logoSrc: null,
    desc: { ar: 'فواتير مصلحة الضرايب المصرية', en: 'Egyptian Tax Authority e-invoicing' },
    evidence: 'external_services/eta/ — e-invoice submission',
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

export const CATEGORY_LABEL: Record<PartnerCategory, Bi> = {
  payments: { ar: 'دفع', en: 'Payments' },
  shipping: { ar: 'شحن', en: 'Shipping' },
  messaging: { ar: 'تواصل', en: 'Messaging' },
  marketing: { ar: 'تسويق', en: 'Marketing' },
  tax: { ar: 'فواتير', en: 'Invoicing' },
};

/** Category → brand accent. Colour is never the only status carrier. */
export const CATEGORY_ACCENT: Record<PartnerCategory, string> = {
  payments: 'text-navy',
  shipping: 'text-terracotta',
  messaging: 'text-sage',
  marketing: 'text-navy',
  tax: 'text-ink-soft',
};
