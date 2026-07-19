/**
 * Single source of truth for free-trial copy across the landing page.
 *
 * Two tiers of truth:
 *
 * 1. `DEFAULT_TRIAL_DAYS` — the build-time constant used by STATIC copy
 *    (SEO descriptions, prerendered marketing strings). Update it here
 *    when the offer changes; one edit fixes every static mention.
 * 2. `useTrialMeta()` — runtime hook for INTERACTIVE surfaces (pricing
 *    cards, FAQ, demo modal). Reads the admin-controlled value from
 *    `GET /public/pricing-plans` (`data.trial`), cached in
 *    sessionStorage for 5 minutes, falling back to the constant.
 *
 * If the admin changes the trial length, runtime surfaces follow within
 * minutes; static SEO copy follows at the next deploy — acceptable
 * drift for crawler-facing text.
 */

import { useEffect, useState } from "react";

export const DEFAULT_TRIAL_DAYS = 37;

export interface TrialMeta {
  enabled: boolean;
  days: number;
  visible: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "https://numueg.app/api/v1";
const CACHE_KEY = "numu-trial-meta";
const CACHE_TTL_MS = 5 * 60 * 1000;

const FALLBACK: TrialMeta = {
  enabled: true,
  days: DEFAULT_TRIAL_DAYS,
  visible: true,
};

export const toArabicDigits = (s: string): string =>
  s.replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d, 10)));

async function fetchTrialMeta(): Promise<TrialMeta> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { at, meta } = JSON.parse(cached);
      if (Date.now() - at < CACHE_TTL_MS) return meta as TrialMeta;
    }
  } catch {
    /* ignore cache errors */
  }
  try {
    const res = await fetch(`${API_URL}/public/pricing-plans`, {
      credentials: "include",
    });
    const json = await res.json();
    const meta: TrialMeta = { ...FALLBACK, ...(json?.data?.trial ?? {}) };
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ at: Date.now(), meta }),
      );
    } catch {
      /* ignore quota errors */
    }
    return meta;
  } catch {
    return FALLBACK;
  }
}

/** Admin-controlled trial info with a safe static fallback. */
export function useTrialMeta(): TrialMeta {
  const [meta, setMeta] = useState<TrialMeta>(FALLBACK);
  useEffect(() => {
    let alive = true;
    void fetchTrialMeta().then((m) => {
      if (alive) setMeta(m);
    });
    return () => {
      alive = false;
    };
  }, []);
  return meta;
}
