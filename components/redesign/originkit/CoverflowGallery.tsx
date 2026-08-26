import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Smooth3DSlideshow, { type Slide } from './vendor/coverflow-gallery';
import { usePrefersReducedMotion } from '../hooks';
import { useBi } from '../ui';
import type { Bi } from '../copy';

/**
 * Numueg's configuration of OriginKit's Coverflow Gallery.
 *
 * The vendored component under `vendor/coverflow-gallery.tsx` is used exactly
 * as the MCP delivered it; everything specific to this site lives here.
 *
 * ─── The one thing the component does not do ──────────────────────────────
 * It has no href API. Its cards only re-centre on click. Since every card
 * here has to reach a real route, links are added around it rather than by
 * editing it:
 *
 *   • The centred card is covered by a real <Link>. For `rel === 0` the
 *     component applies no rotation and no scale, so the centred card's box
 *     on screen is exactly `cardWidth x cardHeight` at the centre — the
 *     overlay lines up with it precisely and covers nothing else. Clicking
 *     the centre navigates; clicking a neighbour still falls through to the
 *     component and re-centres it.
 *   • Selecting a card and opening it are separate acts. The row of buttons
 *     under the stage changes which card is shown; the "open" button on the
 *     card is the only thing that navigates. Nobody lands on a page they were
 *     only browsing toward, and the whole set can be looked through without
 *     leaving.
 *   • The card itself is therefore inert — clicks fall through to the
 *     component, which is what still lets a tap on a neighbour centre it.
 *
 * Every destination is a real link in the site footer, which is in the
 * prerendered HTML of every page, so nothing here is the only route to a
 * page and no route depends on JavaScript.
 *
 * ─── One gallery, two sizes ───────────────────────────────────────────────
 * The coverflow now runs at every width. It previously fell back to a plain
 * scroller on phones because its cards are positioned in absolute pixels
 * around a fixed centre, and at desktop spacing the neighbours landed off a
 * 390px screen. That was a sizing problem, not a limitation: `stageMetrics`
 * scales the card and the neighbour offset to the stage, so the same 3D stack
 * reads correctly on a phone.
 *
 * Two things had to be added for touch, since the component implements
 * neither: a swipe gesture (see `onTouchEnd`) and an always-visible "open"
 * affordance, because hover cannot happen on a touch screen.
 *
 * `prefers-reduced-motion` still drops to a static grid of links — same art,
 * same destinations, no transforms and no transitions.
 *
 * ─── RTL ──────────────────────────────────────────────────────────────────
 * The component's own title block is corner-anchored and is drawn on every
 * card, which put the neighbours' names across the centred one. It is off;
 * the label is drawn once on the overlay instead, where it inherits the
 * page's direction and type like any other text on the site.
 */

export interface CoverflowItem {
  to: string;
  label: Bi;
  desc: Bi;
  /** Card art — a screenshot of the route this card links to. */
  image: string;
  alt: Bi;
}

interface Props {
  items: CoverflowItem[];
  className?: string;
}

/**
 * Card box and neighbour spacing for a given stage width.
 *
 * The component positions its cards in absolute pixels around a fixed centre,
 * so both numbers have to come from the stage rather than from CSS. `gap` is
 * the component's own unit: it offsets each neighbour by `gap * 30` pixels.
 *
 * On a phone the card takes most of the width and the neighbours sit close in,
 * so they read as cards stacked behind this one. Using the desktop spacing
 * there pushed them clean off a 390px screen and left a single card with two
 * slivers — which is why this used to fall back to a plain scroller.
 */
function stageMetrics(containerWidth: number) {
  const phone = containerWidth < 640;
  const frac = phone ? 0.74 : 0.44;
  const w = Math.round(Math.max(220, Math.min(480, containerWidth * frac)));
  const h = Math.round((w * 2) / 3);
  // Keep the neighbour's inner edge just outside the centre card.
  const gap = phone ? Math.max(3, (w * 0.62) / 30) : 10;
  return { w, h, gap, phone };
}

