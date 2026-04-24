import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  verifyEmailByCode,
  verifyEmailByToken,
  resendVerificationEmail,
} from '../services/authApi';
import { useSEO } from '../hooks/useSEO';

const RESEND_COOLDOWN = 60; // seconds
const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || 'https://merchant.numueg.app';

const VerifyEmail: React.FC = () => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  useSEO({
    title: isAr ? 'تأكيد البريد الإلكتروني — نُمُو' : 'Verify email — numu',
    description: isAr
      ? 'أكّد بريدك الإلكتروني على حسابك في نُمُو.'
      : 'Verify your numu account email address.',
    canonical: 'https://numueg.app/verify-email',
    noIndex: true,
  });
  const [searchParams] = useSearchParams();

  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    verifyEmailByToken(token)
      .then(() => {
        window.location.href = DASHBOARD_URL;
      })
      .catch((err) => {
        setError(err.message || 'Verification failed');
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((n) => n - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (digit && index === 5 && next.every((d) => d)) {
      submitCode(next.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill('');
    pasted.split('').forEach((ch, i) => {
      next[i] = ch;
    });
    setCode(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) {
      submitCode(pasted);
    }
  };

  const submitCode = async (fullCode: string) => {
    setError('');
    setLoading(true);
    try {
      await verifyEmailByCode(fullCode);
      window.location.href = DASHBOARD_URL;
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setCode(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) submitCode(fullCode);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await resendVerificationEmail();
      setResendTimer(RESEND_COOLDOWN);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend');
    }
  };

  if (token && loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 rounded-full border-2 border-navy/30 border-t-navy animate-spin" />
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/75">
          {t('verify.checking_link')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center lg:text-start">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
          § VERIFY
        </span>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-2">
          {t('verify.title')}
        </h2>
        <p className="prose-body text-ink/75">
          {t('verify.subtitle')}{' '}
          {email && (
            <span className="font-display font-semibold text-navy" dir="ltr">
              {email}
            </span>
          )}
        </p>
      </div>

      {error && (
        <p className="font-mono text-[11px] text-terracotta bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex justify-center gap-2 sm:gap-3" dir="ltr">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-11 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center font-display text-xl sm:text-2xl md:text-3xl font-bold rounded-[4px] bg-cream border border-ink/25 text-ink focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu tabular-nums disabled:opacity-50"
              disabled={loading}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || code.some((d) => !d)}
          className="group bg-navy text-cream font-semibold h-12 sm:h-14 rounded-[4px] hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center justify-center gap-3 w-full disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? (
            <span className="size-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
          ) : (
            <>
              <span>{t('verify.submit')}</span>
              <span
                aria-hidden="true"
                className="text-lg text-saffron rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
              >
                →
              </span>
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta hover:text-navy font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendTimer > 0
            ? `${t('verify.resend_cooldown')} ${resendTimer}s`
            : t('verify.resend')}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
