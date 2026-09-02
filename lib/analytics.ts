/**
 * PostHog — product analytics for the NUMU team.
 *
 * This is internal instrumentation. Nothing here is merchant-facing and
 * nothing here changes what a visitor sees; it exists so we can answer
 * "where do people fall out of signup" without guessing.
 *
 * Three deliberate choices:
 *
 * **Lazy, after render.** Loaded on idle exactly like Sentry, because the
 * landing page's LCP is a number we have spent real effort on and an
 * analytics SDK is never worth regressing it. PostHog buffers the calls
 * it receives before load, so events fired during that window still land.
 *
 * **`identified_only` person profiles.** An anonymous visitor who bounces
 * does not need a stored person record. This is also the difference
 * between a bill that tracks signups and a bill that tracks traffic.
 *
 * **All inputs masked in replay.** Session replay is on here — the
 * landing has no customer data on screen, so recordings are safe and
 * genuinely useful for seeing where a signup stalls. But the signup form
 * itself contains an email, a phone number and a password, so every
 * input is masked rather than relying on PostHog's default of masking
 * only password fields. The hub, which renders real customer PII, does
 * not record at all.
 *
 * Disabled entirely when `VITE_POSTHOG_KEY` is unset, which is the case
 * in local development and CI. No key, no network calls, no console noise.
 */

import type { PostHog } from "posthog-js";
import { getAttribution } from "./attribution";

/** Events we deliberately capture. A union, so typos fail the build. */
export type AnalyticsEvent =
  | "signup_modal_opened"
  | "signup_submitted"
  | "signup_failed"
  | "signup_google_clicked"
  | "demo_modal_opened"
  | "demo_submitted"
  | "demo_failed"
  | "pricing_plan_clicked";

type Props = Record<string, string | number | boolean | null | undefined>;

let client: PostHog | null = null;

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const HOST =
  (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ??
  "https://eu.i.posthog.com";

/**
 * Load and start PostHog. Safe to call when unconfigured — it no-ops.
 *
 * Call from the entry point on idle, after first render.
 */
export function initAnalytics(): void {
  if (!KEY || client) return;

  import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
        defaults: "2026-05-30",
        // Anonymous visitors stay anonymous until they sign up.
        person_profiles: "identified_only",
        session_recording: {
          // The signup form holds an email, a phone number and a
          // password. PostHog masks passwords by default and nothing
          // else, which is not enough here.
          maskAllInputs: true,
        },
      });

      // Where this visitor came from, attached to every event they fire
      // from here on. `getAttribution` is first-touch within the tab, so
      // this agrees with what the signup request records on the lead —
      // PostHog's own UTM parsing would disagree on a second visit.
      const attribution = getAttribution();
      if (attribution) {
        posthog.register({
          utm_source: attribution.utm_source ?? null,
          utm_medium: attribution.utm_medium ?? null,
          utm_campaign: attribution.utm_campaign ?? null,
          landing_path: attribution.landing_path ?? null,
        });
      }

      client = posthog;
    })
    .catch(() => {
      // A blocked or failed analytics bundle is not worth a console error
      // on a marketing page. Ad blockers make this a normal outcome.
    });
}

/** Capture an event. No-ops when analytics is off or still loading. */
export function track(event: AnalyticsEvent, props?: Props): void {
  client?.capture(event, props);
}

/**
 * Tie this browser to a merchant once they sign up.
 *
 * Only the account id and coarse signup context — never the email, name
 * or phone. Those live in our own database, where they belong; PostHog
 * needs to know *that* someone signed up, not who they are.
 */
export function identifySignup(userId: string, props?: Props): void {
  client?.identify(userId, props);
}
