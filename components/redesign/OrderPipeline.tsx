import React, { useEffect, useRef, useState } from 'react';
import { reliability } from './copy';
import { AssetSlot, useBi } from './ui';
import { useInView, usePrefersReducedMotion } from './hooks';

/**
 * Order pipeline — the proof for section 05, in place of the WebGL globe
 * (removed 2026-09-25, `docs/Plans/landing page updates/06-earth-replacement.md`).
 *
 * Five real hub screens, one per step from the order arriving to the cash
 * being confirmed, captioned in Egyptian colloquial. Every frame is a real
 * screen, so the section makes no claim that needs approval — the globe's
 * orbits were designed to assert nothing; this asserts what the product does.
 *
 * Behaviour: the steps auto-advance every 4 s only while the block is in
 * view, the tab is visible and the visitor has not asked for reduced motion;
 * the first click or key press hands control to the visitor and the timer
 * stops. All five screens are in the DOM (inactive ones `hidden`), so the
 * prerendered HTML carries every caption and the first screen, and the frame
 * reserves its ratio so nothing shifts when a step changes. No animation
 * library: the progress hairline is one CSS width transition.
 */

const STEP_MS = 4000;

const arabicDigit = (n: number) => String.fromCharCode(0x0660 + n);

const OrderPipeline: React.FC = () => {
  const { b, isAr } = useBi();
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, '0px');
  const reduced = usePrefersReducedMotion();
  const steps = reliability.pipeline.steps;
  const autoplay = inView && !reduced && !manual;

  useEffect(() => {
    if (!autoplay) return;
    let id: number | undefined;
    const start = () => {
      window.clearInterval(id);
      id = window.setInterval(() => setActive((i) => (i + 1) % steps.length), STEP_MS);
    };
    const onVisibility = () => (document.hidden ? window.clearInterval(id) : start());
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [autoplay, steps.length]);

  const choose = (i: number) => {
    setManual(true);
    setActive(i);
  };

  return (
    <div ref={rootRef} className="grid gap-8 lg:grid-cols-[0.85fr_1.35fr] lg:gap-12 items-start">
      {/* Steps — first in DOM, so RTL puts them on the right. */}
      <ol className="space-y-1.5" aria-label={b(reliability.pipeline.heading)}>
        {steps.map((step, i) => {
          const current = active === i;
          return (
            <li key={step.key}>
              <button
                type="button"
                onClick={() => choose(i)}
                aria-current={current ? 'step' : undefined}
                className={`w-full text-start rounded-[4px] border px-4 py-3 transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                  focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900
                  ${current ? 'border-cream/30 bg-cream/[0.07]' : 'border-transparent hover:bg-cream/[0.04]'}`}
              >
                <span className="flex items-baseline gap-3">
                  <span
                    className={`font-mono text-[11px] tracking-[0.14em] ${current ? 'text-saffron' : 'text-cream/45'}`}
                    aria-hidden="true"
                  >
                    {isAr ? arabicDigit(i + 1) : String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-semibold ${current ? 'text-cream' : 'text-cream/70'}`}>{b(step.label)}</span>
                </span>
                {current && (
                  <span className="prose-body-sm mt-1.5 block text-cream/70" aria-live="polite">
                    {b(step.caption)}
                  </span>
                )}
                {/* Progress hairline — CSS only, restarted by the key. */}
                {current && autoplay && (
                  <span
                    key={`bar-${active}`}
                    aria-hidden="true"
                    className="mt-3 block h-px w-full bg-cream/10"
                  >
                    <span
                      className="block h-px bg-saffron"
                      style={{ width: '100%', animation: `numu-pipeline-bar ${STEP_MS}ms linear` }}
                    />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {/* The screens — one frame, every step present, only the active one shown. */}
      <div className="overflow-hidden rounded-[4px] border border-cream/15 bg-navy-900 numu-mockup-frame">
        {steps.map((step, i) => (
          <div key={step.key} hidden={active !== i}>
            <AssetSlot
              asset={step.asset}
              ratio={16 / 10}
              alt={step.alt}
              sizes="(min-width: 1024px) 640px, 100vw"
              lazy={i !== 0}
            />
          </div>
        ))}
      </div>

      <style>{`@keyframes numu-pipeline-bar{from{width:0}to{width:100%}}`}</style>
    </div>
  );
};

export default OrderPipeline;
