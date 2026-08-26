import React, { useRef, ReactNode, ElementType } from 'react';
import { useInView, usePrefersReducedMotion } from './hooks';

/**
 * Scroll reveal.
 *
 * The identity lock caps homepage motion at four large systems (hero video,
 * Dither Reveal, Globe, Interactive Grid) — this is deliberately not a fifth.
 * It is entrance polish: content settles into place as it enters the viewport
 * and then stays put. Nothing moves on a loop, nothing is discoverable only
 * by scrolling, and no information lives inside the animation.
 *
 * Three rules keep it safe:
 *
 *   • It latches. Once revealed, an element never re-hides, so scrolling back
 *     up never blanks content that was already read.
 *   • `prefers-reduced-motion` renders the final state immediately — no
 *     transform, no transition, no opacity ramp.
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
  const reduced = usePrefersReducedMotion();
  // Fires slightly before the element reaches the viewport, so the motion is
  // finishing as it arrives rather than starting once it is already on screen.
  const inView = useInView(ref, '-60px 0px -10% 0px');

  if (reduced) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const hidden = direction === 'up' ? 'opacity-0 translate-y-4' : 'opacity-0';

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-[650ms] ease-numu will-change-[opacity,transform]
        ${inView ? 'opacity-100 translate-y-0' : hidden} ${className}`}
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
