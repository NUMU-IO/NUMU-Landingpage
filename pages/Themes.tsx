import React from 'react';
import { PageShell, PageSection, PageClose } from '../components/redesign/PageShell';
import { PrimaryCta, SecondaryCta, useBi } from '../components/redesign/ui';
import { Reveal } from '../components/redesign/Reveal';
import { THEMES, ThemeEntry } from '../components/redesign/themesData';

/**
 * /themes — the real V3 theme catalogue.
 *
 * ─── Why this page was rebuilt ────────────────────────────────────────────
 * The previous version drew its own storefronts in CSS: invented shop names
 * ("ليلى سكين", "كشري كو"), invented products and invented prices, rendered
 * as coloured blocks. None of it corresponded to a NUMU theme, so a merchant
 * choosing from that page could not tell what they would actually get.
 *
 * Every card here is now backed by real data:
 *   • name and description come from the theme's own `theme.json` manifest;
 *   • the preview is the published marketplace thumbnail from
 *     cdn.numueg.app — the same rendered screenshot the merchant dashboard
 *     shows under Online store → Themes.
 *
 * ─── No categories ────────────────────────────────────────────────────────
 * The old page had category tabs (عطور · أزياء · جمال · طعام · إلكترونيات ·
 * مجوهرات). The themes have not been categorised, so those tabs asserted a
 * taxonomy nobody approved and filtered on a field that does not exist. They
 * are gone, and no grouping, badge or label replaces them.
 *
 * ─── Honest gaps ──────────────────────────────────────────────────────────
 * Two themes have no published thumbnail yet. They still appear — they are
 * real themes — but with a neutral panel rather than another theme's
 * screenshot standing in for them.
 */

const ThemeCard: React.FC<{ theme: ThemeEntry; priority: boolean }> = ({ theme, priority }) => {
  const { b } = useBi();

  return (
    <figure className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-ink/12 bg-cream">
      <div className="relative overflow-hidden border-b border-ink/10 bg-bone/40">
        {theme.previewUrl ? (
          <img
            src={theme.previewUrl}
            alt={b({
              ar: `معاينة قالب ${theme.name}`,
              en: `Preview of the ${theme.name} theme`,
            })}
            width={1366}
            height={900}
            /* The first row is above the fold on most desktops; the rest wait. */
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="aspect-[1366/900] w-full object-cover object-top transition-transform
              duration-500 ease-numu group-hover:scale-[1.02] motion-reduce:transform-none"
          />
        ) : (
          /* No published thumbnail — a neutral panel, never another theme's
             screenshot pretending to be this one. */
          <div
            className="flex aspect-[1366/900] w-full items-center justify-center bg-bone/60"
            role="img"
            aria-label={b({
              ar: `لسه مفيش معاينة منشورة لقالب ${theme.name}`,
              en: `No published preview yet for the ${theme.name} theme`,
            })}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/45">
              {b({ ar: 'المعاينة قيد التجهيز', en: 'Preview in preparation' })}
            </span>
          </div>
        )}
      </div>

      <figcaption className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-[18px]/[1.4] font-bold text-ink">{theme.name}</h3>
        <p className="prose-body-sm mt-2.5 text-ink-soft/80">{theme.description}</p>
        <p className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/45">
          {theme.id}
        </p>
      </figcaption>
    </figure>
  );
};

const Themes: React.FC = () => {
  const { b } = useBi();

  return (
    <PageShell
      slug="themes"
      eyebrow={{ ar: 'الثيمات', en: 'Themes' }}
      heading={{
        ar: 'اختار شكل متجرك من قوالب عربية جاهزة.',
        en: 'Pick your storefront from ready Arabic themes.',
      }}
      lead={{
        ar: 'كل قالب هنا متجر كامل شغّال — من اليمين للشمال، بصفحات المنتج والسلة والبحث. المعاينات دي لقطات حقيقية من القوالب نفسها، مش رسومات توضيحية.',
        en: 'Every theme here is a complete working storefront — right-to-left, with product, cart and search pages. These previews are real screenshots of the themes themselves, not illustrations.',
      }}
      title={{
        ar: `قوالب نُمُو — ${THEMES.length} قالب عربي جاهز`,
        en: `numu themes — ${THEMES.length} ready Arabic storefronts`,
      }}
      description={{
        ar: 'استعرض قوالب نُمُو العربية الجاهزة بمعاينات حقيقية من القوالب نفسها، وعدّل الألوان والخطوط والأقسام من لوحة التحكم.',
        en: 'Browse the ready Arabic numu themes with real previews of the themes themselves, then adjust colours, fonts and sections from your dashboard.',
      }}
      action={<SecondaryCta />}
    >
      <PageSection surface="paper">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme, i) => (
            <Reveal as="li" key={theme.id} delay={Math.min(i, 5) * 60}>
              <ThemeCard theme={theme} priority={i < 3} />
            </Reveal>
          ))}
        </ul>

        <p className="prose-body-sm mt-8 max-w-2xl text-ink-soft/65">
          {b({
            ar: 'كل قالب بتعدّل ألوانه وخطوطه وأقسامه من محرر الثيم، فالشكل النهائي بيطلع على براندك انت مش على شكل المعاينة بالظبط.',
            en: 'Every theme’s colours, fonts and sections are editable in the theme editor, so the finished store carries your brand rather than matching the preview exactly.',
          })}
        </p>
      </PageSection>

      <PageClose
        heading={{ ar: 'اختار قالبك وابدأ.', en: 'Pick a theme and start.' }}
        support={{
          ar: 'افتح متجرك مجانًا، وبدّل بين القوالب من لوحة التحكم وقت ما تحب.',
          en: 'Open your store free, and switch themes from the dashboard whenever you like.',
        }}
        action={
          <>
            <PrimaryCta onDark />
            <SecondaryCta onDark />
          </>
        }
      />
    </PageShell>
  );
};

export default Themes;
