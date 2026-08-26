import React from 'react';
import { merchantProof } from './copy';
import type { Bi } from './copy';
import { AssetKey } from './assets';
import { Section, SectionHead, AssetSlot, useBi } from './ui';
import { Reveal } from './Reveal';
import TrustedBy from './TrustedBy';

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
    ar: 'متجر أوشحة مبني على نُمُو وشغّال على دومينه الخاص — مودال وكتان وشيفون بأكتر من ٢٥٠ لون، توصيل لكل محافظات مصر، ودفع عند الاستلام.',
    en: 'A scarf store built on numu and running on its own domain — modal, linen and chiffon in 250+ colours, delivery across Egypt, and cash on delivery.',
  },
  asset: 'storeVionne',
  href: 'https://vionneeg.com',
};

/** The surfaces the merchant works in, in the order they meet them. */
const SURFACES: { asset: AssetKey; title: Bi; body: Bi; alt: Bi }[] = [
  {
    asset: 'ordersWorkflow',
    title: {
      ar: 'الأوردرات قدامك، من غير لف ودوران.',
      en: 'Your orders, in front of you — no run-around.',
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
      ar: 'تأكيد الأوردر وتحديث الشحن بيروحوا واتساب لوحدهم، وانت شايف كل رسالة راحت لمين.',
      en: 'Order confirmations and shipping updates go out on WhatsApp on their own, and you see every message that went where.',
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

      <div className="mt-12 grid lg:grid-cols-[1.55fr_1fr] gap-5">
        <Reveal>
          <LeadCard story={LEAD} />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-5">
          {SURFACES.map((s, i) => (
            <Reveal key={s.asset} delay={90 + i * 90}>
              <SurfaceCard surface={s} />
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

const LeadCard: React.FC<{ story: Story }> = ({ story }) => {
  const { b } = useBi();

  return (
    <figure className="h-full flex flex-col bg-cream border border-ink/10 rounded-[10px] overflow-hidden">
      <div className="overflow-hidden border-b border-ink/10">
        <AssetSlot
          asset={story.asset}
          ratio={16 / 10}
          alt={{
            ar: `متجر ${story.name} — ${b(story.category)}`,
            en: `The ${story.name} storefront — ${b(story.category)}`,
          }}
        />
      </div>

      <figcaption className="flex flex-col flex-1 p-5 sm:p-7">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-sage" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage">
            {b({ ar: 'متجر شغّال', en: 'Live store' })}
          </span>
        </div>

        <h3 className="font-display text-[22px]/[1.34] sm:text-[26px]/[1.3] font-bold text-ink mt-3">
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
              focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
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

const SurfaceCard: React.FC<{ surface: (typeof SURFACES)[number] }> = ({ surface }) => {
  const { b } = useBi();
  return (
    <figure className="h-full flex flex-col bg-cream border border-ink/10 rounded-[10px] overflow-hidden">
      <div className="overflow-hidden border-b border-ink/10">
        <AssetSlot asset={surface.asset} alt={surface.alt} ratio={16 / 9} />
      </div>
      <figcaption className="flex flex-col flex-1 p-5 sm:p-6">
        <h3 className="font-display text-[17px]/[1.42] font-bold text-ink">{b(surface.title)}</h3>
        <p className="prose-body-sm mt-2.5 text-ink-soft/80">{b(surface.body)}</p>
      </figcaption>
    </figure>
  );
};

export default MerchantProof;
