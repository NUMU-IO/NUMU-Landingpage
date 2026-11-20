import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { preloadRoute } from './App';
import { initMonitoring } from './services/heronsignal';
import { initAnalytics } from './lib/analytics';
import './index.css';

// Real-user monitoring starts before render so a failure during boot still
// lands in a session. The tracker itself is injected asynchronously, so this
// costs nothing on the critical path.
initMonitoring();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// The prerendered page is already on screen, so nothing is gained by rendering
// early. Load this route's code first: React's first commit then paints the
// same page, instead of replacing it with a spinner until the chunk arrives.
preloadRoute(window.location.pathname).finally(() => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

// Lazy-load Sentry AFTER render during idle time (saves ~40KB from critical path)
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  const initSentry = () => {
    import('@sentry/react').then((Sentry) => {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
        release: import.meta.env.VITE_SENTRY_RELEASE,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 0.1,
        beforeSend(event) {
          if (event.request?.headers) {
            for (const h of ["Authorization","authorization","Cookie","cookie","Set-Cookie","set-cookie","X-CSRF-Token","x-csrf-token"]) {
              delete event.request.headers[h];
            }
          }
          if (event.request?.cookies) event.request.cookies = {};
          if (event.user?.email) delete event.user.email;
          if (event.breadcrumbs) {
            for (const b of event.breadcrumbs) {
              if (b.data) {
                delete b.data["Authorization"];
                delete b.data["authorization"];
                delete b.data["Cookie"];
                delete b.data["cookie"];
                if (typeof b.data.url === "string") {
                  b.data.url = b.data.url.replace(
                    /([?&])(token|session_id|access_token|refresh_token)=[^&]*/gi,
                    "$1$2=[REDACTED]"
                  );
                }
              }
            }
          }
          return event;
        },
      });
    });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(initSentry);
  } else {
    setTimeout(initSentry, 2000);
  }
}

// PostHog, on the same terms as Sentry: after render, on idle, off unless
// a key is configured. Product analytics is never worth the LCP we spent
// real effort winning back.
//
// `initAnalytics` is imported statically on purpose. The modal components
// import it too, so a dynamic import here cannot split it into its own
// chunk — it would only add a build warning for no benefit. The weight
// that actually matters is the PostHog SDK, and that stays behind a
// dynamic import *inside* initAnalytics, so it never touches the critical
// path. PostHog buffers anything captured before it finishes loading, so
// events fired in that window are not lost.
if (import.meta.env.VITE_POSTHOG_KEY) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initAnalytics());
  } else {
    setTimeout(initAnalytics, 2000);
  }
}
