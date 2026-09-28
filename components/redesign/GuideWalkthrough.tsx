import React, { useEffect, useRef, useState } from 'react';
import type { Bi } from './copy';
import { useBi } from './ui';
import { useInView, usePrefersReducedMotion } from './hooks';
import { toArabicDigits } from '../../lib/trialInfo';
import IMAGE_VARIANTS from './image-variants.json';

/**
 * Academy walkthrough (owner request 2026-09-27): real dashboard frames, one
 * per step, with a cursor that travels to the control the merchant presses
 * and a ring that pulses on it. Steps advance on their own while the figure is
 * on screen; hovering, pressing a step or the pause button stops that. Under
 * `prefers-reduced-motion` nothing moves by itself and the cursor jumps.
 *
 * Frames are 1600×1000 captures of the local sandbox hub (test data, names
 * masked), made with `learn-capture.mjs`; `gen-image-variants` writes the
 * smaller rungs. Data: `pages/learn/walkthroughs.ts`.
 */

export interface WalkStep {
  /** A 1600×1000 frame in `public/assets/`. */
  src: string;
  /** The control to press, as percentages of the frame. */
  spot: { x: number; y: number; w: number; h: number };
  caption: Bi;
}

const STEP_MS = 4200;

const srcSetFor = (src: string) =>
  (IMAGE_VARIANTS as Record<string, { w: number; src: string }[]>)[src]
    ?.map((r) => `${r.src} ${r.w}w`)
    .join(', ');

/*
 * The cursor and the ring sit in IMAGE space: `left` / `top` are physical on
 * purpose, because the percentages were measured on the screenshot, which does
 * not mirror with the page direction.
 */
const Spot: React.FC<{ spot: WalkStep['spot']; stepKey: number }> = ({ spot, stepKey }) => (
  <>
    <span
      key={`ring-${stepKey}`}
      aria-hidden="true"
      className="numu-walk-ring pointer-events-none absolute rounded-[8px] border-2 border-saffron"
      style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.w}%`, height: `${spot.h}%` }}
    />
    <span
      aria-hidden="true"
      className="numu-walk-cursor pointer-events-none absolute"
      style={{ left: `${spot.x + spot.w / 2}%`, top: `${spot.y + spot.h / 2}%` }}
    >
      <svg key={`press-${stepKey}`} className="numu-walk-press block" width="26" height="26" viewBox="0 0 24 24">
        <path
          d="M4 2.5 20 11l-7 1.8L10 20 4 2.5Z"
          fill="#001F3F"
          stroke="#FBF6ED"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  </>
);

const GuideWalkthrough: React.FC<{
  steps: WalkStep[];
  /** What this walkthrough shows, for the figure's accessible name. */
  label: Bi;
  sizes?: string;
  className?: string;
}> = ({ steps, label, sizes = '(min-width: 880px) 780px, 100vw', className = '' }) => {
  const { b, isAr } = useBi();
  const reduced = usePrefersReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const auto = playing && !reduced && seen && !hovered;

  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => setActive((i) => (i + 1) % steps.length), STEP_MS);
    return () => window.clearInterval(t);
  }, [auto, steps.length]);

  const num = (n: number) => (isAr ? toArabicDigits(String(n)) : String(n));
  const pick = (i: number) => {
    setActive(i);
    setPlaying(false);
  };

  return (
    <figure className={className} aria-label={b(label)}>
      <div
        ref={box}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="overflow-hidden rounded-[14px] border border-ink/12 bg-paper numu-mockup-frame"
      >
        <div className="flex items-center gap-3 border-b border-ink/10 bg-cream px-3.5 py-2">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-ink/15" />
            <span className="size-2.5 rounded-full bg-ink/15" />
            <span className="size-2.5 rounded-full bg-ink/15" />
          </span>
          <span className="flex-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft/80">
            {isAr
              ? `الخطوة ${num(active + 1)} من ${num(steps.length)}`
              : `Step ${active + 1} of ${steps.length}`}
          </span>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="min-h-8 rounded-full px-3 text-[12px] font-semibold text-navy hover:bg-navy/[0.06]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            >
              {playing ? b({ ar: 'إيقاف', en: 'Pause' }) : b({ ar: 'تشغيل', en: 'Play' })}
            </button>
          )}
        </div>

        <div className="relative aspect-[16/10] bg-cream">
          {steps.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              srcSet={srcSetFor(s.src)}
              sizes={sizes}
              alt={i === active ? b(s.caption) : ''}
              aria-hidden={i === active ? undefined : true}
              loading="lazy"
              decoding="async"
              width={1600}
              height={1000}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                i === active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <Spot spot={steps[active].spot} stepKey={active} />
        </div>
      </div>

      <figcaption>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.src}>
              <button
                type="button"
                onClick={() => pick(i)}
                aria-current={i === active ? 'step' : undefined}
                className={`flex w-full items-start gap-3 rounded-[10px] border px-3.5 py-3 text-start text-[14.5px]/[1.6] transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                    i === active
                      ? 'border-navy bg-navy text-cream'
                      : 'border-ink/10 bg-paper text-ink hover:border-navy/40'
                  }`}
              >
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-full font-mono text-[12px] font-bold ${
                    i === active ? 'bg-saffron text-navy-900' : 'bg-navy/[0.08] text-navy'
                  }`}
                >
                  {num(i + 1)}
                </span>
                <span className="font-semibold">{b(s.caption)}</span>
              </button>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
};

/** A still of a walkthrough's first frame, ring on the first control — for list cards. */
export const WalkThumb: React.FC<{ step: WalkStep }> = ({ step }) => (
  <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-[8px] border border-ink/10 bg-cream">
    <img
      src={step.src}
      srcSet={srcSetFor(step.src)}
      sizes="220px"
      alt=""
      loading="lazy"
      decoding="async"
      width={1600}
      height={1000}
      className="absolute inset-0 h-full w-full object-cover"
    />
    <span
      aria-hidden="true"
      className="numu-walk-ring pointer-events-none absolute rounded-[4px] border-2 border-saffron"
      style={{ left: `${step.spot.x}%`, top: `${step.spot.y}%`, width: `${step.spot.w}%`, height: `${step.spot.h}%` }}
    />
  </span>
);

export default GuideWalkthrough;
