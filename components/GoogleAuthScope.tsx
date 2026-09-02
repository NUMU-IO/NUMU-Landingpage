import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Mounts Google Identity Services **only where a Google button is actually
 * rendered**, instead of once at the app root.
 *
 * `GoogleOAuthProvider` injects `https://accounts.google.com/gsi/client` the
 * moment it mounts — there is no lazy mode. Wrapping the whole app in it meant
 * every visitor to every page paid for it before they had shown any interest
 * in signing in:
 *
 *   - **99 KiB of script**, fetched at High priority inside the window that
 *     decides First Contentful Paint;
 *   - **nine third-party cookies** for anyone with a live Google session
 *     (`__Secure-OSID`, `__Secure-3PSID`, `NID`, …). That is the entire reason
 *     Lighthouse's `third-party-cookies` audit fails — weight 5 of the 26 in
 *     Best Practices — plus a Cookie entry in `inspector-issues`;
 *   - a tag baked into the **prerendered HTML**, because the prerenderer
 *     rendered the provider too, so the script was in the served markup rather
 *     than merely injected at runtime.
 *
 * Every consumer of `<GoogleLogin>` is behind a gate that renders nothing until
 * a person opens it — the sign-up modal, the demo modal and the `/login` route
 * all return `null` while closed. So the provider belongs *inside* them: a
 * visitor who never opens sign-in never loads Google, and one who does gets the
 * script at exactly the moment it becomes useful.
 *
 * Safe to use more than once. The library de-duplicates by looking for the
 * existing `<script>` before appending, so several scopes mounting and
 * unmounting over a session still results in one download.
 */
export const GoogleAuthScope: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>
);

export default GoogleAuthScope;
