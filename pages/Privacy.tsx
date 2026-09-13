import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const sections = [
  { title: 'legal.title', text: 'legal.text', accent: 'terracotta' as const },
  { title: 'privacy.collect_title', text: 'privacy.collect_text', accent: 'navy' as const },
  { title: 'privacy.use_title', text: 'privacy.use_text', accent: 'saffron' as const },
  { title: 'privacy.protect_title', text: 'privacy.protect_text', accent: 'sage' as const },
  { title: 'privacy.cookies_title', text: 'privacy.cookies_text', accent: 'terracotta' as const },
  { title: 'privacy.rights_title', text: 'privacy.rights_text', accent: 'navy' as const },
  { title: 'privacy.contact_title', text: 'privacy.contact_text', accent: 'saffron' as const },
];

const accentBar: Record<string, string> = {
  navy: 'bg-navy',
  saffron: 'bg-saffron',
  sage: 'bg-sage',
  terracotta: 'bg-terracotta',
};

const Privacy: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const isAr = language === 'ar';

  useSEO({
    title: isAr ? 'سياسة الخصوصية — نُمُو' : 'Privacy policy — numu',
    description: isAr
      ? 'إزاي نُمُو بيجمع ويستخدم ويحمي بياناتك الشخصية على منصة التجارة الإلكترونية لمصر والشرق الأوسط.'
      : 'How numu collects, uses, and protects your personal data across our commerce platform for Egypt and MENA.',
    canonical: 'https://numueg.app/privacy',
  });

  return (
    <div className="min-h-screen bg-cream paper-grain" dir={dir}>
      <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 border-b border-ink/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label={isAr ? 'نُمُو — الرئيسية' : 'numu — home'}
        >
          <img
            src="/numu-mark-cream.webp"
            alt=""
            className="h-8 w-auto object-contain"
            width="40"
            height="40"
          />
          {isAr ? (
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              نُمُو
            </span>
          ) : (
            <span className="font-display text-lg font-semibold tracking-tight text-ink lowercase">
              numu
            </span>
          )}
        </Link>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80 hover:text-navy transition-colors"
        >
          ← {isAr ? 'الرئيسية' : 'Home'}
        </Link>
      </nav>

      <div className="relative z-10 text-center px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-saffron/15 border border-saffron/40 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-saffron" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-saffron uppercase tracking-[0.18em]">
            § PRIVACY · {t('privacy.last_updated')}: {isAr ? 'مارس ٢٠٢٦' : 'March 2026'}
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {t('privacy.title')}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {t('privacy.intro')}
        </p>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="flex flex-col gap-3">
          {sections.map(({ title, text, accent }, i) => (
            <article
              key={title}
              className="relative bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-7 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu"
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 start-0 w-10 h-[3px] ${accentBar[accent]}`}
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 font-semibold mb-1">
                § {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="font-display text-lg sm:text-xl font-semibold text-ink tracking-tight mb-2">
                {t(title)}
              </h2>
              <p className="prose-body text-ink/80">{t(text)}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
