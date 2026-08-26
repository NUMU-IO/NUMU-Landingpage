import React from 'react';
import { ecosystem, CTA } from './copy';
import { Section, SectionHead, ContextLink } from './ui';
import InteractiveGrid from './originkit/InteractiveGrid';

/**
 * 07 — Ecosystem and integrations. `sections/06-ecosystem.md`.
 *
 * Only the confirmed roster in `partners.tsx` appears here. There is no
 * "coming soon" tier — the spec forbids labelling an unconfirmed integration
 * that way on the homepage, so an unconfirmed partner is simply absent.
 *
 * The Interactive Grid lives here and nowhere else, and it is a contained
 * showcase rather than a page background.
 */
const Ecosystem: React.FC = () => (
  <Section id="ecosystem" surface="paper" labelledBy="ecosystem-heading">
    <SectionHead
      id="ecosystem-heading"
      eyebrow={{ ar: 'التكاملات', en: 'Integrations' }}
      heading={ecosystem.heading}
      support={ecosystem.support}
    />

    <InteractiveGrid className="mt-12 sm:mt-14" />

    <div className="mt-10">
      <ContextLink label={CTA.integrations} to="/integrations" />
    </div>
  </Section>
);

export default Ecosystem;
