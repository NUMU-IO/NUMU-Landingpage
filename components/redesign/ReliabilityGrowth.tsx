import React, { useRef } from 'react';
import { reliability } from './copy';
import { Section, SectionHead, useBi } from './ui';
import { useInView } from './hooks';
import { Reveal } from './Reveal';
import EarthGlobe from './originkit/EarthGlobe';

/**
 * 05 — Reliability and growth. `sections/05-reliability-and-growth.md`.
 *
 * Deep navy surface, Globe as the section's only large animation, copy on the
 * start side (right in Arabic) with the Globe opposite it.
 *
 * There is not a single number in this section. The spec is unambiguous:
 * "Never invent uptime, order volume, or market coverage." Until the product
 * owner approves verified figures, the qualitative copy stands alone — and
 * the section still reads without the Globe rendering at all.
 */
const ReliabilityGrowth: React.FC = () => {
  const { b } = useBi();
  const ref = useRef<HTMLDivElement>(null);
  // The Globe animates continuously, so it is only mounted once the section
  // is near the viewport — it never competes with the hero for main-thread
  // time or delays the first CTA.
  const inView = useInView(ref, '300px');

  return (
    <Section id="reliability" surface="navy" labelledBy="reliability-heading">
      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        {/* Copy — first in DOM, so RTL puts it on the right. */}
        <div>
          <SectionHead
            id="reliability-heading"
            eyebrow={{ ar: 'الثبات والنمو', en: 'Reliability & growth' }}
            heading={reliability.heading}
            support={reliability.support}
            onDark
          />

          <ul className="mt-9 space-y-4">
            {reliability.points.map((point, i) => (
              <Reveal as="li" key={i} delay={140 + i * 90} className="flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-saffron"
                />
                <span className="prose-body-sm text-cream/80">{b(point)}</span>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Globe */}
        {/* Oversized and bled toward the outer edge — `-me` is the end side,
            so it runs off the left in Arabic and the right in English, away
            from the copy either way rather than under it. */}
        <div
          ref={ref}
          className="relative mx-auto w-full max-w-[400px] lg:max-w-none lg:w-[118%] lg:-me-[24%]"
        >
          {inView ? (
            <EarthGlobe label={b(reliability.globeAlt)} />
          ) : (
            // Reserve the box so nothing shifts when the Globe mounts.
            <div className="w-full aspect-square" aria-hidden="true" />
          )}
        </div>
      </div>
    </Section>
  );
};

export default ReliabilityGrowth;
