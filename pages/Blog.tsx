import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell, PageSection, PageClose } from '../components/redesign/PageShell';
import { PrimaryCta, useBi } from '../components/redesign/ui';
import { POSTS } from './blog/posts';

/**
 * /blog — dated posts: market notes, product explainers, seasonal prep, and
 * (with consent) merchant stories. Evergreen how-tos stay in /learn.
 * Newest first. Data: `pages/blog/posts.ts`.
 */
const Blog: React.FC = () => {
  const { b } = useBi();
  const posts = [...POSTS].sort((x, y) => y.publishedAt.localeCompare(x.publishedAt));

  return (
    <PageShell
      slug="blog"
      eyebrow={{ ar: 'المدوّنة', en: 'Blog' }}
      heading={{ ar: 'كلام تجارة، من غير لف ودوران.', en: 'Commerce talk, straight.' }}
      lead={{
        ar: 'الدفع عند الاستلام، الشحن، المحافظ، المواسم، وجديد نُمُو — مكتوبة للسوق المصري.',
        en: 'Cash on delivery, shipping, wallets, seasons and what is new in numu — written for the Egyptian market.',
      }}
      title={{ ar: 'مدوّنة نُمُو — تجارة إلكترونية في مصر', en: 'numu blog — e-commerce in Egypt' }}
      description={{
        ar: 'مقالات عملية للتاجر المصري: الدفع عند الاستلام، شركات الشحن، فودافون كاش وإنستاباي، الدومين الخاص، وتجهيز المواسم.',
        en: 'Practical articles for Egyptian merchants: cash on delivery, couriers, Vodafone Cash and InstaPay, custom domains and seasonal prep.',
      }}
    >
      <PageSection surface="paper">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/blog/${p.slug}`}
                className="group flex h-full flex-col rounded-[10px] border border-ink/12 bg-cream p-6 transition-colors hover:border-navy/35
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-terracotta">
                  {b(p.category)} · <span dir="ltr">{p.publishedAt}</span>
                </p>
                <h2 className="mt-3 font-display text-[19px]/[1.4] font-bold text-ink group-hover:text-navy">{b(p.title)}</h2>
                <p className="prose-body-sm mt-3 flex-1 text-ink-soft/85">{b(p.excerpt)}</p>
                <p className="mt-5 text-sm font-semibold text-navy">
                  {b({ ar: 'اقرا المقال', en: 'Read the post' })}
                  <span aria-hidden="true" className="ms-1.5 inline-block rtl:rotate-180">→</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageClose
        heading={{ ar: 'قريت كفاية؟ جرّب بنفسك.', en: 'Read enough? Try it yourself.' }}
        support={{ ar: 'افتح متجرك من غير بطاقة ائتمان.', en: 'Open your store with no credit card.' }}
        action={<PrimaryCta onDark />}
      />
    </PageShell>
  );
};

export default Blog;
