import React from 'react';
import { merchantProof } from './copy';
import type { Bi } from './copy';
import { AssetKey } from './assets';
import { Section, SectionHead, AssetSlot, useBi } from './ui';
import { Reveal } from './Reveal';
import TrustedBy from './TrustedBy';
import MerchantMarquee from './MerchantMarquee';
import { PARTNERS_WITH_LOGOS } from './partners';
import { THEMES } from './themesData';

/**
 * 02 — Merchant proof. `sections/02-merchant-proof.md`.
 *
 * ─── What is and is not claimed here ──────────────────────────────────────
 * Vionne is a real merchant running on numu. Everything stated about them is
 * either verifiable from their own live storefront or taken verbatim from the
 * description they publish themselves:
 *
 *   • the store exists at vionneeg.com, on its own domain, built on numu;
 *   • the category, the materials and the colour count are Vionne's own
 *     published copy;
 *   • cash on delivery and delivery across Egypt are stated on their store.
 *
 * There is deliberately NO quote attributed to the merchant and NO
 * performance number — not revenue, not order counts, not growth. A quote
 * nobody said is a fabricated testimonial however plausible it reads, and
 * `handoff-checklist.md` requires written consent before a merchant claim
 * ships. The moment Vionne supplies one sentence and signs off, drop it into
 * `quote` below and it renders.
 *
 * The two supporting cards are product surfaces rather than second and third
 * merchants, for the same reason: one consented story beats three invented
 * ones.
 *
 * ─── The roster (added 2026-09-25, owner request) ─────────────────────────
 * Above the story, `MerchantMarquee` shows every merchant the owner named —
 * logo, category and a live link in one row, their home pages in a second
 * row moving the other way. The roster is proof that the stores exist; the
 * lead card below stays the one story told in full. Roster data and the
 * pre-deploy consent note live in `merchants.ts`.
 */

interface Story {
  /** Merchant's own store name. */
  name: string;
  category: Bi;
  /** Their own published description, or an approved quote once supplied. */
  body: Bi;
  asset: AssetKey;
  /** Live storefront, so any reader can verify the store is real. */
  href?: string;
  /** Only ever an approved verbatim quote. Empty until Vionne signs one off. */
  quote?: Bi;
}

const LEAD: Story = {
  name: 'Vionne',
  category: { ar: 'أوشحة وموضة محتشمة', en: 'Scarves & modest fashion' },
  body: {
    ar: 'متجر أوشحة مبني على نُمُو وشغّال على دومينه الخاص: مودال وكتان وشيفون بأكتر من ٢٥٠ لون، توصيل لكل محافظات مصر، ودفع عند الاستلام.',
    en: 'A scarf store built on numu and running on its own domain: modal, linen and chiffon in 250+ colours, delivery across Egypt, and cash on delivery.',
  },
  asset: 'storeVionne',
  href: 'https://vionneeg.com',
};

/**
 * numu in numbers. Every figure is true and can be checked:
 *   • products: rows in the production `products` table, non-demo tenants,
 *     read 2026-11-22 (7,683), rounded down. Re-read before changing it.
 *   • integrations and themes: counted from this site's own lists, so they
 *     cannot drift from what the pages show.
 * Orders, customers and sales are deliberately not here yet: see the rule at
 * the top of this file. Add them when they are worth showing, as real figures.
 */
const NUMBERS: { value: string; label: Bi; icon: React.ReactNode }[] = [
  {
    value: '+7,600',
    label: { ar: 'منتج معروض في متاجر نُمُو', en: 'products listed in numu stores' },
    icon: (
      <>
        <path d="M3 9l1.5-5h15L21 9" />
        <path d="M4 9v11h16V9" />
        <path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0" />
      </>
    ),
  },
  {
    value: String(PARTNERS_WITH_LOGOS.length),
    label: { ar: 'تكامل دفع وشحن وقنوات بيع', en: 'payment, shipping and channel integrations' },
    icon: (
      <>
        <path d="M9 7H6a3 3 0 000 6h3" />
        <path d="M15 7h3a3 3 0 010 6h-3" />
        <path d="M8 10h8" />
      </>
    ),
  },
  {
    value: String(THEMES.length),
    label: { ar: 'ثيم جاهز تبدأ بيه', en: 'ready themes to start from' },
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 9v11" />
      </>
    ),
  },
];

/** The colour block each screenshot stands on. */
const STAGES = ['bg-navy', 'bg-saffron', 'bg-bone'] as const;

/** The surfaces the merchant works in, in the order they meet them. */
const SURFACES: { asset: AssetKey; title: Bi; body: Bi; alt: Bi }[] = [
  {
    asset: 'ordersWorkflow',
    title: {
      ar: 'الأوردرات قدامك، من غير لف ودوران.',
      en: 'Your orders, in front of you. No run-around.',
    },
    body: {
      ar: 'كل أوردر وحالته وعميله وشحنته في شاشة واحدة. مش ورقة وقلم ولا عشر تابات مفتوحة.',
      en: 'Every order with its status, customer and shipment on one screen. Not a notebook and ten open tabs.',
    },
    alt: {
      ar: 'شاشة الأوردر في نُمُو وعليها بيانات العميل والدفع والشحن.',
      en: 'The numu order screen with customer, payment and shipping detail.',
    },
  },
  {
    asset: 'whatsapp',
    title: {
      ar: 'كلّم عميلك من نفس المكان.',
      en: 'Talk to your customer from the same place.',
    },
    body: {
      ar: 'تأكيد الأوردر وتحديث الشحن بيروحوا واتساب لوحدهم، وانت شايف كل رسالة راحت لمين. محتاجة تفعيل إضافة واتساب (اشتراك شهري منفصل).',
      en: 'Order confirmations and shipping updates go out on WhatsApp on their own, and you see every message that went where. Needs the WhatsApp add-on (a separate monthly subscription).',
    },
    alt: {
      ar: 'شاشة واتساب بيزنس في نُمُو وعليها الرسائل المرسلة وحالتها.',
      en: 'The numu WhatsApp Business screen showing sent messages and their status.',
    },
  },
];

