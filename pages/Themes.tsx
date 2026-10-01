import React from 'react';
import { PageShell, PageSection, PageClose } from '../components/redesign/PageShell';
import { PrimaryCta, SecondaryCta, useBi } from '../components/redesign/ui';
import { Reveal } from '../components/redesign/Reveal';
import { THEMES_WITH_PREVIEW, ThemeEntry } from '../components/redesign/themesData';
import type { Bi } from '../components/redesign/copy';

/**
 * Merchant-facing name and one line per theme, by the kind of shop it suits.
 * The manifest descriptions are written for developers ("ported faithfully
 * from the V2 in-tree theme"), so the gallery speaks for itself here. A theme
 * missing from this map falls back to its manifest name and description.
 */
const COPY: Record<string, { name: Bi; line: Bi }> = {
  'bazar-v3': {
    name: { ar: 'بازار', en: 'Bazar' },
    line: { ar: 'شكل جريء بألوان كهرماني وكحلي، مناسب لبراندات الستريت وير والهدوم الشبابية.', en: 'A bold amber-and-navy look for streetwear and youth fashion brands.' },
  },
  'boutique-v3': {
    name: { ar: 'بوتيك', en: 'Boutique' },
    line: { ar: 'شكل أنيق بألوان وردي، مناسب لمحلات الهدوم والإكسسوارات.', en: 'An elegant pink-toned look for clothing and accessories shops.' },
  },
  'editorial-v3': {
    name: { ar: 'مانشيت', en: 'Manshet' },
    line: { ar: 'شكل مجلة بعناوين كبيرة وصور عريضة، مناسب لبراندات الموضة اللي بتعتمد على الصور.', en: 'A magazine layout with big headlines and wide photos, for image-led fashion brands.' },
  },
  'elegant-v3': {
    name: { ar: 'إليجانت', en: 'Elegant' },
    line: { ar: 'شكل كلاسيك بدرجات البني الدافي، مناسب للمنتجات الفاخرة والهدايا.', en: 'A classic warm-brown look for premium products and gifts.' },
  },
  'empire-v3': {
    name: { ar: 'إمباير', en: 'Empire' },
    line: { ar: 'شكل راقي بالأبيض والأسود وخط عريض، مناسب لبراندات الموضة اللي عايزة طابع فخم.', en: 'A refined black-and-white look with wide type, for fashion brands that want a premium feel.' },
  },
  'gilded-glamour-boutique-v3': {
    name: { ar: 'جيلديد', en: 'Gilded Glamour' },
    line: { ar: 'شكل فخم بلمسات ذهبي، مناسب للمجوهرات والفساتين والهدايا الفاخرة.', en: 'A luxurious look with gold accents, for jewellery, dresses and premium gifts.' },
  },
  'kick-game-v3': {
    name: { ar: 'كيك جيم', en: 'Kick Game' },
    line: { ar: 'شكل مينيمال بشبكة منتجات كتير، مناسب للأحذية والستريت وير.', en: 'A minimal look with a dense product grid, for sneakers and streetwear.' },
  },
  'luxury-minimal-v3': {
    name: { ar: 'لاكشري مينيمال', en: 'Luxury Minimal' },
    line: { ar: 'شكل نضيف وهادي بلمسة ذهبي، مناسب للهدوم والإكسسوارات ومنتجات التجميل.', en: 'A clean, calm look with a gold accent, for clothing, accessories and beauty.' },
  },
  'modern-v3': {
    name: { ar: 'مودرن', en: 'Modern' },
    line: { ar: 'شكل نضيف بلون تركواز، مناسب لأي متجر عايز يبدأ بسرعة.', en: 'A clean teal look that suits any store that wants to start fast.' },
  },
  'neo-brutalism-v3': {
    name: { ar: 'نيو بروتاليزم', en: 'Neo Brutalism' },
    line: { ar: 'شكل جريء بحدود سميكة وألوان نيون، مناسب للبراندات اللي عايزة تلفت النظر.', en: 'A bold look with thick borders and neon accents, for brands that want to stand out.' },
  },
  'rabbitsocks-v3': {
    name: { ar: 'مشكّل', en: 'Mashkal' },
    line: { ar: 'منتجاتك في أشكال أقواس ودواير، وفيه باقات وجدول مقاسات جاهزين، مناسب للشرابات والإكسسوارات الصغيرة.', en: 'Products framed in arches and circles, with built-in bundles and a size chart, for socks and small accessories.' },
  },
  'skeuomorphic-v3': {
    name: { ar: 'ورشة', en: 'Warsha' },
    line: { ar: 'شكل يدوي بخامات كرافت وجلد، مناسب للمنتجات اليدوية والحِرف.', en: 'A hand-crafted look with kraft and leather textures, for handmade and artisan products.' },
  },
  'street-v3': {
    name: { ar: 'ستريت', en: 'Street' },
    line: { ar: 'شكل شبابي بألوان أصفر وكحلي ووردي، مناسب للستريت وير.', en: 'A youthful yellow, navy and pink look for streetwear.' },
  },
  'tech-wave-v3': {
    name: { ar: 'تك ويف', en: 'Tech Wave' },
    line: { ar: 'شكل غامق بلمسات نيون، مناسب للإلكترونيات والإكسسوارات التقنية.', en: 'A dark look with neon accents, for electronics and tech accessories.' },
  },
  'vionne-v3': {
    name: { ar: 'ڤيون', en: 'Vionne' },
    line: { ar: 'شكل رمادي هادي، مناسب للموضة المعاصرة والإكسسوارات.', en: 'A calm grayscale look for contemporary fashion and accessories.' },
  },
};

