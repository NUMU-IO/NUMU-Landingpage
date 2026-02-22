import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Login: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="text-center lg:text-start">
        <h2 className="text-3xl font-black text-text-main dark:text-white mb-2">{t('auth.login_title')}</h2>
        <p className="text-text-muted">{t('auth.login_subtitle')}</p>
      </div>

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.email')}</label>
          <input 
            type="email" 
            className="h-14 px-6 rounded-2xl bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50"
            placeholder={t('auth.email_placeholder')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.password')}</label>
          <input 
            type="password" 
            className="h-14 px-6 rounded-2xl bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-text-muted">{t('auth.remember_me')}</span>
          </label>
          <a href="#" className="text-primary font-bold hover:underline">{t('auth.forgot_password')}</a>
        </div>

        <button className="mt-6 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold h-14 rounded-2xl shadow-neu-flat hover:shadow-neu-flat-sm active:shadow-neu-pressed hover:scale-[1.01] transition-all flex items-center justify-center gap-2 w-full">
          <span>{t('auth.login_button')}</span>
          <span className="material-symbols-outlined rtl:rotate-180">login</span>
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