const MerchantProof: React.FC = () => {
  const { b } = useBi();

  return (
    <Section id="merchant-proof" surface="paper" labelledBy="merchant-proof-heading">
      <SectionHead
        id="merchant-proof-heading"
        eyebrow={{ ar: 'تجّار نُمُو', en: 'numu merchants' }}
        heading={merchantProof.heading}
        support={merchantProof.support}
      />

      <MerchantMarquee className="mt-10" />

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {NUMBERS.map((n) => (
          <div key={n.value} className="flex flex-col-reverse items-center rounded-[18px] bg-cream px-5 py-9 text-center">
            <dt className="prose-body-sm mt-2 text-ink-soft/75">{b(n.label)}</dt>
            <dd className="font-display text-[40px]/[1.1] font-bold text-ink tabular-nums">{n.value}</dd>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-5 size-7 text-navy"
            >
              {n.icon}
            </svg>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid lg:grid-cols-[1.55fr_1fr] gap-x-8 gap-y-12">
        <Reveal>
          <LeadCard story={LEAD} />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-10">
          {SURFACES.map((s, i) => (
            <Reveal key={s.asset} delay={90 + i * 90}>
              <SurfaceCard surface={s} stage={STAGES[(i + 1) % STAGES.length]} />
            </Reveal>
          ))}
        </div>
      </div>

      <p className="prose-body-sm mt-8 max-w-2xl text-ink-soft/65">
        {b(merchantProof.pendingNote)}
      </p>

      {/* The partner strip rides at the foot of this section rather than
          becoming a ninth one — see `TrustedBy.tsx`. */}
      <TrustedBy className="mt-12" />
    </Section>
  );
};

/**
 * A screenshot on a colour block, inside a plain browser frame that runs off
 * the bottom edge. The frame is three dots and an address line: enough to say
 * "this is a web page", with no invented interface in it.
 */
const Staged: React.FC<{ stage: string; address?: string; children: React.ReactNode }> = ({
  stage,
  address,
  children,
}) => (
  <div className={`overflow-hidden rounded-[20px] px-5 pt-6 sm:px-9 sm:pt-9 ${stage}`}>
    <div className="overflow-hidden rounded-t-[12px] bg-paper numu-float-shadow">
      <div dir="ltr" aria-hidden="true" className="flex items-center gap-1.5 bg-cream px-3 py-2">
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="size-2 rounded-full bg-ink/15" />
        {address && (
          <span className="ms-3 truncate rounded-full bg-paper px-3 py-0.5 font-mono text-[10px] text-ink-soft/60">
            {address}
          </span>
        )}
      </div>
      {children}
    </div>
  </div>
);

const LeadCard: React.FC<{ story: Story }> = ({ story }) => {
  const { b } = useBi();

  return (
    <figure className="h-full flex flex-col">
      <Staged stage={STAGES[0]} address={story.href?.replace(/^https?:\/\//, '')}>
        <AssetSlot
          asset={story.asset}
          /* Measured: 429 CSS px on desktop, full width on a phone. */
          sizes="(min-width: 1024px) 440px, 100vw"
          ratio={16 / 10}
          alt={{
            ar: `متجر ${story.name} — ${b(story.category)}`,
            en: `The ${story.name} storefront — ${b(story.category)}`,
          }}
        />
      </Staged>

      <figcaption className="flex flex-col flex-1 px-1 pt-6">
        <h3 className="font-display text-[22px]/[1.34] sm:text-[26px]/[1.3] font-bold text-ink">
          {story.name}
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft/60 mt-1.5">
          {b(story.category)}
        </p>

        {/* Rendered only once an approved verbatim quote exists. */}
        {story.quote && (
          <blockquote className="font-display text-[19px]/[1.45] text-ink mt-5">
            {b(story.quote)}
          </blockquote>
        )}

        <p className="prose-body-sm mt-4 text-ink-soft/85">{b(story.body)}</p>

        {story.href && (
          <a
            href={story.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-auto pt-6 inline-flex items-center gap-1.5 min-h-6 text-sm font-semibold
              text-navy rounded-[2px] focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <span className="underline decoration-navy/30 underline-offset-4 group-hover:decoration-navy">
              {b({ ar: 'زور المتجر', en: 'Visit the store' })}
            </span>
            <span
              aria-hidden="true"
              className="rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            >
              →
            </span>
          </a>
        )}
      </figcaption>
    </figure>
  );
};

const SurfaceCard: React.FC<{ surface: (typeof SURFACES)[number]; stage: string }> = ({ surface, stage }) => {
  const { b } = useBi();
  return (
    <figure className="h-full flex flex-col">
      <Staged stage={stage}>
        <AssetSlot
          asset={surface.asset}
          alt={surface.alt}
          /* Measured: 667 CSS px on desktop. */
          sizes="(min-width: 1024px) 680px, 100vw"
          ratio={16 / 9}
        />
      </Staged>
      <figcaption className="flex flex-col flex-1 px-1 pt-5">
        <h3 className="font-display text-[17px]/[1.42] font-bold text-ink">{b(surface.title)}</h3>
        <p className="prose-body-sm mt-2.5 text-ink-soft/80">{b(surface.body)}</p>
      </figcaption>
    </figure>
  );
};

export default MerchantProof;
