import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { register } from '../services/authApi';

const SignUp: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Split single name into first_name / last_name
    const trimmed = name.trim();
    const spaceIdx = trimmed.indexOf(' ');
    const first_name = spaceIdx > 0 ? trimmed.slice(0, spaceIdx) : trimmed;
    const last_name = spaceIdx > 0 ? trimmed.slice(spaceIdx + 1) : trimmed;

    try {
      await register({ email, password, first_name, last_name });
      window.location.href = import.meta.env.VITE_DASHBOARD_URL;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 lg:gap-8">
      <div className="text-center lg:text-start">
        <h2 className="text-2xl sm:text-3xl font-black text-text-main dark:text-white mb-2">{t('auth.signup_title')}</h2>
        <p className="text-text-muted text-sm sm:text-base">{t('auth.signup_subtitle')}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.name')}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 sm:h-14 lg:h-16 px-5 sm:px-6 lg:px-8 rounded-2xl lg:rounded-full bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] sm:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] sm:focus:shadow-[inset_6px_6px_12px_rgba(163,177,198,0.6),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50 text-base lg:text-lg"
            placeholder={t('auth.name_placeholder')}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.email')}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 sm:h-14 lg:h-16 px-5 sm:px-6 lg:px-8 rounded-2xl lg:rounded-full bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] sm:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] sm:focus:shadow-[inset_6px_6px_12px_rgba(163,177,198,0.6),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50 text-base lg:text-lg"
            placeholder={t('auth.email_placeholder')}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.password')}</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 sm:h-14 lg:h-16 px-5 sm:px-6 lg:px-8 rounded-2xl lg:rounded-full bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] sm:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] sm:focus:shadow-[inset_6px_6px_12px_rgba(163,177,198,0.6),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50 text-base lg:text-lg"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 sm:mt-6 lg:mt-8 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold h-12 sm:h-14 lg:h-16 rounded-2xl lg:rounded-full shadow-neu-flat hover:shadow-neu-flat-sm active:shadow-neu-pressed hover:scale-[1.01] transition-all flex items-center justify-center gap-2 w-full text-base lg:text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{t('auth.signup_button')}</span>
              <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-text-muted">
        {t('auth.already_have_account')} {' '}
        <Link to="/login" className="text-primary font-bold hover:underline">
          {t('auth.login_link')}
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
