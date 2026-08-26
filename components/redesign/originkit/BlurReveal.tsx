import React from 'react';
import { usePrefersReducedMotion, useMediaQuery } from '../hooks';
import OriginKitBlurReveal from './vendor/blur-reveal';

/**
 * Blur Reveal — final CTA aside.
 *
 * The component is the real OriginKit one, retrieved through OriginKit MCP
 * and vendored in `./vendor/blur-reveal.tsx`. Everything here is
 * configuration and the fallbacks the spec requires.
 *
 * ─── v1 configuration ─────────────────────────────────────────────────────
 *   ringColor  rgba(255,255,255,.95) → cream @ 55%, so the lens ring sits in
 *                                      the palette instead of pure white
 *   rounding   0                     → 20 (a circular lens, matching the
 *                                      round shapes already on the page)
 *   blur       8                     → 4  (liquid glass, not frosted glass:
 *                                      the screenshot stays readable through
 *                                      the blur and the lens sharpens it,
 *                                      rather than hiding it until hovered)
 *
 * ─── Fallbacks ────────────────────────────────────────────────────────────
 * The reveal is pointer-driven, so it is replaced by the plain sharp image
 * when `prefers-reduced-motion` is set, or when the device has no fine
 * pointer — there is no hover on touch, and the spec forbids hover-only
 * discovery. The underlying screenshot is always fully legible in that state.
 */

interface Props {
  src: string;
  alt: string;
  className?: string;
  /** Lens diameter in px. */
  size?: number;
}

const BlurReveal: React.FC<Props> = ({ src, alt, className = '', size = 210 }) => {
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const enabled = !reduced && finePointer;

  if (!enabled) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <OriginKitBlurReveal
        image={{ src, alt }}
        size={size}
        rounding={20}
        /* Light enough that the screenshot reads through it — the lens adds
           focus rather than revealing something hidden. */
        blur={4}
        ring
        ringOptions={{ color: 'rgba(251,246,237,0.55)', icon: false }}
        intro
        introDuration={1.2}
      />

      {/* Liquid-glass shell over the lens: a soft specular sheen and an inner
          rim, so the lens reads as a piece of glass sitting on the image
          instead of a cut-out hole. Purely decorative and pointer-transparent,
          so it never interferes with the component beneath. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 22% 12%, rgba(251,246,237,0.16) 0%, rgba(251,246,237,0.05) 34%, rgba(0,31,63,0) 62%)',
          boxShadow: 'inset 0 1px 0 rgba(251,246,237,0.18), inset 0 -18px 40px -24px rgba(0,31,63,0.65)',
        }}
      />
    </div>
  );
};

export default BlurReveal;