/** Built for one merchant's brand, not offered as a general theme. */
const MERCHANT_THEMES = new Set(['bon-younes-v3']);

/** Only themes a merchant can judge: a real preview and not someone else's brand. */
const GALLERY = THEMES_WITH_PREVIEW.filter((t) => !MERCHANT_THEMES.has(t.id));

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
 *   • name and line come from `COPY` above, written for merchants, with the
 *     theme's own `theme.json` manifest as the fallback;
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
 * Themes with no published thumbnail are left out until they have one: a
 * merchant cannot judge a grey panel. Themes built for one merchant's brand
 * (`MERCHANT_THEMES`) are left out too.
 */

const ThemeCard: React.FC<{ theme: ThemeEntry; priority: boolean }> = ({ theme, priority }) => {
  const { b } = useBi();
  const copy = COPY[theme.id];
  const name = copy ? b(copy.name) : theme.name.replace(/\s*\(V\d+\)$/i, '');

  return (
    <figure className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-ink/12 bg-cream">
      <div className="relative overflow-hidden border-b border-ink/10 bg-bone/40">
        <img
          src={theme.previewUrl ?? undefined}
          alt={b({
            ar: `معاينة قالب ${name}`,
            en: `Preview of the ${name} theme`,
          })}
          width={1366}
          height={900}
          /* The first row is above the fold on most desktops; the rest wait. */
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="aspect-[1366/900] w-full object-cover object-top transition-transform
            duration-500 ease-numu group-hover:scale-[1.02] motion-reduce:transform-none"
        />
      </div>

      <figcaption className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-[18px]/[1.4] font-bold text-ink">{name}</h3>
        <p className="prose-body-sm mt-2.5 text-ink-soft/80">{copy ? b(copy.line) : theme.description}</p>
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
        ar: `قوالب نُمُو — ${GALLERY.length} قالب عربي جاهز`,
        en: `numu themes — ${GALLERY.length} ready Arabic storefronts`,
      }}
      description={{
        ar: 'استعرض قوالب نُمُو العربية الجاهزة بمعاينات حقيقية من القوالب نفسها، وعدّل الألوان والخطوط والأقسام من لوحة التحكم.',
        en: 'Browse the ready Arabic numu themes with real previews of the themes themselves, then adjust colours, fonts and sections from your dashboard.',
      }}
      action={<SecondaryCta />}
    >
      <PageSection surface="paper">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((theme, i) => (
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
