import React, { useState, Suspense, lazy } from 'react';
import { usePrefersReducedMotion, useMediaQuery } from '../hooks';

/**
 * Earth — reliability and growth section ONLY.
 * `animations/originkit-placement.md` § "1. Globe".
 *
 * The globe itself is the real OriginKit Globe, retrieved through OriginKit
 * MCP and vendored in `./vendor/globe.tsx`. Everything here is configuration,
 * the space treatment around it, and the fallbacks.
 *
 * ─── Matching the reference ───────────────────────────────────────────────
 * The brief is Shopify's planet (`Earth img.png`), and it has five things
 * this had to grow:
 *
 *   1. Real Earth colour. Green land on blue ocean, not a navy monochrome —
 *      the owner asked for this explicitly. It is a deliberate, sanctioned
 *      departure from the navy-only palette lock in `numu-identity.md`; the
 *      section's copy, chrome and CTA all stay on palette, and the planet is
 *      the one object allowed to be the colour it actually is.
 *   2. A night side. The reference is lit hard from one edge with most of
 *      the disc in shadow, which is what makes it read as a sphere in space
 *      rather than a flat map.
 *   3. City lights. Warm points scattered over land, brightest where the
 *      shadow is deepest. These are baked into the sphere's own texture (see
 *      `cityLights` in the vendor) so they rotate with the planet — an
 *      overlay would slide across it and instantly look wrong.
 *   4. A cyan-white lit limb, the bright hairline where the atmosphere
 *      catches the light.
 *   5. Lines moving around the planet. The reference has bright curved paths
 *      sweeping over and behind the globe.
 *
 * ─── What the orbits are, and what they are not ───────────────────────────
 * `sections/05-reliability-and-growth.md` forbids anything that reads as a
 * coverage or availability claim, and the reference pairs its arcs with a
 * literal "175 COUNTRIES" badge. That badge is the part we cannot copy.
 *
 * So these are rings around the whole planet, not routes between places.
 * They touch no country, terminate nowhere, do not track the rotating
 * surface, and nothing is named, pinned or counted. They read as movement
 * around the planet — which is true of a commerce platform — and they assert
 * nothing about where numu operates.
 *
 * ─── Cost control ─────────────────────────────────────────────────────────
 * The component pulls in three.js and d3-geo, so it is `lazy()`-imported and
 * the section only mounts it once it is near the viewport. That keeps ~150KB
 * of WebGL machinery out of the initial bundle and off the hero's critical
 * path. The orbits are SVG and cost nothing.
 */

const OriginKitGlobe = lazy(() => import('./vendor/globe'));

/* ── Palette. Sampled to sit beside the reference without copying it. ── */
const OCEAN = '#0C3B66';
const LAND = '#249069';
const CITY_LIGHT = 'rgba(255, 196, 106, 0.95)';
const ARC = '#DFF6EC';

/** Deterministic star field — never reshuffles between renders. */
const STARS = (() => {
  let seed = 20260824;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: 90 }, () => ({
    left: `${(rnd() * 100).toFixed(2)}%`,
    top: `${(rnd() * 100).toFixed(2)}%`,
    size: `${(0.8 + rnd() * 1.9).toFixed(2)}px`,
    opacity: (0.12 + rnd() * 0.55).toFixed(2),
  }));
})();

/**
 * Orbits, in the overlay's 0–100 viewBox where the planet is the circle
 * (50, 50) r 50.
 *
 * These were quadratic arcs drawn straight across the disc, and they read
 * exactly wrong: a flat curve over a sphere looks like a line flying *through*
 * the planet, not around it. Nothing about a 2D path says which side of a
 * sphere it is on.
 *
 * A ring does, provided it is occluded. Each orbit is an ellipse wider than
 * the planet (`rx > 50`), so its shoulders clear the limb on both sides, and
 * it is drawn in two pieces:
 *
 *   • the far half, masked so the planet's disc knocks a hole in it — it
 *     survives only outside the limb, which is exactly what a ring passing
 *     behind a solid body looks like;
 *   • the near half, drawn unmasked over the planet.
 *
 * That single difference is what turns "flying across" into "going around".
 */
