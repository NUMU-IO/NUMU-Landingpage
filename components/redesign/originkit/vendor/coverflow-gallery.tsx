/**
 * OriginKit — Coverflow Gallery (Smooth 3D Slideshow).
 *
 * Retrieved through OriginKit MCP (`get_component coverflowgallery`, stack
 * vite / tailwind / typescript) on 2026-08-25. VENDOR SOURCE — kept as
 * delivered so it can be re-fetched and diffed. Numueg's configuration lives
 * in `../CoverflowGallery.tsx`.
 *
 * No npm dependencies.
 *
 * Local deltas, and only these:
 *   • `"use client"` removed — this is a Vite SPA, not Next.js.
 *   • The Unsplash/imagedelivery demo slides removed from `DEFAULT_SLIDES`.
 *     The wrapper always supplies real slides; an empty list renders nothing
 *     rather than someone else's stock photography.
 *   • `onActiveChange` added to the props, so the page around the gallery can
 *     tell which card is centred. The component owns that state; this only
 *     reports it.
 *   • `onControls` added, which hands the caller the component's own guarded
 *     `step` and a `goTo`. The component implements click and arrow keys but
 *     not touch, and it exposes no way to set `active` — so neither a swipe
 *     nor an external row of buttons could move it. Rather than fork the
 *     state, the wrapper borrows both setters.
 *   • `minSize` added, overriding the root's hardcoded `minWidth: 320,
 *     minHeight: 360`. Those are a canvas-era guard against the component
 *     being collapsed to nothing, and they are actively wrong when the caller
 *     sizes the stage itself: on a 390px phone the stage is ~217px tall, the
 *     minimum stretched the root to 360, and the component then centred its
 *     cards 70px below the stage centre — where the wrapper had positioned
 *     its overlay. The defaults are unchanged, so anyone not passing this
 *     gets the original behaviour.
 *   • Two type fixes so the file compiles under this repo's `tsc`:
 *     `React.KeyboardEvent` -> an imported `KeyboardEvent` (the source
 *     assumed a React UMD global), and `COMPONENT_DEFAULTS` annotated
 *     `Partial<Smooth3DSlideshowProps>` so `autoplayDirection` keeps its
 *     union type instead of widening to `string`.
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

const useIsStaticRenderer = () => false;

export interface Slide {
  image?: { src?: string; srcSet?: string; alt?: string };
  title?: string;
}

type AutoplayDir = 'leftToRight' | 'rightToLeft';
type TitleCorner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface Smooth3DSlideshowProps {
  slides?: Slide[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tilt?: number;
  sideTilt?: number;
  gap?: number;
  opacity?: number;
  transition?: any;
  autoplay?: boolean;
  autoplayDirection?: AutoplayDir;
  showTitle?: boolean;
  titleFont?: CSSProperties;
  titleColor?: string;
  titlePosition?: {
    position?: TitleCorner;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
  };
  /** Local addition — notified when the centred card changes. */
  onActiveChange?: (index: number) => void;
  /**
   * Local addition — hands the caller `step`, so an input the component does
   * not implement (a touch swipe) can move the gallery. Called once on mount.
   */
  onControls?: (controls: {
    step: (dir: number) => void;
    goTo: (index: number) => void;
  }) => void;
  /**
   * Local addition — overrides the root's hardcoded 320x360 minimum. See the
   * header note; the caller supplies an explicit stage size, and on a phone
   * the minimum silently made the root taller than that stage.
   */
  minSize?: { width: number; height: number };
  style?: CSSProperties;
}

// Local delta: demo slides removed. See the header note.
const DEFAULT_SLIDES: Slide[] = [];

// Fixed internals (no longer exposed as controls).
const PERSPECTIVE = 1600;
const SCALE_STEP = 0.16;
const MAX_VISIBLE = 2;
// In a preserve-3d context paint order follows 3D position, not z-index, so the
// centre is pushed nearest the viewer and neighbours fall back behind it.
const DEPTH = 240;

