import React, { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';
import { hero } from './copy';
import { ASSETS } from './assets';
import { PrimaryCta, SecondaryCta, useBi } from './ui';
import { useMediaQuery, usePrefersReducedMotion } from './hooks';

/**
 * 01 — Hero. `sections/01-hero.md`.
 *
 * Full-bleed: numu's own 48-second motion film fills the first viewport as
 * the background, and the headline, CTAs and reassurance sit over it on the
 * start side — the owner's call (2026-09-28), with the 16:9 cut from 768 px up
 * and the 9:16 cut below. Masters: `docs/Plans/landing page updates/motion
 * video i want to use it/`.
 *
 * The film carries titles of its own, so legibility is handled by a scrim
 * that is heavy under the copy and clears over the far side (three layers,
 * below). A small button pauses and resumes it — a 48-second moving
 * background needs one (WCAG 2.2.2). Under `prefers-reduced-motion` or
 * Save-Data it does not start by itself and loads nothing until played.
 *
 * The hero paints without the film: the poster is up immediately and the
 * headline and primary CTA never wait on a network fetch.
 */

const HeroSection: React.FC = () => {
  const { b } = useBi();
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reduced motion or Save-Data: nothing plays or loads until the visitor asks.
  const quiet =
    reduced ||
    (typeof navigator !== 'undefined' &&
      !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

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

  const showVideo = !failed && videoArmed;

  // Play as early as the browser allows; the `loadeddata` retry covers a
  // first call rejected because no data had arrived yet.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !showVideo) return;
    if (paused) {
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
  }, [showVideo, isDesktop, paused]);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[640px] h-[100svh] max-h-[920px] w-full overflow-hidden bg-navy-900"
    >
      {/* ── Film ── */}
      <div className="absolute inset-0 -z-10">
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
            preload={quiet ? 'none' : 'auto'}
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

      {/* ── Scrim ──
          1. an even wash, so the film's brightest (cream) scenes never wash
             the type out;
          2. a directional wash, heavy under the copy and clear over the far
             side, where the film stays readable. The gradient starts dark on
             the START side: `to right` in LTR, `to left` in RTL (the previous
             hero had these swapped, so the wash sat opposite the copy);
          3. a floor that holds the reassurance line and anchors the panel
             that lifts over the hero. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(0,31,63,0.22)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,31,63,0.97)_0%,rgba(0,31,63,0.9)_34%,rgba(0,31,63,0.5)_56%,rgba(0,31,63,0.08)_80%,rgba(0,31,63,0)_100%)] rtl:bg-[linear-gradient(to_left,rgba(0,31,63,0.97)_0%,rgba(0,31,63,0.9)_34%,rgba(0,31,63,0.5)_56%,rgba(0,31,63,0.08)_80%,rgba(0,31,63,0)_100%)] max-md:bg-[linear-gradient(to_top,rgba(0,31,63,0.97)_0%,rgba(0,31,63,0.9)_42%,rgba(0,31,63,0.35)_68%,rgba(0,31,63,0.05)_88%)] max-md:rtl:bg-[linear-gradient(to_top,rgba(0,31,63,0.97)_0%,rgba(0,31,63,0.9)_42%,rgba(0,31,63,0.35)_68%,rgba(0,31,63,0.05)_88%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(to_top,rgba(0,31,63,0.62)_0%,rgba(0,31,63,0.18)_55%,transparent_100%)]"
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

            <p className="prose-body mt-5 sm:mt-6 max-w-xl text-cream/85">{b(hero.support)}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryCta size="lg" onDark />
              <SecondaryCta size="lg" onDark />
            </div>

            <p className="mt-6 font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] text-cream/70">
              {b(hero.reassurance)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Pause / play ── */}
      {!failed && (
        <button
          type="button"
          onClick={() => {
            setVideoArmed(true);
            setPaused((p) => !p);
          }}
          aria-label={paused ? b({ ar: 'شغّل الفيديو', en: 'Play the film' }) : b({ ar: 'وقّف الفيديو', en: 'Pause the film' })}
          className="absolute bottom-14 end-5 sm:bottom-16 sm:end-8 grid size-10 place-items-center rounded-full
            border border-cream/25 bg-navy-900/55 text-cream backdrop-blur-sm transition-colors hover:bg-navy-900/80
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
          {paused ? <Play className="size-4" fill="currentColor" /> : <Pause className="size-4" fill="currentColor" />}
        </button>
      )}
    </section>
  );
};

export default HeroSection;
