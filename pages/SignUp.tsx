import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const SignUp: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-5 lg:gap-8">
      <div className="text-center lg:text-start">
        <h2 className="text-3xl font-black text-text-main dark:text-white mb-2">{t('auth.signup_title')}</h2>
        <p className="text-text-muted">{t('auth.signup_subtitle')}</p>
      </div>

      <form className="flex flex-col gap-4 lg:gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.name')}</label>
          <input 
            type="text" 
            className="h-16 px-8 rounded-full bg-background-light dark:bg-background-dark border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_6px_6px_12px_rgba(163,177,198,0.6),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50 text-lg"
            placeholder={t('auth.name_placeholder')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.email')}</label>
          <input 
            type="email" 
            className="h-16 px-8 rounded-full bg-background-light dark:bg-background-dark border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_6px_6px_12px_rgba(163,177,198,0.6),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50 text-lg"
            placeholder={t('auth.email_placeholder')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white">{t('auth.password')}</label>
          <input 
            type="password" 
            className="h-16 px-8 rounded-full bg-background-light dark:bg-background-dark border-none shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] focus:shadow-[inset_6px_6px_12px_rgba(163,177,198,0.6),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50 text-lg"
            placeholder="••••••••"
          />
        </div>

        <button className="mt-8 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold h-16 rounded-full shadow-neu-flat hover:shadow-neu-flat-sm active:shadow-neu-pressed hover:scale-[1.01] transition-all flex items-center justify-center gap-2 w-full text-lg">
          <span>{t('auth.signup_button')}</span>
          <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
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
