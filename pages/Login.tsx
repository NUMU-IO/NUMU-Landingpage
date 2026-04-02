import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { login, forgotPassword } from '../services/authApi';
import { useSEO } from '../hooks/useSEO';

const Login: React.FC = () => {
  const { t } = useLanguage();
  useSEO({ title: 'Login — NUMU', description: 'Sign in to your NUMU merchant account.', canonical: 'https://numueg.app/login', noIndex: true });
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.user?.is_verified) {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        // Redirect to merchant dashboard (separate app)
        const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL || 'https://dashboard.numueg.app';
        window.location.href = dashboardUrl;
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);

    try {
      await forgotPassword(forgotEmail);
      setForgotSent(true);
    } catch (err: any) {
      setForgotError(err.message || 'Request failed');
    } finally {
      setForgotLoading(false);
    }
  };

  if (showForgot) {
    return (
      <div className="flex flex-col gap-5 lg:gap-8">
        <div className="text-center lg:text-start">
          <h2 className="text-2xl sm:text-3xl font-black text-text-main dark:text-white mb-2">{t('auth.forgot_title')}</h2>
          <p className="text-text-muted text-sm sm:text-base">{t('auth.forgot_subtitle')}</p>
        </div>

        {forgotSent ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl text-sm">
            {t('auth.forgot_success')}
          </div>
        ) : (
          <>
            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.email')}</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="h-12 sm:h-14 px-5 sm:px-6 rounded-2xl bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50"
                  placeholder={t('auth.email_placeholder')}
                />
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="mt-4 sm:mt-6 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold h-12 sm:h-14 rounded-2xl shadow-neu-flat hover:shadow-neu-flat-sm active:shadow-neu-pressed hover:scale-[1.01] transition-all flex items-center justify-center gap-2 w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {forgotLoading ? (
                  <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{t('auth.forgot_send')}</span>
                )}
              </button>
            </form>
          </>
        )}

        <button
          type="button"
          onClick={() => { setShowForgot(false); setForgotSent(false); setForgotError(''); }}
          className="text-center text-sm text-primary font-bold hover:underline"
        >
          {t('auth.forgot_back')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-8">
      <div className="text-center lg:text-start">
        <h2 className="text-2xl sm:text-3xl font-black text-text-main dark:text-white mb-2">{t('auth.login_title')}</h2>
        <p className="text-text-muted text-sm sm:text-base">{t('auth.login_subtitle')}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.email')}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 sm:h-14 px-5 sm:px-6 rounded-2xl bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50"
            placeholder={t('auth.email_placeholder')}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.password')}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 sm:h-14 px-5 sm:px-6 rounded-2xl bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-end text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => { setShowForgot(true); setForgotEmail(email); }}
            className="text-primary font-bold hover:underline"
          >
            {t('auth.forgot_password')}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 sm:mt-6 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold h-12 sm:h-14 rounded-2xl shadow-neu-flat hover:shadow-neu-flat-sm active:shadow-neu-pressed hover:scale-[1.01] transition-all flex items-center justify-center gap-2 w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{t('auth.login_button')}</span>
              <span className="material-symbols-outlined rtl:rotate-180">login</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-text-muted">
        {t('auth.dont_have_account')} {' '}
        <Link to="/signup" className="text-primary font-bold hover:underline">
          {t('auth.signup_link')}
        </Link>
      </div>
    </div>
  );
};

export default Login;