// Derive a CSS transition (duration + easing) from a Framer Transition value.
function cssTransition(t: any): { dur: number; ease: string } {
  const dur = t && typeof t.duration === 'number' ? t.duration : 0.6;
  let ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const e = t?.ease;
  if (Array.isArray(e) && e.length === 4) {
    ease = `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`;
  } else if (typeof e === 'string') {
    const map: Record<string, string> = {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    };
    ease = map[e] || 'ease';
  }
  return { dur, ease };
}

/**
 * Smooth 3D Slideshow
 *
 * A 3D coverflow: the active card sits upright in the spotlight while its
 * neighbours tilt back in perspective. Click any card to smoothly bring it to
 * centre. Recreated after Tanya Prokofieva's Framer original.
 */
export default function Smooth3DSlideshow(props: Smooth3DSlideshowProps) {
  props = { ...COMPONENT_DEFAULTS, ...props };
  const {
    slides = DEFAULT_SLIDES,
    cardWidth = 557,
    cardHeight = 420,
    radius = 0,
    tilt = 7,
    sideTilt = 7,
    gap = 7,
    opacity = 65,
    transition,
    autoplay = false,
    autoplayDirection = 'rightToLeft',
    showTitle = true,
    titleFont,
    titleColor = '#ffffff',
    titlePosition,
    onActiveChange,
    onControls,
    minSize,
    style,
  } = props;

  const tp = titlePosition || {};
  const corner: TitleCorner = tp.position || 'bottomLeft';
  const isTop = corner === 'topLeft' || corner === 'topRight';
  const isRight = corner === 'topRight' || corner === 'bottomRight';
  const padLeft = tp.paddingLeft ?? 22;
  const padRight = tp.paddingRight ?? 22;
  const padTop = tp.paddingTop ?? 24;
  const padBottom = tp.paddingBottom ?? 24;

  const isStatic = useIsStaticRenderer();
  const list = slides && slides.length ? slides : DEFAULT_SLIDES;
  const n = list.length;

  // Loop is always on.
  const loop = true;
  const [active, setActive] = useState(0);

  // Keep active valid if the slide list changes.
  useEffect(() => {
    setActive((a) => Math.max(0, Math.min(n - 1, a)));
  }, [n]);

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  // Lock input while a card is mid-move; release once it settles, so rapid
  // clicks/keys don't stack up and look jittery.
  const moveDur =
    transition && typeof transition.duration === 'number' ? transition.duration : 0.6;
  const lockRef = useRef(false);
  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(
      () => {
        lockRef.current = false;
      },
      Math.max(50, moveDur * 1000),
    );
  }, [moveDur]);

  const step = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      lock();
      setActive((a) => (((a + dir) % n) + n) % n);
    },
    [n, lock],
  );

  // LOCAL DELTA: publish the movement API upward. The component owns `active`
  // and exposes no way to set it, so a swipe — which it has no handler for —
  // and a set of external buttons had no way to move the gallery. Both borrow
  // the component's own guarded setters, so they inherit the in-flight lock
  // for free and cannot desynchronise `active` from what is drawn.
  const goTo = useCallback(
    (index: number) => {
      if (lockRef.current) return;
      lock();
      setActive(Math.max(0, Math.min(n - 1, index)));
    },
    [n, lock],
  );

  useEffect(() => {
    onControls?.({ step, goTo });
  }, [onControls, step, goTo]);

  const handleCardClick = useCallback(
    (i: number) => {
      if (isStatic || autoplay || lockRef.current) return;
      lock();
      setActive((a) => (i === a ? (a + 1) % n : i));
    },
    [isStatic, autoplay, n, lock],
  );

  // Autoplay — the transition's Delay drives the time each card holds.
  const delay = transition && typeof transition.delay === 'number' ? transition.delay : 2.5;
  useEffect(() => {
    if (isStatic || !autoplay || n < 2) return;
    const ms = Math.max(0.3, delay) * 1000;
    const dir = autoplayDirection === 'leftToRight' ? -1 : 1;
    const id = window.setInterval(() => step(dir), ms);
    return () => window.clearInterval(id);
  }, [isStatic, autoplay, autoplayDirection, delay, n, step]);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      }
    },
    [step],
  );

  const { dur, ease } = cssTransition(transition);
  const transitionCss = `transform ${dur}s ${ease}, opacity ${dur}s ${ease}`;

  // Rounded scale 0–20: boxy at 0, fully rounded at 20.
  const effectiveRadius =
    (Math.max(0, Math.min(20, radius)) / 20) * (Math.min(cardWidth, cardHeight) / 2);
  // Inactive opacity: 100% = fully visible, 0% = hidden. Overlay is the inverse.
  const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100;

  const rootStyle: CSSProperties = {
    ...(style || {}),
    position: 'relative',
    width: '100%',
    height: '100%',
    // LOCAL DELTA: was a hardcoded 320 x 360. See the header note.
    minWidth: minSize ? minSize.width : 320,
    minHeight: minSize ? minSize.height : 360,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: `${PERSPECTIVE}px`,
    overflow: 'hidden',
    outline: 'none',
  };

  if (n === 0) return null;

  return (
    <div
      style={rootStyle}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      onKeyDown={isStatic ? undefined : onKeyDown}
    >
      <div
        style={{
          position: 'relative',
          width: cardWidth,
          height: cardHeight,
          transformStyle: 'preserve-3d',
        }}
      >
        {list.map((slide, i) => {
          let rel = i - active;
          if (loop) {
            if (rel > n / 2) rel -= n;
            if (rel < -n / 2) rel += n;
          }
          const ax = Math.abs(rel);
          const visible = ax <= MAX_VISIBLE;
          const isActive = rel === 0;
          const sc = Math.max(0.4, 1 - ax * SCALE_STEP);
          const tx = rel * (gap * 30);
          const tz = -ax * DEPTH;
          const ry = -rel * tilt;
          const rz = rel * sideTilt;
          const src = slide.image?.src || '';

          const cardStyle: CSSProperties = {
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: cardWidth,
            height: cardHeight,
            borderRadius: effectiveRadius,
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
            transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
            transition: transitionCss,
            opacity: visible ? 1 : 0,
            cursor: autoplay || isActive ? 'default' : 'pointer',
            pointerEvents: visible && !isStatic && !autoplay ? 'auto' : 'none',
            backgroundColor: '#1a1a1a',
          };

          return (
            <div
              key={i}
              style={cardStyle}
              onClick={isStatic ? undefined : () => handleCardClick(i)}
              aria-label={slide.title}
              aria-hidden={!visible}
            >
              {src ? (
                <img
                  src={src}
                  alt={slide.image?.alt || slide.title || ''}
                  draggable={false}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    userSelect: 'none',
                  }}
                />
              ) : null}

              {showTitle && (
                <>
                  {/* Gradient for legibility (matches corner) */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: isTop
                        ? 'linear-gradient(0deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)'
                        : 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Title at chosen corner */}
                  <div
                    style={{
                      position: 'absolute',
                      left: padLeft,
                      right: padRight,
                      [isTop ? 'top' : 'bottom']: isTop ? padTop : padBottom,
                      textAlign: isRight ? 'right' : 'left',
                      pointerEvents: 'none',
                    }}
                  >
                    <span
                      style={{
                        color: titleColor,
                        fontSize: 28,
                        fontWeight: 700,
                        lineHeight: '1.1em',
                        letterSpacing: '-0.02em',
                        whiteSpace: 'pre-line',
                        textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                        ...(titleFont || {}),
                      }}
                    >
                      {slide.title}
                    </span>
                  </div>
                </>
              )}

              {/* Dim overlay (darkens inactive cards entirely) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#000000',
                  opacity: isActive ? 0 : dim,
                  transition: `opacity ${dur}s ${ease}`,
                  pointerEvents: 'none',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const COMPONENT_DEFAULTS: Partial<Smooth3DSlideshowProps> = {
  cardWidth: 400,
  cardHeight: 400,
  radius: 3,
  tilt: 12,
  sideTilt: 8,
  gap: 8,
  opacity: 60,
  autoplay: false,
  autoplayDirection: 'rightToLeft',
  transition: {
    type: 'tween',
    duration: 0.6,
    delay: 2.5,
    ease: [0.22, 1, 0.36, 1],
  },
  showTitle: true,
  titleColor: '#ffffff',
  titlePosition: {
    position: 'bottomLeft',
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 24,
    paddingBottom: 24,
  },
};
