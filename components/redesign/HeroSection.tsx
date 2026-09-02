import React, { useState, useRef, useEffect } from 'react';
import { hero } from './copy';
import { ASSETS } from './assets';
import { PrimaryCta, SecondaryCta, useBi } from './ui';
import { useMediaQuery, usePrefersReducedMotion } from './hooks';

/**
 * 01 — Hero. `sections/01-hero.md`.
 *
 * Full-bleed footage with the copy laid over it: the video fills the first
 * viewport and the headline, CTAs and reassurance sit on the start side —
 * the right in Arabic, mirrored automatically in English.
 *
 * Legibility over moving footage is handled by a two-stop scrim rather than
 * by dimming the whole clip: a strong wash on the start side where the type
 * sits, fading to nothing over the far side so the merchant, the parcels and
 * the workspace stay visible. That is also what keeps the spec's rule — never
 * put Arabic copy over the merchant's face — satisfiable at every width: the
 * subject is framed away from the copy side in both the wide and the square
 * cut.
 *
 * The hero paints without the video: the poster is up immediately and the
 * headline and primary CTA never wait on a network fetch. The clip then
 * starts as early as the browser allows — see the effect below for why that
 * used to take a couple of seconds longer than it should have.
 *
 * No OriginKit component belongs here — the hero's only motion is the video.
 */

type VideoState = 'idle' | 'playing' | 'failed';

