import React from 'react';
import { localCommerce, CTA } from './copy';
import { Section, SectionHead, ContextLink, useBi } from './ui';
import { Reveal } from './Reveal';

/**
 * 03 — Local commerce layer. `sections/03-local-commerce.md`.
 *
 * This is the fixed replacement for Shopify's AI-chat section. No AI or
 * enterprise narrative belongs here.
 *
 * The spec is explicit that the proof must be *one connected workflow*, not
 * three unrelated icon cards. So the three required capability blocks are
 * rendered as the middle stages of a single rail —
 *
 *     customer order → payment choice → shipping decision → merchant dashboard
 *
 * — bookended by the entry and exit chips, joined by a real connector line.
 * The blocks cannot be read as independent features because they are wired
 * into the same track.
 *
 * Every provider name is deliberately absent: `03-local-commerce.md` requires
 * product-owner sign-off before any gateway or carrier is named here, and the
 * approved roster lives one section further down in `Ecosystem`.
 */

const AR_DIGITS = ['١', '٢', '٣'];

const StageMarker: React.FC<{ index: number }> = ({ index }) => {
  const { isAr } = useBi();
  return (
    <span
      aria-hidden="true"
      className="relative z-10 shrink-0 size-11 rounded-full bg-navy text-cream
        grid place-items-center font-display text-lg font-bold
        ring-8 ring-cream"
    >
      {isAr ? AR_DIGITS[index] : index + 1}
    </span>
  );
};

/** Entry / exit chip on the rail — the customer at one end, the merchant at the other. */
const RailChip: React.FC<{ label: string }> = ({ label }) => (
  <span
    className="inline-flex items-center gap-2 self-start rounded-[4px] border border-navy/25
      bg-navy/[0.04] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-navy"
  >
    <span aria-hidden="true" className="size-1.5 rounded-full bg-saffron" />
    {label}
  </span>
);

const LocalCommerce: React.FC = () => {
  const { b } = useBi();

  return (
    <Section id="local-commerce" surface="cream" labelledBy="local-commerce-heading">
      <SectionHead
        id="local-commerce-heading"
        eyebrow={{ ar: 'السوق المصري', en: 'The Egyptian market' }}
        heading={localCommerce.heading}
        support={localCommerce.support}
      />

      {/* ── One connected workflow ── */}
      <div className="mt-14 sm:mt-16">
        <RailChip label={b(localCommerce.flow.order)} />

        <ol className="relative mt-6 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Connector. Horizontal through the markers on desktop, vertical
              down the start edge on mobile. Decorative only — the ordered
              list and the numbers carry the sequence for assistive tech. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bg-navy/20
              start-[21px] top-4 bottom-4 w-px
              md:start-0 md:end-0 md:top-[22px] md:bottom-auto md:h-px md:w-auto"
          />

          {localCommerce.blocks.map((block, i) => (
            <Reveal as="li" key={block.key} delay={i * 90} className="relative flex gap-4 md:block">
              <StageMarker index={i} />

              <div className="md:mt-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-navy-500">
                  {b(block.step)}
                </p>
                <h3 className="font-display text-[18px]/[1.4] sm:text-[20px]/[1.38] font-bold text-ink mt-2">
                  {b(block.heading)}
                </h3>
                <p className="prose-body-sm mt-3 text-ink-soft/80">{b(block.body)}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* The rail ends where the reading direction ends — under the last
            stage — so the flow closes on the merchant dashboard instead of
            jumping back to the side it started on. */}
        <div className="mt-10 flex justify-start md:justify-end">
          <RailChip label={b(localCommerce.flow.dashboard)} />
        </div>

        <div className="mt-8">
          {/* The fixed route map has no standalone local-commerce page, so the
              approved `اعرف إزاي بتشتغل` link resolves to /features, where
              capabilities are grouped by merchant job. */}
          <ContextLink label={CTA.howItWorks} to="/features" />
        </div>
      </div>
    </Section>
  );
};

export default LocalCommerce;
