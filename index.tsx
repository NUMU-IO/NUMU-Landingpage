import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initCSRF } from './services/csrf';

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