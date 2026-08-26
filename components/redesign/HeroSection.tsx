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

  const poster = isDesktop ? ASSETS.heroPoster.src : ASSETS.heroPosterMobile.src;
  const showVideo = !reduced && state !== 'failed';

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
        {showVideo ? (
          <video
            // Remount on breakpoint change so the browser picks up the other
            // cut instead of keeping the one it already committed to.
            key={isDesktop ? 'desktop' : 'mobile'}
            ref={videoRef}
            muted
            loop
            playsInline
            /* `auto`, not `metadata`. The hero clip IS the hero — with
               `metadata` the browser fetched the header, stopped, and only
               began the media once something asked it to play, which read as
               a second or two of frozen poster on every load. LCP is the
               headline (text), not this element, so the extra early bytes do
               not move it. */
            preload="auto"
            poster={poster}
            aria-label={b(hero.videoAlt)}
            onError={() => setState('failed')}
            className="w-full h-full object-cover"
          >
            {isDesktop && <source src={ASSETS.heroVideoWebm.src} type="video/webm" />}
            <source
              src={isDesktop ? ASSETS.heroVideo.src : ASSETS.heroVideoMobile.src}
              type="video/mp4"
            />
          </video>
        ) : (
          // Reduced motion, or the video failed: the poster carries the hero.
          <img
            src={poster}
            alt={b(hero.videoAlt)}
            width={isDesktop ? 1600 : 720}
            height={isDesktop ? 900 : 720}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
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
