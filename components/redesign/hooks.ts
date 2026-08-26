import { useEffect, useState, useRef, RefObject } from 'react';

/**
 * Shared hooks for the redesigned homepage.
 *
 * All three are SSR/prerender-safe: `scripts/prerender.mjs` runs the app in
 * a headless browser, but these still guard `window`/`matchMedia` so the
 * bundle never throws if it is evaluated without a DOM.
 */

/**
 * Tracks a CSS media query.
 *
 * The first value is read synchronously, during the initial render, rather
 * than being seeded `false` and corrected in an effect. That correction was
 * an expensive lie: every consumer rendered its narrow-screen branch first
 * and its real branch one commit later. In the hero that meant a desktop
 * visitor started downloading `hero-video-mobile.mp4`, then had the element
 * remounted under them and downloaded `hero-video.mp4` from scratch — two
 * fetches, and a visibly late start. It also caused a frame of the wrong
 * layout in the gallery and the globe.
 *
 * `false` is still the answer when there is no DOM, so prerender is safe.
 */
export function useMediaQuery(query: string): boolean {
  const read = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  };
  const [matches, setMatches] = useState(read);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    // Re-read on mount: the query may have changed, or the first render may
    // have happened without a DOM.
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * `true` when the visitor has asked for reduced motion.
 *
 * Every animated surface on the page (hero video, Globe, Dither Reveal,
 * Interactive Grid) must fall back to a static state when this is true —
 * see `animations/originkit-placement.md` § "Global requirements".
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** `true` once the element has scrolled into view. Latches — never flips back. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = '200px',
): boolean {
  const [inView, setInView] = useState(false);
  const latched = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || latched.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      // No observer (very old browser / prerender): show everything.
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          latched.current = true;
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
