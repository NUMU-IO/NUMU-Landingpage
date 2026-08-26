import React, { useState } from 'react';
import { usePrefersReducedMotion, useMediaQuery } from '../hooks';
import OriginKitDitherReveal from './vendor/dither-reveal';

/**
 * Dither Reveal.
 * `animations/originkit-placement.md` § "2. Dither Reveal".
 *
 * The component is the real OriginKit one, retrieved through OriginKit MCP
 * and vendored in `./vendor/dither-reveal.tsx`. Everything here is
 * configuration and the fallbacks the spec requires.
 *
 * ─── v1 configuration ─────────────────────────────────────────────────────
 * fit cover · soft Bayer dither · small dot size · medium reveal radius ·
 * medium/high softness · slow-to-medium wave.
 *
 * The one substantive change to the component is colour. Upstream renders the
 * dithered plate in greyscale, and the identity lock has no greys — so the
 * plate ramps between `navy-900` and `paper` instead, which keeps the effect
 * inside the palette on both the cream and the navy surfaces.
 *
 * ─── Fallbacks ────────────────────────────────────────────────────────────
 * The effect is WebGL and pointer-driven, so it is skipped entirely — and the
 * plain image rendered instead — when any of these hold:
 *   • `prefers-reduced-motion` is set;
 *   • the device has no fine pointer (there is no hover on touch, and the
 *     spec forbids hover-only discovery);
 *   • WebGL fails to start, or the texture fails to load.
 */

/** navy-900 #001F3F and paper #FBF6ED, normalised for the shader. */
const INK: [number, number, number] = [0x00 / 255, 0x1f / 255, 0x3f / 255];
const PAPER: [number, number, number] = [0xfb / 255, 0xf6 / 255, 0xed / 255];

interface Props {
  /** Image to dither. */
  src: string;
  alt: string;
  className?: string;
  /** Reveal radius in px. */
  revealRadius?: number;
  dotSize?: number;
}

const DitherReveal: React.FC<Props> = ({
  src,
  alt,
  className = '',
  revealRadius = 140,
  dotSize = 4,
}) => {
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [failed, setFailed] = useState(false);

  const enabled = !reduced && finePointer && !failed;

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
    <div className={`relative overflow-hidden ${className}`} role="img" aria-label={alt}>
      <OriginKitDitherReveal
        image={src}
        fit="cover"
        ditherStyle="bayer8"
        dotSize={dotSize}
        revealRadius={revealRadius}
        revealSoftness={55}
        wave
        waveSpeed={70}
        waveDensity={22}
        inkColor={INK}
        paperColor={PAPER}
        onFail={() => setFailed(true)}
      />
    </div>
  );
};

export default DitherReveal;
