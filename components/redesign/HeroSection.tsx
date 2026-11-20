import React, { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';
import { hero } from './copy';
import { ASSETS } from './assets';
import { PrimaryCta, SecondaryCta, useBi } from './ui';
import { useMediaQuery, usePrefersReducedMotion } from './hooks';

/**
 * 01 — Hero. `sections/01-hero.md`.
 *
 * Copy on the start side, numu's own 48-second motion film beside it in its
 * own frame — the 16:9 cut from 768 px up, the 9:16 cut below. Masters:
 * `docs/Plans/landing page updates/motion video i want to use it/`.
 *
 * The film is shown as it was made, with nothing over it (owner, 2026-11-20).
 * It used to fill the whole hero behind the headline, and because it carries
 * titles of its own it had to sit under a navy scrim heavy enough to keep the
 * headline readable — which washed the film out. Side by side, neither one
 * has to give way to the other.
 *
 * A small button pauses and resumes it — a 48-second moving image needs one
 * (WCAG 2.2.2). Under `prefers-reduced-motion`, Save-Data or a 2G-class
 * connection it does not start by itself and loads nothing until played.
 *
 * The hero paints without the film: the poster is up immediately and the
 * headline and primary CTA never wait on a network fetch.
 */

type Connection = { saveData?: boolean; effectiveType?: string };

const HeroSection: React.FC = () => {
  const { b } = useBi();
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  // Off screen the film is only decoding frames nobody sees, on the same
  // thread the rest of the page scrolls on.
  const [onScreen, setOnScreen] = useState(true);

  // Reduced motion, Save-Data or a very slow link: nothing plays or loads
  // until the visitor asks.
  const connection =
    typeof navigator !== 'undefined'
      ? (navigator as Navigator & { connection?: Connection }).connection
      : undefined;
  const quiet = reduced || !!connection?.saveData || /2g/.test(connection?.effectiveType ?? '');

  /**
   * Hold the <video> back until the page has loaded: the film is the biggest
   * thing on the page (about 2.4 MB desktop, 2.2 MB mobile) and must not
   * compete with what gates first paint and LCP. `scripts/prerender.mjs`
   * removes it from the captured HTML in case arming beats the capture.
   */
  const [videoArmed, setVideoArmed] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // After `load`, then a beat: the headline re-paints at about 1 s (font
    // swap), and a film request that starts before that paint is counted
    // against LCP by Lighthouse's simulation. The poster covers the wait.
    let timer: number | undefined;
    const arm = () => {
      timer = window.setTimeout(() => setVideoArmed(true), 1200);
    };
    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });
    return () => {
      window.removeEventListener('load', arm);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (quiet) setPaused(true);
  }, [quiet]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const showVideo = !failed && videoArmed;

  // Play as early as the browser allows; the `loadeddata` retry covers a
  // first call rejected because no data had arrived yet.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !showVideo) return;
    if (paused || !onScreen) {
      el.pause();
      return;
    }
    let cancelled = false;
    const play = () => {
      if (cancelled) return;
      el.play().catch(() => {
        /* Autoplay refused (low-power mode): show the play button. */
        if (!cancelled) setPaused(true);
      });
    };
    play();
    el.addEventListener('loadeddata', play, { once: true });
    return () => {
      cancelled = true;
      el.removeEventListener('loadeddata', play);
    };
  }, [showVideo, isDesktop, paused, onScreen]);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate w-full overflow-hidden bg-navy-900 numu-navy-surface numu-soft-navy
        pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28"
    >
      <div
        className="relative z-10 mx-auto grid max-w-[1560px] items-center gap-10 px-5 sm:px-8 lg:gap-12 lg:px-10
          lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] xl:gap-16"
      >
        {/* ── Copy ── */}
        <div className="text-start">
          <h1
            id="hero-heading"
            className="font-display font-bold text-cream text-[34px]/[1.24] sm:text-[44px]/[1.2] xl:text-[54px]/[1.15]"
          >
            {b(hero.headline)}
          </h1>

          <p className="prose-body mt-5 sm:mt-6 max-w-xl text-cream/85">{b(hero.support)}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryCta size="lg" onDark />
            <SecondaryCta size="lg" onDark />
          </div>

          <p className="mt-6 text-[13px]/[1.7] text-cream/70">{b(hero.reassurance)}</p>
        </div>

        {/* ── Film ── */}
        <div className="mx-auto w-full max-w-[340px] md:max-w-none">
          <div
            ref={frameRef}
            className="relative aspect-[9/16] overflow-hidden rounded-[14px] bg-navy
              shadow-[0_0_0_1px_rgba(245,239,230,0.14),0_30px_60px_-28px_rgba(0,0,0,0.65)]
              md:aspect-video"
          >
            {/*
              The poster is a real <picture>, always in the markup: `<source
              media>` picks the cut during HTML parse, so each form factor
              downloads one poster — the right one — before any script runs.
            */}
            <picture>
              <source media="(min-width: 768px)" srcSet={ASSETS.heroFilmPoster.src} />
              <img
                src={ASSETS.heroFilmPosterMobile.src}
                alt={b(hero.videoAlt)}
                width={720}
                height={1280}
                className="absolute inset-0 h-full w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
            </picture>

            {showVideo && (
              <video
                // Remount on breakpoint change so the browser picks up the other cut.
                key={isDesktop ? 'desktop' : 'mobile'}
                ref={videoRef}
                muted
                loop
                playsInline
                // Buffered as it plays rather than fetched whole up front.
                preload={quiet ? 'none' : 'metadata'}
                // The URL the <picture> already chose, so it comes from the cache.
                poster={isDesktop ? ASSETS.heroFilmPoster.src : ASSETS.heroFilmPosterMobile.src}
                // The <picture> above carries the description; this is decoration.
                aria-hidden="true"
                onError={() => setFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={isDesktop ? ASSETS.heroFilm.src : ASSETS.heroFilmMobile.src} type="video/webm" />
                <source src={isDesktop ? ASSETS.heroFilmMp4.src : ASSETS.heroFilmMobileMp4.src} type="video/mp4" />
              </video>
            )}
          </div>

          {/* ── Pause / play — under the frame, so nothing sits on the film ── */}
          {!failed && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setVideoArmed(true);
                  setPaused((p) => !p);
                }}
                className="inline-flex min-h-8 items-center gap-2 rounded-full border border-cream/20 px-3.5 py-1
                  text-[12.5px] font-medium text-cream/75 transition-colors hover:border-cream/40 hover:text-cream
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              >
                {paused ? (
                  <Play aria-hidden="true" className="size-3.5" fill="currentColor" />
                ) : (
                  <Pause aria-hidden="true" className="size-3.5" fill="currentColor" />
                )}
                {paused ? b({ ar: 'شغّل الفيديو', en: 'Play the film' }) : b({ ar: 'وقّف الفيديو', en: 'Pause the film' })}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
