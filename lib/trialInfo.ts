/**
 * Single source of truth for free-trial copy across the landing page.
 *
 * Two tiers of truth:
 *
 * 1. `DEFAULT_TRIAL_DAYS` — the build-time constant used by STATIC copy
 *    (SEO descriptions, prerendered marketing strings). Update it here
 *    when the offer changes; one edit fixes every static mention.
 * 2. `useTrialMeta()` (in `pricingFacts.ts`) — runtime hook for INTERACTIVE
 *    surfaces (pricing cards, FAQ, sign-up modal). Reads the admin-controlled
 *    value from the same `GET /public/pricing-plans` request the plan cards
 *    use, falling back to the constant.
 *
 * If the admin changes the trial length, runtime surfaces follow within
 * minutes; static SEO copy follows at the next deploy — acceptable
 * drift for crawler-facing text.
 */

export const DEFAULT_TRIAL_DAYS = 14;

export interface TrialMeta {
  enabled: boolean;
  days: number;
  visible: boolean;
}

export const toArabicDigits = (s: string): string =>
  s.replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d, 10)));

/** Pricing and trial numbers use Latin digits in both languages, like the hub. */
export const toLatinDigits = (s: string): string =>
  s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

/** What happens when the trial ends, said before signup rather than only inside the product. */
export const afterTrialLine = (days: number) => ({
  ar: `${days} يوم مجانًا بكل المميزات. بعدها متجرك بيتقفل للزوار لحد ما تختار باقة، وكل حاجة عملتها محفوظة.`,
  en: `${days} days free with every feature. After that your store closes to visitors until you pick a plan. Everything you built is kept.`,
});
