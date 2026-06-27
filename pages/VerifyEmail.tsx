import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || 'https://merchant.numueg.app';

/**
 * VerifyEmail (landing) — pure forwarder to the merchant hub.
 *
 * Email verification must happen on the merchant hub origin: that's where
 * the authenticated session lives and where the canonical verify + onboarding
 * flow runs. Doing it from the landing origin was unreliable (the
 * authenticated /auth/verify-email-code call failed with "Failed to fetch").
 *
 * Anyone who lands here — clicking the link in the verification email
 * (`/verify-email?token=…`), an older sign-up redirect, or a login by an
 * unverified user — is forwarded to `<hub>/verify-email` with the same query
 * string (so the `?token=…` auto-verifies on the hub). The shared
 * `.numueg.app` session cookie means the hub already recognises the account.
 */
const VerifyEmail: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    const target = `${DASHBOARD_URL}/verify-email${qs ? `?${qs}` : ''}`;
    window.location.replace(target);
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <div className="size-10 rounded-full border-2 border-navy/30 border-t-navy animate-spin" />
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/75">
        {isAr ? 'جاري التحويل لتأكيد البريد…' : 'Redirecting to verify your email…'}
      </p>
    </div>
  );
};

export default VerifyEmail;