const ORBITS = [
  { rx: 64, ry: 15, tilt: -16, w: 0.5, o: 0.85, dur: 7 },
  { rx: 58, ry: 27, tilt: 22, w: 0.4, o: 0.55, dur: 9.5 },
  { rx: 68, ry: 9, tilt: 58, w: 0.34, o: 0.4, dur: 12 },
];

const rad = (d: number) => (d * Math.PI) / 180;

/** The half that passes in front of the planet — the lower arc. */
function nearArc(rx: number, ry: number): string {
  return `M ${50 - rx} 50 A ${rx} ${ry} 0 0 0 ${50 + rx} 50`;
}

/** The half that passes behind — the upper arc. Always drawn masked. */
function farArc(rx: number, ry: number): string {
  return `M ${50 - rx} 50 A ${rx} ${ry} 0 0 1 ${50 + rx} 50`;
}

const EarthGlobe: React.FC<{ className?: string; label: string }> = ({
  className = '',
  label,
}) => {
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 639px)');
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative ${className}`} role="img" aria-label={label}>
      {/* ── Space field ── */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-cream"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, opacity: s.opacity }}
          />
        ))}
      </div>

      {/* ── Atmospheric halo — air around the planet, outside its edge. ── */}
      <div
        aria-hidden="true"
        className="absolute inset-[1%] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(64,164,214,0) 45%, rgba(96,206,232,0.34) 50.5%, rgba(64,164,214,0.10) 60%, rgba(64,164,214,0) 72%)',
        }}
      />

      <div className="relative w-full aspect-square">
        {failed ? (
          // Static planet. The headline and copy never depend on the globe.
          <div
            className="absolute inset-[7%] rounded-full border border-cream/15"
            style={{
              background:
                'radial-gradient(circle at 34% 30%, rgba(46,158,107,0.5) 0%, #0A2A4C 62%)',
            }}
          />
        ) : (
          <Suspense fallback={<div className="absolute inset-0" />}>
            <OriginKitGlobe
              fill="solid"
              fillColor={LAND}
              dots={{ color: CITY_LIGHT, size: 5, density: 8, allDots: false }}
              oceanColor={OCEAN}
              /* Off: the coastline tubes are the component's main cost, and
                 the filled landmass already gives the edge. */
              showOutline={false}
              outlineColor="rgba(0,0,0,0)"
              showGrid={false}
              graticuleColor="rgba(0,0,0,0)"
              /* No pins. A marker on a country is a coverage claim. */
              markerConfig={{ markers: [], color: '#E8A430', size: 0 }}
              cityLights={{ color: CITY_LIGHT, count: 1100, size: 2.6 }}
              speed={reduced ? 0 : 1}
              direction="left"
              smoothing={8}
              stopOnHover
              /* The planet's apparent radius is asin(scaleMultiplier^2 / 2.5)
                 against a 25 degree half-view, so 8 filled only ~69% of its
                 box and left a ring of dead navy around it. 9 takes that to
                 ~86% without clipping. */
              scale={isMobile ? 8 : 9}
              initialLatitude={18}
              initialLongitude={-32}
              detail={4}
              landUrl="/ne_50m_land.json"
              onError={() => setFailed(true)}
            />
          </Suspense>
        )}

        {/* ── Night side ──
            Deep shadow over most of the disc, clearing toward the upper
            start edge. This is what lets the city lights read: they are
            baked at constant brightness, and it is the shadow over them that
            makes them glow on the dark half and wash out on the lit one. */}
        <div
          aria-hidden="true"
          className="absolute inset-[7%] rounded-full pointer-events-none z-10"
          style={{
            /* Centred on the lit limb rather than inside the disc. A
               gradient centred in the middle lights a circular patch in the
               centre of the planet, which is not what a terminator looks
               like; anchoring it at the edge the light comes from gives the
               crescent, with the far side falling away to night. */
            background:
              'radial-gradient(circle at 4% 34%, rgba(2,10,22,0) 0%, rgba(2,10,22,0.12) 26%, rgba(2,10,22,0.62) 55%, rgba(1,7,16,0.9) 78%, rgba(1,5,12,0.96) 100%)',
          }}
        />

        {/* ── Lit limb ──
            The bright cyan hairline along the sunlit edge. This single detail
            does more than anything else to separate "a planet" from "a circle
            with a map on it". */}
        <div
          aria-hidden="true"
          className="absolute inset-[7%] rounded-full pointer-events-none z-10"
          style={{
            /* A concentric ring at the disc edge, then masked so only the
               sunlit arc of it survives. Building the rim from an off-centre
               gradient instead produces a smear rather than a hairline,
               because its stops stop being parallel to the edge. */
            background:
              'radial-gradient(circle at 50% 50%, rgba(160,240,235,0) 92%, rgba(170,244,238,0.72) 97%, rgba(214,252,248,0.28) 99.5%, rgba(160,240,235,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(108deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.25) 44%, rgba(0,0,0,0) 58%)',
            maskImage:
              'linear-gradient(108deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.25) 44%, rgba(0,0,0,0) 58%)',
          }}
        />

        {/* ── Orbits ──
            Above the planet in z. See the note on ORBITS for why each ring is
            drawn in two halves and only one of them is masked. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute z-20 overflow-visible pointer-events-none"
          style={{ inset: '7%', position: 'absolute' }}
        >
          <defs>
            {/* White shows, black hides — the planet's disc knocks a hole in
                whatever references this, which is how the far half of each
                ring disappears behind the globe. */}
            <mask id="numu-orbit-occlude" maskUnits="userSpaceOnUse">
              <rect x="-60" y="-60" width="220" height="220" fill="#fff" />
              <circle cx="50" cy="50" r="50" fill="#000" />
            </mask>
            <filter id="numu-arc-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="0.8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#numu-arc-glow)">
            {ORBITS.map((o, i) => {
              const far = farArc(o.rx, o.ry);
              const near = nearArc(o.rx, o.ry);
              return (
                <g key={i} transform={`rotate(${o.tilt} 50 50)`}>
                  {/* Behind the planet. */}
                  <g mask="url(#numu-orbit-occlude)">
                    <path
                      d={far}
                      fill="none"
                      stroke={ARC}
                      strokeWidth={o.w}
                      strokeLinecap="round"
                      opacity={o.o * 0.3}
                    />
                    {!reduced && (
                      <path
                        d={far}
                        fill="none"
                        stroke={ARC}
                        strokeWidth={o.w * 1.5}
                        strokeLinecap="round"
                        opacity={o.o * 0.75}
                        pathLength={100}
                        strokeDasharray="14 86"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="100"
                          to="-14"
                          dur={`${o.dur}s`}
                          repeatCount="indefinite"
                        />
                      </path>
                    )}
                  </g>

                  {/* In front of the planet. */}
                  <path
                    d={near}
                    fill="none"
                    stroke={ARC}
                    strokeWidth={o.w}
                    strokeLinecap="round"
                    opacity={o.o * 0.55}
                  />
                  {!reduced && (
                    <path
                      d={near}
                      fill="none"
                      stroke={ARC}
                      strokeWidth={o.w * 1.5}
                      strokeLinecap="round"
                      opacity={o.o}
                      pathLength={100}
                      strokeDasharray="14 86"
                    >
                      {/* Half a lap out of phase with the far half, so a pulse
                          appears to hand over at the limb rather than two
                          pulses running the same side together. */}
                      <animate
                        attributeName="stroke-dashoffset"
                        from="100"
                        to="-14"
                        dur={`${o.dur}s`}
                        begin={`-${(o.dur / 2).toFixed(2)}s`}
                        repeatCount="indefinite"
                      />
                    </path>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default EarthGlobe;
