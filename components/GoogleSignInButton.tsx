import React from 'react';
import { GoogleLogin, type GoogleLoginProps } from '@react-oauth/google';
import { GoogleAuthScope } from './GoogleAuthScope';

/**
 * `<GoogleLogin>` that brings its own provider.
 *
 * A drop-in replacement for the library's `GoogleLogin`, used so the Google
 * Identity Services script is fetched at the three places a Google button
 * genuinely appears — the sign-up modal, the demo modal and `/login` — rather
 * than on every page load from a provider at the app root. See
 * `GoogleAuthScope` for what that was costing.
 *
 * All three call sites render behind `if (!isOpen) return null` or a lazy
 * route, so the provider mounts only once a person has asked to sign in.
 */
export const GoogleSignInButton: React.FC<GoogleLoginProps> = (props) => (
  <GoogleAuthScope>
    <GoogleLogin {...props} />
  </GoogleAuthScope>
);

export default GoogleSignInButton;
