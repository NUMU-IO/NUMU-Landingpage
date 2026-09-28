/**
 * The onboarding chat's answers, held until sign-up (W3,
 * `docs/Plans/landing page updates/03-onboarding-chat.md`).
 *
 * `SignupModal` puts the stored JSON in the hub hand-off fragment as
 * `prefill`; the hub keeps it for its setup wizard, which pre-selects the
 * answers. Values are the wizard's own option ids. Nothing personal is kept:
 * niche, where they sell, order band, payment methods, shipping.
 *
 * sessionStorage, same origin, same tab — the chat and the sign-up both live
 * here. Storage can be blocked (private mode, cleared site data); then the
 * wizard simply starts empty.
 */
export interface OnboardingPrefill {
  niche?: string;
  sellsWhere?: string;
  ordersBand?: string;
  payments?: string[];
  shipping?: string;
}

const KEY = 'numu-onboarding-prefill';

export function savePrefill(answers: OnboardingPrefill): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    /* storage blocked: the wizard starts empty */
  }
}

/** The stored JSON as-is, ready to ride in the hand-off fragment. */
export function readPrefill(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearPrefill(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}
