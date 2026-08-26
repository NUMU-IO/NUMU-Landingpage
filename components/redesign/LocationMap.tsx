import React from 'react';
import { useBi } from './ui';

/**
 * Numueg's location.
 *
 * ─── Where the data came from ─────────────────────────────────────────────
 * The owner supplied https://maps.app.goo.gl/7t7qFHKFkgU28Cyx7. Following
 * that redirect resolves to:
 *
 *   Numueg, Qasr Ad Dobarah, Qasr El Nil, Cairo Governorate 4272077
 *   30.0444196, 31.2357116
 *
 * Nothing here is guessed: the name, the address line and the coordinates
 * are all read back from the link, and `MAPS_URL` is the original short link
 * so "open in Maps" lands exactly where the owner pointed.
 *
 * ─── Why OpenStreetMap tiles and not a Google embed ───────────────────────
 * The previous version was a click-to-load Google Maps iframe. It could not
 * have worked in production: `vercel.json` ships
 * `frame-src https://accounts.google.com https://*.paymob.com https://*.kashier.io`,
 * and Google Maps is not on that list, so the browser would have refused the
 * frame outright.
 *
 * Raster tiles are plain `<img>` elements, and `img-src` already allows
 * `https:`, so the map draws with no CSP change, no iframe, no third-party
 * script and no cookies. Clicking still opens Google Maps in a new tab,
 * which is what people actually want for directions.
 *
 * ─── The tile grid ────────────────────────────────────────────────────────
 * Standard slippy-map maths. The wrapper is pinned at the panel's centre and
 * every tile is offset from it by `(tileIndex - exactTile) * 256`, so the
 * pin sits on the real coordinate at any panel width without JavaScript
 * measuring anything.
 *
 * Attribution is required by the ODbL and is rendered, not optional. Tile
 * count is kept small and every tile is lazy — this is a light, non-systematic
 * use of the public tile servers.
 */

const PLACE_NAME = 'Numueg';
const ADDRESS_EN = 'Qasr Ad Dobarah, Qasr El Nil, Cairo Governorate';
const ADDRESS_AR = 'قصر الدوبارة، قصر النيل، محافظة القاهرة';
const LAT = 30.0444196;
const LNG = 31.2357116;
/** The owner's original link — the canonical destination. */
const MAPS_URL = 'https://maps.app.goo.gl/7t7qFHKFkgU28Cyx7';

const ZOOM = 15;
const TILE = 256;
/** Tiles either side of centre. 5 x 3 covers the panel at every width it renders at. */
const SPAN_X = 2;
const SPAN_Y = 1;

/** Longitude → fractional tile X at ZOOM. */
function lngToTile(lng: number, z: number) {
  return ((lng + 180) / 360) * 2 ** z;
}

/** Latitude → fractional tile Y at ZOOM (Web Mercator). */
function latToTile(lat: number, z: number) {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z;
}

const cx = lngToTile(LNG, ZOOM);
const cy = latToTile(LAT, ZOOM);

/** Every tile to draw, with its offset from the pin in CSS pixels. */
const TILES = (() => {
  const out: { key: string; src: string; dx: number; dy: number }[] = [];
  const baseX = Math.floor(cx);
  const baseY = Math.floor(cy);
  for (let i = -SPAN_X; i <= SPAN_X; i++) {
    for (let j = -SPAN_Y; j <= SPAN_Y; j++) {
      const x = baseX + i;
      const y = baseY + j;
      if (y < 0 || y >= 2 ** ZOOM) continue;
      const wrapped = ((x % 2 ** ZOOM) + 2 ** ZOOM) % 2 ** ZOOM;
      out.push({
        key: `${x}-${y}`,
        src: `https://tile.openstreetmap.org/${ZOOM}/${wrapped}/${y}.png`,
        dx: (x - cx) * TILE,
        dy: (y - cy) * TILE,
      });
    }
  }
  return out;
})();

const LocationMap: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { b } = useBi();

  const openLabel = b({
    ar: `افتح موقع ${PLACE_NAME} في خرائط جوجل — بيفتح في تبويب جديد`,
    en: `Open ${PLACE_NAME} in Google Maps — opens in a new tab`,
  });

  return (
    <div className={`overflow-hidden rounded-[10px] border border-ink/12 bg-paper ${className}`}>
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={openLabel}
        className="group relative block aspect-[16/10] w-full overflow-hidden bg-bone/40
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
          focus-visible:ring-inset"
      >
        {/* Tiles. The wrapper's origin IS the pinned coordinate. */}
        <span aria-hidden="true" className="absolute left-1/2 top-1/2 block">
          {TILES.map((t) => (
            <img
              key={t.key}
              src={t.src}
              alt=""
              width={TILE}
              height={TILE}
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute max-w-none select-none"
              style={{ left: t.dx, top: t.dy, width: TILE, height: TILE }}
            />
          ))}
        </span>

        {/* Warm the map toward the page palette without hiding the streets. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[rgba(245,239,230,0.16)]
            mix-blend-multiply transition-opacity duration-300 group-hover:opacity-0"
        />

        {/* Pin, dead centre — which is exactly the coordinate above. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
        >
          <span className="grid size-9 place-items-center rounded-full rounded-bl-none bg-navy text-cream
            shadow-[0_8px_18px_-6px_rgba(0,31,63,0.6)] ring-2 ring-cream/70 -rotate-45
            transition-transform duration-300 group-hover:-translate-y-1">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rotate-45">
              <circle cx="12" cy="12" r="3.2" />
            </svg>
          </span>
        </span>

        {/* Affordance — it is a link, so say where it goes. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 start-3 inline-flex items-center gap-1.5
            rounded-full bg-cream/95 px-3 py-1.5 text-[12px] font-semibold text-navy shadow-card
            opacity-0 transition-opacity duration-200 group-hover:opacity-100
            group-focus-visible:opacity-100"
        >
          {b({ ar: 'افتح في خرائط جوجل', en: 'Open in Google Maps' })}
          <span className="rtl:rotate-180">→</span>
        </span>

        {/* ODbL requires this, and it must stay legible.
            `dir="ltr"` because the credit is a fixed English string: in RTL
            the bidi algorithm moved the © to the end and it read
            "OpenStreetMap contributors ©". */}
        <span
          dir="ltr"
          className="absolute bottom-0 end-0 bg-cream/85 px-1.5 py-0.5 text-[10px] text-ink-soft/75"
        >
          ©{' '}
          <span className="underline decoration-ink-soft/30 underline-offset-2">
            OpenStreetMap
          </span>{' '}
          contributors
        </span>
      </a>

      {/* Info card */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 p-5">
        <div>
          <p className="font-display text-base font-bold text-ink">{PLACE_NAME}</p>
          <address className="prose-body-sm not-italic text-ink-soft/75 mt-1">
            {b({ ar: ADDRESS_AR, en: ADDRESS_EN })}
          </address>
        </div>

        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-6 items-center gap-1.5 rounded-[2px] py-1 text-sm
            font-semibold text-navy focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          aria-label={openLabel}
        >
          <span className="underline decoration-navy/30 underline-offset-4 group-hover:decoration-navy">
            {b({ ar: 'افتح في خرائط جوجل', en: 'Open in Google Maps' })}
          </span>
          <span aria-hidden="true" className="rtl:rotate-180">→</span>
        </a>
      </div>
    </div>
  );
};

export default LocationMap;
