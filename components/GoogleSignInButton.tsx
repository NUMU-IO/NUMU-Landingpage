import React, { useLayoutEffect, useRef, useState } from 'react';
import { GoogleLogin, type GoogleLoginProps } from '@react-oauth/google';
import { GoogleAuthScope } from './GoogleAuthScope';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Instagram, Facebook and TikTok open links in their own webviews, where
 * Google refuses OAuth outright ("disallowed_useragent"). Most of the
 * landing's paid traffic arrives through exactly those apps.
 */
const IN_APP_BROWSER = /Instagram|FBAN|FBAV|FB_IAB|BytedanceWebview|musical_ly/i;

/**
 * `<GoogleLogin>` that brings its own provider.
 *
 * A drop-in replacement for the library's `GoogleLogin`, used so the Google
 * Identity Services script is fetched at the two places a Google button
 * genuinely appears — the sign-up modal and `/login` — rather
 * than on every page load from a provider at the app root. See
 * `GoogleAuthScope` for what that was costing.
 *
 * All three call sites render behind `if (!isOpen) return null` or a lazy
 * route, so the provider mounts only once a person has asked to sign in.
 *
 * GIS only takes a pixel width (it ignores "100%" and logs an error), so the
 * button is sized to its container, capped at Google's 400px maximum. Inside
 * an in-app browser it is replaced by a hint to open the page in a real one.
 */
export const GoogleSignInButton: React.FC<GoogleLoginProps> = (props) => {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const inApp = typeof navigator !== 'undefined' && IN_APP_BROWSER.test(navigator.userAgent);

  useLayoutEffect(() => {
    setWidth(Math.min(400, ref.current?.clientWidth ?? 0));
  }, []);

  if (inApp) {
    return (
      <p className="font-mono text-[11px] text-center leading-relaxed">
        {language === 'ar'
          ? 'افتح الصفحة في المتصفح (Chrome / Safari) عشان تسجّل بجوجل.'
          : 'Open this page in your browser (Chrome / Safari) to sign in with Google.'}
      </p>
    );
  }

  return (
    <div ref={ref} className="w-full flex justify-center">
      {width > 0 && (
        <GoogleAuthScope>
          <GoogleLogin {...props} width={width} />
        </GoogleAuthScope>
      )}
    </div>
  );
};

export default GoogleSignInButton;
