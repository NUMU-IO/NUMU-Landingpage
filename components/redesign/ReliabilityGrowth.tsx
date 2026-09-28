import React from 'react';
import { reliability } from './copy';
import { Section, SectionHead, useBi } from './ui';
import { Reveal } from './Reveal';
import OrderPipeline from './OrderPipeline';

/**
 * 05 — Reliability and growth. `sections/05-reliability-and-growth.md`.
 *
 * Deep navy surface. Copy first, then the order pipeline — five real hub
 * screens from the order arriving to the cash being confirmed. The pipeline
 * replaced the WebGL globe on 2026-09-25
 * (`docs/Plans/landing page updates/06-earth-replacement.md`): the globe
 * needed three.js, d3-geo, a 788-line vendored renderer and a runtime JSON
 * fetch to assert nothing; the pipeline shows what "reliable" looks like on
 * a busy day and adds no JavaScript beyond one timer.
 *
 * There is not a single number in this section. The spec is unambiguous:
 * "Never invent uptime, order volume, or market coverage." Every frame is a
 * real screen, and the section still reads without the pipeline rendering
 * at all.
 */
const ReliabilityGrowth: React.FC = () => {
  const { b } = useBi();

  return (
    <Section id="reliability" surface="navy" labelledBy="reliability-heading">
      <SectionHead
        id="reliability-heading"
        eyebrow={{ ar: 'الثبات والنمو', en: 'Reliability & growth' }}
        heading={reliability.heading}
        support={reliability.support}
        onDark
      />

      <ul className="mt-9 max-w-2xl space-y-4">
        {reliability.points.map((point, i) => (
          <Reveal as="li" key={i} delay={140 + i * 90} className="flex gap-3.5">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-saffron" />
            <span className="prose-body-sm text-cream/80">{b(point)}</span>
          </Reveal>
        ))}
      </ul>

      <div className="mt-14 sm:mt-16">
        <Reveal as="h3" className="font-display text-xl/[1.3] sm:text-2xl/[1.3] font-bold text-cream">
          {b(reliability.pipeline.heading)}
        </Reveal>
        <div className="mt-7">
          <OrderPipeline />
        </div>
      </div>
    </Section>
  );
};

export default ReliabilityGrowth;
