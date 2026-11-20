import React from 'react';
import { ecosystem, CTA } from './copy';
import { Section, SectionHead, ContextLink, useBi } from './ui';
import { PARTNERS_WITH_LOGOS } from './partners';
import PartnerLogo from './PartnerLogo';

/**
 * 07 — Ecosystem and integrations. `sections/06-ecosystem.md`.
 *
 * Only the confirmed roster in `partners.tsx` appears here. There is no
 * "coming soon" tier — the spec forbids labelling an unconfirmed integration
 * that way on the homepage, so an unconfirmed partner is simply absent.
 *
 * One tile per integration, each with its real logo and its name in text, so
 * the roster reads the same on touch, with reduced motion and to a screen
 * reader. `PARTNERS_WITH_LOGOS`, never `PARTNERS`: an integration that is real
 * but has no supplied brand file must not be drawn as a logo.
 */
const Ecosystem: React.FC = () => {
  const { b } = useBi();

  return (
    <Section id="ecosystem" surface="paper" labelledBy="ecosystem-heading">
      <SectionHead
        id="ecosystem-heading"
        eyebrow={{ ar: 'التكاملات', en: 'Integrations' }}
        heading={ecosystem.heading}
        support={ecosystem.support}
      />

      <ul className="mt-12 grid grid-cols-4 gap-2 sm:mt-14 sm:gap-3 md:grid-cols-6 lg:grid-cols-7">
        {PARTNERS_WITH_LOGOS.map((p) => (
          <li
            key={p.name}
            className="flex flex-col items-center justify-center gap-2 rounded-[10px] border border-ink/10
              bg-cream px-1 py-3 text-center sm:gap-2.5 sm:px-2 sm:py-4"
          >
            <PartnerLogo partner={p} size={30} />
            <span className="text-[10.5px]/[1.35] font-semibold text-ink-soft/85 sm:text-[12px]/[1.35]">
              {b({ ar: p.nameAr ?? p.name, en: p.name })}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <ContextLink label={CTA.integrations} to="/integrations" />
      </div>
    </Section>
  );
};

export default Ecosystem;
