import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import { initCSRF } from './services/csrf';
import './index.css';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
  release: import.meta.env.VITE_SENTRY_RELEASE,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  enabled: !!import.meta.env.VITE_SENTRY_DSN,

  beforeSend(event) {
    if (event.request?.headers) {
      const sensitiveHeaders = [
        "Authorization", "authorization",
        "Cookie", "cookie",
        "Set-Cookie", "set-cookie",
        "X-CSRF-Token", "x-csrf-token",
      ];
      for (const header of sensitiveHeaders) {
        delete event.request.headers[header];
      }
    }
    if (event.request?.cookies) {
      event.request.cookies = {};
    }
    if (event.user?.email) {
      delete event.user.email;
    }
    if (event.breadcrumbs) {
      for (const breadcrumb of event.breadcrumbs) {
        if (breadcrumb.data) {
          delete breadcrumb.data["Authorization"];
          delete breadcrumb.data["authorization"];
          delete breadcrumb.data["Cookie"];
          delete breadcrumb.data["cookie"];
          if (typeof breadcrumb.data.url === "string") {
            breadcrumb.data.url = breadcrumb.data.url.replace(
              /([?&])(token|session_id|access_token|refresh_token)=[^&]*/gi,
              "$1$2=[REDACTED]",
            );
          }
        }
      }
    }
    return event;
  },
});

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