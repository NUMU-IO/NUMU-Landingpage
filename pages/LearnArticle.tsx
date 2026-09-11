import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import { guides } from './Learn';

const REVIEWED = '2026-09-11';

const LearnArticle: React.FC = () => {
  const { slug } = useParams();
  const { language, dir } = useLanguage();
  const isAr = language === 'ar';
  const guide = guides.find((item) => item.slug === slug);

  useSEO({
    title: guide
      ? `${isAr ? guide.title_ar : guide.title_en} — ${isAr ? 'أكاديمية نُمُو' : 'numu Academy'}`
      : 'Guide not found — numu',
    description: guide
      ? (isAr ? guide.body_ar[0] : guide.body_en[0])
      : 'The requested guide was not found.',
    canonical: `https://numueg.app/learn/${slug ?? ''}`,
    noIndex: !guide,
  });

  if (!guide) return <Navigate to={`/${language}/404`} replace />;

  const title = isAr ? guide.title_ar : guide.title_en;
  const body = isAr ? guide.body_ar : guide.body_en;
  const tip = isAr ? guide.tip_ar : guide.tip_en;
  const url = `https://numueg.app/${language}/learn/${guide.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: body[0],
    datePublished: REVIEWED,
    dateModified: REVIEWED,
    inLanguage: language,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'NUMU Editorial Team', url: `https://numueg.app/${language}/about` },
    publisher: { '@id': 'https://numueg.app/#organization' },
  };

  return (
    <div className="relative min-h-screen bg-cream font-display" dir={dir}>
      <Navbar />
      <main id="main" className="pt-28 pb-20 numu-dot-surface">
        <article className="max-w-[820px] mx-auto px-5 sm:px-8">
          <Link to="/learn" className="font-mono text-xs text-navy underline underline-offset-4">
            {isAr ? 'أكاديمية نُمُو' : 'numu Academy'}
          </Link>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-terracotta">
            {isAr ? guide.category_ar : guide.category_en} · {guide.readTime} {isAr ? 'دقايق قراية' : 'min read'}
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold leading-tight text-ink">{title}</h1>
          <p className="mt-7 rounded-[6px] border-s-4 border-saffron bg-paper p-5 prose-body text-ink font-semibold leading-8">
            {body[0]}
          </p>
          <div className="mt-8 space-y-5">
            {body.slice(1).map((paragraph, index) => (
              <p key={index} className="prose-body text-ink/85 leading-8">{paragraph}</p>
            ))}
          </div>
          {tip && (
            <aside className="mt-9 rounded-[6px] border border-ink/10 bg-paper p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-navy">
                {isAr ? 'ملاحظة نُمُو' : 'NUMU NOTE'}
              </p>
              <p className="mt-2 prose-body-sm text-ink/80">{tip}</p>
            </aside>
          )}
          <footer className="mt-10 border-t border-ink/10 pt-5 text-sm text-ink-soft/70">
            {isAr ? 'كتبه وراجعه فريق منتج نُمُو · آخر مراجعة ١١ سبتمبر ٢٠٢٦' : 'Written and reviewed by the NUMU product team · Last reviewed 11 September 2026'}
          </footer>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </article>
      </main>
      <footer className="bg-paper py-12"><Footer /></footer>
      <CookieConsent />
    </div>
  );
};

export default LearnArticle;
