import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initCSRF } from './services/csrf';
import { initMonitoring } from './services/heronsignal';
import './index.css';

// Real-user monitoring starts before render (and before the CSRF round-trip)
// so a failure in either one still lands in a session. The tracker itself is
// injected asynchronously, so this costs nothing on the critical path.
initMonitoring();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Fetch CSRF token before rendering — non-blocking on failure
initCSRF().finally(() => {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
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