/** One card, as the reduced-motion grid draws it. */
const CardLink: React.FC<{ item: CoverflowItem; b: (v: Bi) => string }> = ({ item, b }) => (
  <Link
    to={item.to}
    className="group block h-full overflow-hidden rounded-[12px] border border-ink/12 bg-cream
      transition-shadow hover:shadow-card focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
  >
    <img
      src={item.image}
      alt={b(item.alt)}
      width={960}
      height={640}
      loading="lazy"
      decoding="async"
      className="block aspect-[3/2] w-full object-cover object-top"
    />
    <span className="flex items-center justify-between gap-3 border-t border-ink/10 px-4 py-3">
      <span className="min-w-0">
        <span className="block truncate font-display text-[15px] font-bold text-ink">
          {b(item.label)}
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-ink-soft/70">{b(item.desc)}</span>
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 text-navy/50 rtl:rotate-180 transition-transform
          group-hover:translate-x-0.5"
      >
        →
      </span>
    </span>
  </Link>
);

const CoverflowGallery: React.FC<Props> = ({ items, className = '' }) => {
  const { b } = useBi();
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const stageId = useId();
  const [box, setBox] = useState(() => stageMetrics(960));
  const [active, setActive] = useState(0);

  /**
   * Cards are sized in pixels by the component, so the stage measures itself.
   *
   * `useLayoutEffect`, not `useEffect`: the first render has to guess a width,
   * and correcting that guess in a passive effect means the browser paints the
   * guessed size and then reflows — a visible jump, and 0.03 of CLS on desktop
   * where the guess is furthest off. A layout effect runs before paint, so the
   * corrected size is the first one drawn.
   */
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = (w: number) => {
      if (w > 0) setBox(stageMetrics(w));
    };
    measure(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => measure(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduced]);

  // Stable — the component keeps this in an effect dependency list.
  const onActiveChange = useCallback((i: number) => setActive(i), []);

  /**
   * Touch swipe.
   *
   * The component handles clicks and arrow keys but has no touch input, so on
   * a phone the gallery could only be moved by tapping a neighbour — which is
   * not what anyone tries first. `step` comes from the component itself (see
   * `onControls` in the vendor), so a swipe reuses its in-flight lock and
   * cannot desynchronise the centred card from what is drawn.
   *
   * Vertical drags are ignored, so swiping the gallery never steals a page
   * scroll: the gesture only counts once it is clearly horizontal.
   */
  type Controls = { step: (dir: number) => void; goTo: (index: number) => void };
  const controls = useRef<Controls | null>(null);
  const onControls = useCallback((c: Controls) => {
    controls.current = c;
  }, []);

  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const startPoint = touch.current;
      touch.current = null;
      if (!startPoint) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startPoint.x;
      const dy = t.clientY - startPoint.y;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      // Dragging right should bring the card on the right toward the centre,
      // which is `step(-1)` in both directions — the component's index order
      // is visual, not logical, so this does not flip for RTL.
      controls.current?.step(dx > 0 ? -1 : 1);
    },
    [],
  );

  const current = items[active] ?? items[0];

  /* ── Static fallback: same art, same links, no motion ── */
  if (reduced) {
    return (
      <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {items.map((item) => (
          <li key={item.to}>
            <CardLink item={item} b={b} />
          </li>
        ))}
      </ul>
    );
  }

  // The art is decorative here: the overlay link below names the destination,
  // as does the row of links under the stage. Describing each image as well
  // would make a screen reader read every destination twice.
  //
  // `showTitle` is off. The component draws a title on *every* card, so the
  // neighbours' titles ended up printed across the centred one. The label is
  // drawn once, on the centre, in the page's own type instead.
  const slides: Slide[] = items.map((item) => ({
    image: { src: item.image, alt: '' },
  }));

  return (
    <div className={className}>
      <div
        ref={stageRef}
        id={stageId}
        className="relative w-full touch-pan-y"
        style={{ height: box.h + (box.phone ? 44 : 72) }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Smooth3DSlideshow
          slides={slides}
          cardWidth={box.w}
          cardHeight={box.h}
          radius={1.6}
          /* Flatter and closer on a phone: at desktop angles the neighbours
             turn so far edge-on that they read as slivers of noise rather
             than as cards waiting behind this one. */
          tilt={box.phone ? 9 : 14}
          sideTilt={box.phone ? 2.5 : 4}
          gap={box.gap}
          opacity={box.phone ? 44 : 52}
          showTitle={false}
          transition={{ type: 'tween', duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onActiveChange={onActiveChange}
          onControls={onControls}
          /* The stage is sized explicitly right above, so the component's own
             320x360 floor can only fight it — and on a phone it wins, which
             is what pushed the cards below the overlay. */
          minSize={{ width: 0, height: 0 }}
        />

        {/* The centred card's furniture. Sized to the component's own geometry
            for `rel === 0`: no rotation, no scale, dead centre.

            This is NOT a link. Selecting a card and opening it are separate
            acts here — the row of buttons below changes which card is shown,
            and only the "open" button on the card navigates. So the plate is
            inert (`pointer-events-none`) and clicks pass straight through to
            the component underneath, which is what still lets a tap on a
            neighbour bring it to the centre. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2
            -translate-y-1/2 overflow-hidden rounded-[16px]
            shadow-[0_36px_70px_-28px_rgba(0,31,63,0.5)] ring-1 ring-inset ring-ink/10"
          style={{ width: box.w, height: box.h }}
        >
          {/* On a phone the card is small enough that the label sits directly
              over whatever the screenshot happens to show — a bright product
              thumbnail, in the themes case. A long gradient is still
              translucent where the text actually is, so the phone plate is a
              near-solid band with a short fade above it instead. */}
          <span
            className={`absolute inset-x-0 bottom-0 block ${
              box.phone
                ? 'bg-[linear-gradient(to_top,rgba(0,31,63,0.97)_0%,rgba(0,31,63,0.95)_62%,rgba(0,31,63,0)_100%)] h-[52%]'
                : 'bg-[linear-gradient(to_top,rgba(0,31,63,0.95)_0%,rgba(0,31,63,0.88)_46%,rgba(0,31,63,0.26)_80%,rgba(0,31,63,0)_100%)] h-[40%]'
            }`}
          />
        </div>

        {/* Label and the one control that navigates.
            Positioned over the centred card but outside the inert plate, so
            the link is the only thing in this region that takes a click. */}
        <div
          className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2
            flex-col justify-end pointer-events-none"
          style={{ width: box.w, height: box.h }}
        >
          <div className={`flex items-end justify-between gap-3 ${box.phone ? 'px-4 pb-3' : 'px-5 pb-4'}`}>
            <div className="min-w-0">
              <p
                className={`truncate font-display font-bold text-cream ${
                  box.phone ? 'text-[16px]/[1.3]' : 'text-[19px]/[1.3]'
                }`}
              >
                {b(current.label)}
              </p>
              <p
                className={`mt-0.5 truncate text-cream/70 ${
                  box.phone ? 'text-[12px]' : 'text-[13px]'
                }`}
              >
                {b(current.desc)}
              </p>
            </div>

            {/* The only route out of the gallery. Always visible, because it
                is now the primary action rather than a hover flourish — and
                hover cannot happen on a touch screen anyway. */}
            <Link
              to={current.to}
              aria-label={`${b({ ar: 'افتح', en: 'Open' })} ${b(current.label)} — ${b(current.desc)}`}
              className={`pointer-events-auto mb-0.5 inline-flex shrink-0 items-center gap-1.5
                rounded-full bg-cream font-semibold text-navy shadow-card transition-transform
                hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-saffron focus-visible:ring-offset-2
                focus-visible:ring-offset-navy-900 ${
                  box.phone ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2 text-[13px]'
                }`}
            >
              {b({ ar: 'افتح', en: 'Open' })}
              <span aria-hidden="true" className="rtl:rotate-180">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Card picker.
          These change which card is shown; they do not navigate. Opening is a
          separate, deliberate act on the "open" button on the card itself, so
          a visitor can look through all five without ever leaving the page.

          They are therefore buttons, not links, and they say so: `aria-pressed`
          marks the selected one, and `aria-controls` ties them to the stage.
          The destinations are still crawlable and still reachable without
          JavaScript — every one of them is a real link in the site footer,
          which is in the prerendered HTML of every page. */}
      <div
        role="group"
        aria-label={b({ ar: 'اختار صفحة', en: 'Choose a page' })}
        className="mt-2 flex flex-wrap justify-center gap-x-1 gap-y-1"
      >
        {items.map((item, i) => (
          <button
            key={item.to}
            type="button"
            aria-pressed={i === active}
            aria-controls={stageId}
            onClick={() => controls.current?.goTo(i)}
            className={`inline-flex min-h-6 items-center rounded-full px-3.5 py-1.5 text-[13px]
              font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper
              ${
                i === active
                  ? 'bg-navy text-cream'
                  : 'text-ink-soft/75 hover:bg-navy/[0.07] hover:text-ink'
              }`}
          >
            {b(item.label)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CoverflowGallery;
