import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const API_BASE = import.meta.env.VITE_API_URL || 'https://numueg.app/api/v1';

const Contact: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', city: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useSEO({
    title: 'Contact NUMU — Get Help with Your Egypt & MENA E-commerce Store',
    description: 'Reach out to the NUMU team for support, partnership inquiries, or questions about our e-commerce platform for Egypt and MENA. We respond in Arabic and English.',
    canonical: 'https://numueg.app/contact',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API_BASE}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const inputClass = "h-12 sm:h-14 px-5 sm:px-6 rounded-2xl bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50";

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col" dir={dir}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-5">
        <Link to="/">
          <img src={language === 'ar' ? '/numu-logo-ar.webp' : '/numu-logo-en.webp'} alt="NUMU" width="120" height="32" className="h-8 w-auto object-contain" />
        </Link>
        <Link to="/" className="text-sm text-text-muted hover:text-primary font-medium transition-colors">
          {t('waitlist.back_home')}
        </Link>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-text-main dark:text-white mb-3">
              {t('contact.title')}
            </h1>
            <p className="text-text-muted text-base">{t('contact.subtitle')}</p>
          </div>

          {status === 'sent' ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-5 rounded-2xl text-center text-sm">
              <span className="material-symbols-outlined text-3xl mb-2 block">check_circle</span>
              {t('contact.success')}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-text-main dark:text-white">{t('contact.name')}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder={t('contact.name_placeholder')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-text-main dark:text-white">{t('contact.email')}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder={t('contact.email_placeholder')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-text-main dark:text-white">{t('contact.phone')}</label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                  placeholder={t('contact.phone_placeholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-text-main dark:text-white">{t('contact.country')}</label>
                  <input
                    type="text"
                    required
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className={inputClass}
                    placeholder={t('contact.country_placeholder')}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-text-main dark:text-white">{t('contact.city')}</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={inputClass}
                    placeholder={t('contact.city_placeholder')}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-text-main dark:text-white">{t('contact.message')}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="px-5 sm:px-6 py-4 rounded-2xl bg-background-light dark:bg-background-dark border-none shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] outline-none transition-all text-text-main placeholder:text-text-muted/50 resize-none"
                  placeholder={t('contact.message_placeholder')}
                />
              </div>

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
                  {t('contact.error')}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-2 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold h-12 sm:h-14 rounded-2xl shadow-neu-flat hover:shadow-neu-flat-sm active:shadow-neu-pressed hover:scale-[1.01] transition-all flex items-center justify-center gap-2 w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <div className="size-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span>{t('contact.send')}</span>
                    <span className="material-symbols-outlined rtl:rotate-180">send</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Direct contact */}
          <div className="text-center flex flex-col gap-3 pt-4 border-t border-gray-200/50">
            <p className="text-xs font-bold uppercase tracking-widest text-text-muted">{t('contact.or_reach')}</p>
            <div className="flex justify-center gap-6 text-sm text-text-muted">
              <a href="mailto:hello@numueg.app" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">mail</span>
                hello@numueg.app
              </a>
            </div>
            <div className="flex justify-center gap-4 mt-1">
              <a href="https://www.instagram.com/numu_eg/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="size-11 rounded-full shadow-neu-flat-sm flex items-center justify-center hover:text-primary active:shadow-neu-pressed transition-all hover:scale-110 text-text-muted">
                <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" fillRule="evenodd"></path></svg>
              </a>
              <a href="https://x.com/numueg" target="_blank" rel="noopener noreferrer" aria-label="X" className="size-11 rounded-full shadow-neu-flat-sm flex items-center justify-center hover:text-primary active:shadow-neu-pressed transition-all hover:scale-110 text-text-muted">
                <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              </a>
              <a href="https://www.linkedin.com/in/numueg" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="size-11 rounded-full shadow-neu-flat-sm flex items-center justify-center hover:text-primary active:shadow-neu-pressed transition-all hover:scale-110 text-text-muted">
                <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