const HeroSection: React.FC = () => {
  const { b } = useBi();
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [state, setState] = useState<VideoState>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Hold the video back until the first frame has been painted.
   *
   * The clip is the single biggest thing this page downloads — 939 KiB on
   * mobile, 1.68 MB on desktop, roughly half the page in both cases — and with
   * `preload="auto"` on an element present in the initial markup, the browser
   * starts pulling it while the stylesheet and the webfonts that gate First
   * Contentful Paint are still in flight. On a throttled mobile connection that
   * contention is most of the gap between a 0.3 s TTFB and a 4.6 s FCP.
   *
   * Mounting the <video> one frame after paint costs nothing visually: the
   * poster below is already on screen and stays there until the clip has
   * something to show. The video then loads with the whole connection to
   * itself instead of fighting the critical path for it.
   *
   * `requestIdleCallback` with a timeout rather than a bare rAF, so the fetch
   * also waits out the hydration burst; the timeout guarantees it starts on a
   * busy main thread. Reduced motion never arms it at all.
   */
  const [videoArmed, setVideoArmed] = useState(false);
  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    let idle: number | undefined;
    const raf = window.requestAnimationFrame(() => {
      const ric = (
        window as unknown as {
          requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
        }
      ).requestIdleCallback;
      idle =
        typeof ric === 'function'
          ? ric(() => setVideoArmed(true), { timeout: 1500 })
          : window.setTimeout(() => setVideoArmed(true), 400);
    });
    return () => {
      window.cancelAnimationFrame(raf);
      if (idle !== undefined) window.clearTimeout(idle);
    };
  }, [reduced]);

  const showVideo = !reduced && state !== 'failed' && videoArmed;

  /**
   * Start the clip as early as the browser will allow.
   *
   * This used to wait for `loadeddata` before calling `play()`, which added a
   * whole round trip to the start: `preload="metadata"` fetches the header,
   * the element goes idle, and only once enough frames had arrived did
   * anything ask it to play. Calling `play()` immediately is the documented
   * way to say "begin as soon as you can" — the browser fetches what it needs
   * and starts on its own, and the poster covers the gap either way.
   *
   * The `loadeddata` listener stays, but only as a retry for the case where
   * the first call is rejected because no data had arrived yet.
   */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !showVideo) return;

    let cancelled = false;
    const play = () => {
      if (cancelled) return;
      el.play().then(
        () => !cancelled && setState('playing'),
        () => {
          /* Autoplay refused (data saver, low-power mode): poster stays. */
        },
      );
    };

    play();
    el.addEventListener('loadeddata', play, { once: true });
    return () => {
      cancelled = true;
      el.removeEventListener('loadeddata', play);
    };
  }, [showVideo, isDesktop]);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[640px] h-[100svh] max-h-[900px] w-full overflow-hidden bg-navy-900"
    >
      {/* ── Footage ── */}
      <div className="absolute inset-0 -z-10">
        {/*
          The poster is a real <picture>, always in the markup, and it is what
          the visitor actually sees first.

          It used to be the <video>'s `poster` attribute with the cut chosen in
          JS (`isDesktop ? desktop : mobile`). That could not be right in the
          served HTML: `scripts/prerender.mjs` captures the DOM from a headless
          browser at ONE viewport, so one cut was baked in for everybody, and on
          the other form factor `useMediaQuery` flipped after mount, changed the
          element's `key`, and remounted it. Measured on a phone: BOTH posters
          were downloaded — the 66 KiB desktop one it could never show, then the
          34 KiB mobile one — and the swap was a visible blank frame on the
          largest element on screen.

          `<source media>` moves that decision to the browser, during HTML
          parse, before any script runs. One download, the right one, on both
          form factors, and nothing to repair after hydration.
        */}
        <picture>
          <source media="(min-width: 768px)" srcSet={ASSETS.heroPoster.src} />
          <img
            src={ASSETS.heroPosterMobile.src}
            alt={b(hero.videoAlt)}
            width={720}
            height={720}
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        {showVideo && (
          <video
            // Remount on breakpoint change so the browser picks up the other
            // cut instead of keeping the one it already committed to. Safe now
            // that the element only mounts after paint — the breakpoint is
            // already resolved, so in practice this never fires twice.
            key={isDesktop ? 'desktop' : 'mobile'}
            ref={videoRef}
            muted
            loop
            playsInline
            /* `auto`, not `metadata`. Once the element exists we want the clip
               as fast as possible — with `metadata` the browser fetched the
               header, stopped, and only began the media once something asked it
               to play, which read as a second or two of frozen poster. WHEN the
               element appears is now the lever instead: see `videoArmed`. */
            preload="auto"
            /* No `poster` attribute: the <picture> underneath IS the poster, at
               the right cut for the viewport. Setting one here would fetch a
               second copy — the mobile still on desktop — for a frame nobody
               sees, since this element is transparent until it plays. */
            /* The <picture> above carries the description of this footage;
               announcing it twice is noise. */
            aria-hidden="true"
            onError={() => setState('failed')}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: state === 'playing' ? 1 : 0 }}
          >
            {isDesktop && <source src={ASSETS.heroVideoWebm.src} type="video/webm" />}
            <source
              src={isDesktop ? ASSETS.heroVideo.src : ASSETS.heroVideoMobile.src}
              type="video/mp4"
            />
          </video>
        )}
      </div>

      {/* ── Scrim ──
          Three layers, tuned against the brightest frame of the clip (the
          white-walled desk shot) rather than the average one:

            1. an even wash, so a blown-out frame can never wash the type out;
            2. a directional wash that is heavy under the copy and clears
               over the far side, where the merchant and the parcels stay
               visible;
            3. a floor, which holds the reassurance line and anchors the
               rounded panel that lifts over the hero.

          Combined they keep cream (#FBF6ED) above 4.5:1 across the copy
          column on every frame — measured, not assumed. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(0,31,63,0.32)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_left,rgba(0,31,63,0.86)_0%,rgba(0,31,63,0.62)_38%,rgba(0,31,63,0.2)_70%,rgba(0,31,63,0)_100%)] rtl:bg-[linear-gradient(to_right,rgba(0,31,63,0.86)_0%,rgba(0,31,63,0.62)_38%,rgba(0,31,63,0.2)_70%,rgba(0,31,63,0)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 -z-10 bg-[linear-gradient(to_top,rgba(0,31,63,0.62)_0%,rgba(0,31,63,0.18)_55%,transparent_100%)]"
      />

      {/* ── Copy ── */}
      <div className="relative h-full max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex h-full items-end pb-20 sm:items-center sm:pb-0 sm:pt-20">
          <div className="max-w-2xl text-start">
            <h1
              id="hero-heading"
              className="font-display font-bold text-cream text-[34px]/[1.24] sm:text-[48px]/[1.18] lg:text-[62px]/[1.12]"
            >
              {b(hero.headline)}
            </h1>

            <p className="prose-body mt-5 sm:mt-6 max-w-xl text-cream/80">
              {b(hero.support)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryCta size="lg" onDark />
              <SecondaryCta size="lg" onDark />
            </div>

            <p className="mt-6 font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] text-cream/60">
              {b(hero.reassurance)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
