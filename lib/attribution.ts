/**
 * Acquisition attribution — where a visitor came from.
 *
 * The landing has always seen the UTM parameters on the URL and always
 * thrown them away: nothing on `users` or `tenants` recorded a source, so
 * "which channel produced this merchant" was unanswerable for every
 * merchant on the platform. Both signup doors now send this payload and
 * the API stores it on the merchant lead.
 *
 * First touch wins, within the tab. The parameters are captured the first
 * time they are seen and kept in sessionStorage, so a visitor who lands on
 * /?utm_source=tiktok, reads the pricing page, and only then opens the
 * signup modal is still credited to TikTok. The API applies the same
 * first-touch rule again across sessions.
 *
 * sessionStorage rather than localStorage on purpose: attribution should
 * not follow someone into a visit three weeks later that had nothing to do
 * with the original ad.
 */

const STORAGE_KEY = "numu.attribution.v1";

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referrer?: string;
  landing_path?: string;
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;

/** Column widths on the API side. Trimmed here so nothing 422s a signup. */
const LIMITS: Record<keyof Attribution, number> = {
  utm_source: 120,
  utm_medium: 120,
  utm_campaign: 120,
  utm_content: 120,
  referrer: 500,
  landing_path: 255,
};

function clip(key: keyof Attribution, value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, LIMITS[key]);
}

function read(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    // Private mode, blocked storage, corrupt JSON — attribution is a
    // nice-to-have and must never break a signup.
    return null;
  }
}

function write(value: Attribution): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* see read() */
  }
}

/**
 * Read the current URL and remember anything worth keeping.
 *
 * Idempotent and safe to call on every route change: once a source has
 * been stored, later calls do not overwrite it.
 */
export function captureAttribution(): Attribution {
  const existing = read();
  if (existing && Object.keys(existing).length > 0) return existing;

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return {};
  }

  const captured: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = clip(key, params.get(key));
    if (value) captured[key] = value;
  }

  // An empty referrer is the norm for direct traffic and for links opened
  // from apps that strip it (WhatsApp among them). Self-referrals are not
  // acquisition — they are the visitor moving around our own site.
  const ref = document.referrer;
  if (ref && !ref.startsWith(window.location.origin)) {
    captured.referrer = clip("referrer", ref);
  }
  captured.landing_path = clip("landing_path", window.location.pathname);

  write(captured);
  return captured;
}

/** The payload to send with a signup. `undefined` when we know nothing. */
export function getAttribution(): Attribution | undefined {
  const value = read() ?? captureAttribution();
  return Object.keys(value).length > 0 ? value : undefined;
}
