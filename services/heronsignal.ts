/**
 * HeronSignal — real-user monitoring for the marketing site.
 *
 * Complements Sentry rather than replacing it: Sentry answers "what threw and
 * where in the bundle", HeronSignal answers "what was the visitor doing, what
 * did the network do, and where did the funnel leak". Both stay installed.
 *
 * Two things are deliberately guarded here:
 *
 * 1. `build:ssg` renders every route through headless Chrome against
 *    http://localhost:4173. Without the host check below, each production
 *    build would manufacture a full set of fake sessions from the CI machine
 *    and pollute funnels. It would also risk stalling the prerender, which
 *    waits on `networkidle0` — a live telemetry connection is never idle.
 *
 * 2. `initHeronSignal` REJECTS (not resolves) when publicKey is missing, so an
 *    unset env var would surface as an unhandled rejection on every page load.
 *
 * The public key is safe to expose — it only authorizes writes to this
 * workspace's ingest endpoint. The *server* token (@heronsignal/node) is the
 * secret one and must never reach this bundle.
 */
import {
  captureError as sdkCaptureError,
  event as sdkEvent,
  initHeronSignal,
  log as sdkLog,
  type HeronSignalLogLevel,
  type HeronSignalPayload,
} from '@heronsignal/web';

const PUBLIC_KEY = import.meta.env.VITE_HERONSIGNAL_PUBLIC_KEY as string | undefined;

/** Local dev and the prerender crawler must never emit telemetry. */
function isTrackableHost(): boolean {
  if (typeof window === 'undefined') return false;
  const { hostname } = window.location;
  return (
    hostname !== 'localhost' &&
    hostname !== '127.0.0.1' &&
    hostname !== '[::1]' &&
    !hostname.endsWith('.local')
  );
}

let enabled = false;

/** Call once, as early as possible, so first-paint errors are still captured. */
export function initMonitoring(): void {
  if (!PUBLIC_KEY || !isTrackableHost()) return;

  enabled = true;

  // Fire-and-forget: the tracker is injected async and must never delay render
  // or reject into the console if the CDN is unreachable / blocked by an
  // ad-blocker.
  void initHeronSignal({ publicKey: PUBLIC_KEY }).catch(() => {
    enabled = false;
  });
}

/**
 * The wrappers below no-op when monitoring is off. The SDK would otherwise
 * queue every call on `window.heronsignal.q` forever waiting for a tracker
 * that is never going to load.
 */

/** Business/funnel event, e.g. `event('waitlist_joined', { source: 'modal' })`. */
export function event(name: string, payload?: HeronSignalPayload): void {
  if (!enabled) return;
  sdkEvent(name, payload);
}

/** Structured log line attached to the visitor's session. */
export function log(
  level: HeronSignalLogLevel,
  message: string,
  data?: HeronSignalPayload,
): void {
  if (!enabled) return;
  sdkLog(level, message, data);
}

/** Report a handled or boundary-caught error against the session. */
export function captureError(error: Error | string): void {
  if (!enabled) return;
  sdkCaptureError(error);
}
