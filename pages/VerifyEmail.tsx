import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { verifyEmailByCode, verifyEmailByToken, resendVerificationEmail } from '../services/authApi';

const RESEND_COOLDOWN = 60; // seconds

const VerifyEmail: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get email from query params (passed from login/signup)
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token');

  // Auto-verify if token is in URL (from email link)
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    verifyEmailByToken(token)
      .then(() => navigate('/waitlist', { replace: true }))
      .catch((err) => {
        setError(err.message || 'Verification failed');
        setLoading(false);
      });
  }, [token, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
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
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
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
      navigate('/waitlist', { replace: true });
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
    if (fullCode.length === 6) {
      submitCode(fullCode);
    }
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

  // Show loading state while verifying via token link
  if (token && loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-text-muted text-sm">{t('verify.checking_link')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-8">
      <div className="text-center lg:text-start">
        <h2 className="text-2xl sm:text-3xl font-black text-text-main dark:text-white mb-2">
          {t('verify.title')}
        </h2>
        <p className="text-text-muted text-sm sm:text-base">
          {t('verify.subtitle')} {email && <span className="font-semibold text-text-main">{email}</span>}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 lg:gap-6">
        <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 dir-ltr" dir="ltr">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-lg sm:text-xl md:text-2xl font-bold rounded-xl sm:rounded-2xl bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8),0_0_0_2px_rgba(30,64,175,0.3)] outline-none transition-all text-text-main"
              disabled={loading}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || code.some((d) => !d)}
          className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold h-12 sm:h-14 rounded-2xl shadow-neu-flat hover:shadow-neu-flat-sm active:shadow-neu-pressed hover:scale-[1.01] transition-all flex items-center justify-center gap-2 w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{t('verify.submit')}</span>
              <span className="material-symbols-outlined">verified</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="text-sm text-primary font-bold hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
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
