import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import { PrimaryCta, useBi } from '../components/redesign/ui';
import { useSEO } from '../hooks/useSEO';
import { POSTS } from './blog/posts';

/** /blog/:slug — one post, `BlogPosting` JSON-LD with its real dates. */
const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const { b, lang, dir, isAr } = useBi();
  const post = POSTS.find((p) => p.slug === slug);

  useSEO({
    title: post ? `${b(post.title)} — ${isAr ? 'مدوّنة نُمُو' : 'numu blog'}` : 'Post not found — numu',
    description: post ? b(post.excerpt) : 'The requested post was not found.',
    canonical: `https://numueg.app/blog/${slug ?? ''}`,
    noIndex: !post,
  });

  if (!post) return <Navigate to={`/${lang}/404`} replace />;

  const body = post.body[lang];
  const url = `https://numueg.app/${lang}/blog/${post.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: b(post.title),
    description: b(post.excerpt),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: lang,
    mainEntityOfPage: url,
    image: 'https://numueg.app/og-image.png',
    author: { '@type': 'Organization', name: 'NUMU', url: `https://numueg.app/${lang}/about` },
    publisher: { '@id': 'https://numueg.app/#organization' },
  };

  return (
    <div className="relative min-h-screen bg-cream font-display" dir={dir}>
      <Navbar />
      <main id="main" className="pt-28 pb-20 numu-dot-surface">
        <article className="max-w-[760px] mx-auto px-5 sm:px-8">
          <Link to="/blog" className="font-mono text-xs text-navy underline underline-offset-4">
            {isAr ? 'مدوّنة نُمُو' : 'numu blog'}
          </Link>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-terracotta">
            {b(post.category)} · <span dir="ltr">{post.publishedAt}</span> · {post.readTime} {isAr ? 'دقايق قراية' : 'min read'}
          </p>
          <h1 className="mt-4 font-display text-[32px]/[1.3] sm:text-[42px]/[1.25] font-bold text-ink">{b(post.title)}</h1>
          <p className="mt-7 rounded-[6px] border-s-4 border-saffron bg-paper p-5 prose-body text-ink font-semibold leading-8">
            {b(post.excerpt)}
          </p>
          <div className="mt-8 space-y-5">
            {body.map((block, i) =>
              block.startsWith('## ') ? (
                <h2 key={i} className="pt-4 font-display text-[22px]/[1.4] font-bold text-ink">{block.slice(3)}</h2>
              ) : (
                <p key={i} className="prose-body text-ink/85 leading-8">{block}</p>
              ),
            )}
          </div>

          <aside className="mt-10 rounded-[6px] border border-ink/10 bg-paper p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-navy">{isAr ? 'اقرا كمان' : 'Read next'}</p>
            <ul className="mt-3 space-y-2">
              {post.related.map((r) => (
                <li key={r.to}>
                  <Link to={r.to} className="text-sm font-semibold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy">
                    {b(r.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <PrimaryCta />
          </div>
          <footer className="mt-10 border-t border-ink/10 pt-5 text-sm text-ink-soft/70">
            {isAr ? 'كتبه فريق نُمُو' : 'Written by the numu team'} · <span dir="ltr">{post.updatedAt ?? post.publishedAt}</span>
          </footer>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </article>
      </main>
      <footer className="bg-paper py-12"><Footer /></footer>
      <CookieConsent />
    </div>
  );
};

export default BlogPost;
