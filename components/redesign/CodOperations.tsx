import React from 'react';
import { cod, CTA } from './copy';
import { Section, SectionHead, AssetSlot, ContextLink, useBi } from './ui';
import { Reveal } from './Reveal';

/**
 * 06 — COD operations and Trust Network. `sections/07-cod-operations.md`.
 *
 * The whole section is written around one idea: numu supplies a signal, the
 * merchant makes the decision. No "bad customer", no "fraudster", no
 * fear-based framing, and nothing implying an automatic final judgement.
 *
 * Hashing, data boundaries, fail-open behaviour, retention and appeals are
 * deliberately NOT here — they belong on /trust-network, which the approved
 * contextual link points to.
 *
 * The three merchant-controlled actions are rendered as a labelled legend
 * rather than as mock product chrome. With `orders-workflow.webp` still
 * outstanding, a navy panel dressed up as an app window would be a fabricated
 * screenshot; a legend states the same three actions without pretending to be
 * the product.
 */

/** sage = safe · saffron = review · terracotta = attention only. */
const ACTION_STYLE = [
  { dot: 'bg-sage', text: 'text-sage', border: 'border-sage/40', glyph: '→' },
  { dot: 'bg-saffron', text: 'text-saffron', border: 'border-saffron/40', glyph: '₤' },
  { dot: 'bg-terracotta', text: 'text-terracotta', border: 'border-terracotta/40', glyph: '॥' },
];

const AR_DIGITS = ['١', '٢', '٣'];

const CodOperations: React.FC = () => {
  const { b, isAr } = useBi();

  return (
    <Section id="cod-operations" surface="cream" labelledBy="cod-heading">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
        {/* Copy */}
        <div>
          <SectionHead
            id="cod-heading"
            eyebrow={{ ar: 'الدفع عند الاستلام', en: 'Cash on delivery' }}
            heading={cod.heading}
            support={cod.support}
          />

          {/* Risk signal → merchant decision → ship or prepay. */}
          <ol className="mt-9 space-y-5">
            {cod.steps.map((step, i) => (
              <Reveal as="li" key={i} delay={i * 100} className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="grid place-items-center size-9 shrink-0 rounded-full
                    border border-navy/25 bg-navy/[0.04] font-display text-sm font-bold text-navy"
                >
                  {isAr ? AR_DIGITS[i] : i + 1}
                </span>
                <span className="font-display text-base sm:text-lg font-bold text-ink">
                  {b(step)}
                </span>
              </Reveal>
            ))}
          </ol>

          <p className="prose-body-sm mt-8 max-w-md text-ink-soft/75">{b(cod.control)}</p>

          <div className="mt-7">
            <ContextLink label={CTA.trustNetwork} to="/trust-network" />
          </div>
        </div>

        {/* Product surface — deep navy, per the section's visual treatment. */}
        <Reveal delay={120} className="bg-navy-900 rounded-[10px] p-5 sm:p-7 numu-navy-surface numu-soft-navy">
          <div className="relative z-10">
            <div className="overflow-hidden rounded-[4px] border border-cream/10 bg-navy-800">
              <AssetSlot
                asset="ordersWorkflow"
                ratio={16 / 10}
                alt={{
                  ar: 'شاشة الأوردر في نُمُو وعليها إشارة الريسك والإجراءات المتاحة للتاجر.',
                  en: 'The numu order screen showing the risk signal and the actions available to the merchant.',
                }}
              />
            </div>

            {/* The three merchant-controlled actions. Each pairs a colour with
                a glyph and a text label, so status is never carried by colour
                alone. */}
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/50">
              {b({ ar: 'الإجراءات اللي بإيدك', en: 'The actions you control' })}
            </p>

            <ul className="mt-3 flex flex-wrap gap-2.5">
              {cod.actions.map((action, i) => {
                const s = ACTION_STYLE[i];
                return (
                  <li
                    key={i}
                    className={`inline-flex items-center gap-2 rounded-[4px] border ${s.border}
                      bg-cream/[0.06] px-3.5 py-2`}
                  >
                    <span aria-hidden="true" className={`size-1.5 rounded-full ${s.dot}`} />
                    <span className="text-sm font-semibold text-cream">{b(action)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
};

export default CodOperations;
