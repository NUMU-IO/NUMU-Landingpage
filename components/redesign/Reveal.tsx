import React, { useRef, useState, useEffect, ReactNode, ElementType } from 'react';

/**
 * Scroll reveal.
 *
 * The identity lock caps homepage motion at three large systems (hero video,
 * Dither Reveal, Interactive Grid) — this is deliberately not a fourth.
 * It is entrance polish: content settles into place as it enters the viewport
 * and then stays put. Nothing moves on a loop, nothing is discoverable only
 * by scrolling, and no information lives inside the animation.
 *
 * Four rules keep it safe:
 *
 *   • Content is visible by default. Only an element that is still below the
 *     fold when it mounts is tucked away to animate in. The prerendered HTML
 *     and React's first render therefore both show the content: a visitor on a
 *     slow connection used to scroll through sections with no headings in them,
 *     because every reveal was baked into the page at `opacity: 0` and stayed
 *     that way until the scripts had loaded.
 *   • It latches. Once revealed, an element never re-hides, so scrolling back
 *     up never blanks content that was already read.
 *   • `prefers-reduced-motion` keeps the final state — no transform, no
 *     transition, no opacity ramp.
 *   • The element is never `visibility: hidden` or `display: none`, so text
 *     stays in the accessibility tree and in the page for crawlers even
 *     before it animates.
 */

type Direction = 'up' | 'none';

interface RevealProps {
  children: ReactNode;
  /** Element to render. Defaults to `div`. */
  as?: ElementType;
  /** Delay in ms, for staggering siblings. */
  delay?: number;
  /** `up` lifts into place; `none` fades only. */
  direction?: Direction;
  className?: string;
  /**
   * Anything else is forwarded to the rendered element — `id` in particular,
   * since section headings are referenced by `aria-labelledby`.
   */
  [key: string]: unknown;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  as: Tag = 'div',
  delay = 0,
  direction = 'up',
  className = '',
  ...rest
}) => {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<'shown' | 'waiting' | 'revealed'>('shown');

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      // `scripts/prerender.mjs` sets this: the captured HTML keeps everything visible.
      (window as { __PRERENDER__?: boolean }).__PRERENDER__ ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    // The observer reports where the element is without forcing a layout, and
    // without waking a section the browser is still skipping (see
    // `.numu-below-fold` in index.css).
    let waiting = false;
    // The margins make it fire a little after the element enters the viewport,
    // so the motion plays where it can be seen.
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Seen without ever having been hidden: there is nothing to animate.
          if (waiting) setPhase('revealed');
          obs.disconnect();
          return;
        }
        if (waiting) return;
        const { top, width, height } = entry.boundingClientRect;
        // Below the fold, or not rendered yet: tuck it away until it scrolls
        // in. Anything already on screen, or scrolled past, is left alone.
        if (top >= window.innerHeight || (width === 0 && height === 0)) {
          waiting = true;
          setPhase('waiting');
        } else {
          obs.disconnect();
        }
      },
      { rootMargin: '-60px 0px -10% 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const phaseCls =
    phase === 'waiting'
      ? direction === 'up'
        ? 'opacity-0 translate-y-4'
        : 'opacity-0'
      : phase === 'revealed'
        ? 'transition-[opacity,transform] duration-[650ms] ease-numu'
        : '';

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      style={phase === 'revealed' && delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${phaseCls} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

/**
 * Reveals a list of children in sequence.
 *
 * The stagger is capped: past the cap every remaining item shares the last
 * delay, so a long grid never leaves the reader waiting on a staircase.
 */
export const RevealGroup: React.FC<{
  children: ReactNode;
  as?: ElementType;
  /** Milliseconds between siblings. */
  step?: number;
  /** Maximum number of steps before the delay stops growing. */
  maxSteps?: number;
  baseDelay?: number;
  className?: string;
  itemClassName?: string;
  itemAs?: ElementType;
}> = ({
  children,
  as: Tag = 'div',
  step = 70,
  maxSteps = 6,
  baseDelay = 0,
  className = '',
  itemClassName = '',
  itemAs = 'div',
}) => (
  <Tag className={className}>
    {React.Children.map(children, (child, i) => (
      <Reveal as={itemAs} delay={baseDelay + Math.min(i, maxSteps) * step} className={itemClassName}>
        {child}
      </Reveal>
    ))}
  </Tag>
);
