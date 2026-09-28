import React, { useEffect, useRef, useState } from 'react';
import { Check, Loader2, Search, ShoppingBag, User } from 'lucide-react';
import { onboardingChat as C, type Bi, type ChatChip } from './copy';
import { Section, SectionHead, AssetSlot, useBi } from './ui';
import { usePrefersReducedMotion } from './hooks';
import { DEFAULT_TRIAL_DAYS, toArabicDigits } from '../../lib/trialInfo';
import { clearPrefill, savePrefill, type OnboardingPrefill } from '../../lib/onboardingPrefill';
import { useSignupModal } from '../../contexts/SignupModalContext';
import { track } from '../../lib/analytics';

/**
 * 01b — "Describe your store" builder (W3; rebuilt 2026-09-28 on the owner's
 * brief: work like vondera.app's prompt — describe the store, watch it being
 * built, see it, then open it).
 *
 * A script, not a model, and it says so: the visitor describes the store in a
 * line (or picks a preset), the description is matched to a niche by keyword
 * (`guessNiche`), a four-step build plays in a browser frame, and a PREVIEW
 * of a storefront for that niche appears — the store name they type, a
 * photo banner, four products with real photos (Unsplash, free licence —
 * `public/store-preview/`), the COD and shipping badges for what they pick. It is labelled «معاينة» and never "AI
 * generated": the real store is set up after sign-up.
 *
 * Every choice is saved as it is made (`lib/onboardingPrefill.ts`); the
 * sign-up hands it to the hub, whose setup wizard opens with the niche,
 * payments and shipping pre-selected. The typed line is never stored or sent.
 */

type Phase = 'idle' | 'building' | 'ready';

/** Payment chip → the wizard's payment ids. Cash on delivery is always on. */
const PAY: Record<string, string[]> = {
  cod: ['cod'],
  card: ['cod', 'paymob_card'],
  wallet: ['cod', 'paymob_wallet'],
  fawry: ['cod', 'fawry'],
  all: ['cod', 'paymob_card', 'paymob_wallet', 'fawry'],
};
/** Shipping chip → the wizard's shipping preference (Mylerz / J&T connect later). */
const SHIP: Record<string, string> = {
  bosta: 'bosta',
  mylerz_jt: 'manual',
  own: 'manual',
  both: 'both',
  unknown: 'manual',
};

// ponytail: keyword match, not a model. The earliest hit in the text wins; add words as merchants' phrasing shows up.
const KEYWORDS: [string, RegExp][] = [
  ['fashion', /ملابس|لبس|هدوم|فستان|فساتين|طرح|أوشحة|اوشحة|اسكارف|جينز|تيشيرت|قمصان|عباي|أزياء|ازياء|شرابات|fashion|cloth|dress|scarf|scarves|jeans|shirt|wear/i],
  ['accessories', /إكسسوار|اكسسوار|شنط|شنطة|ساعات|فضة|دهب|مجوهرات|نظارات|accessor|bag|watch|jewel/i],
  ['beauty', /تجميل|ميكب|ميك اب|مكياج|سكين|عناية|برفان|عطور|كريمات|beauty|makeup|skin|perfume|cosmetic/i],
  ['electronics', /موبايل|إلكترونيات|الكترونيات|سماعات|شواحن|لابتوب|electronic|phone|mobile|laptop|gadget/i],
  ['food', /أكل|اكل|حلويات|كيك|قهوة|مشروبات|عسل|food|cake|coffee|sweets|dessert|snack|bake/i],
  ['home', /مفروشات|ديكور|مطبخ|أثاث|اثاث|سجاد|furniture|decor|kitchen|bedding/i],
];

/** The niche chip a free-text description points at; "other" when nothing matches. */
export const guessNiche = (text: string): ChatChip => {
  let best = 'other';
  let at = Infinity;
  for (const [value, re] of KEYWORDS) {
    const i = text.search(re);
    if (i !== -1 && i < at) [best, at] = [value, i];
  }
  return C.niche.chips.find((c) => c.value === best)!;
};

/** Preview content per niche. Prices are sample prices for the preview only. */
const NICHE: Record<string, { icon: string; hue: string; hero: Bi; products: [string, Bi, number][] }> = {
  fashion: {
    icon: 'dress',
    hue: '#B94F62',
    hero: { ar: 'تشكيلة الصيف وصلت', en: 'The summer edit is in' },
    products: [
      ['dress', { ar: 'فستان صيفي', en: 'Summer dress' }, 650],
      ['scarf', { ar: 'طرحة شيفون', en: 'Chiffon scarf' }, 220],
      ['tshirt', { ar: 'تيشيرت قطن', en: 'Cotton tee' }, 280],
      ['heel', { ar: 'كعب سهرة', en: 'Evening heels' }, 890],
    ],
  },
  accessories: {
    icon: 'sunglasses',
    hue: '#A67A22',
    hero: { ar: 'تفاصيل بتكمّل لوكك', en: 'Details that finish the look' },
    products: [
      ['handbag', { ar: 'شنطة كروس', en: 'Cross-body bag' }, 540],
      ['sunglasses', { ar: 'نضارة شمس', en: 'Sunglasses' }, 350],
      ['ring', { ar: 'خاتم فضة', en: 'Silver ring' }, 420],
      ['watch', { ar: 'ساعة كلاسيك', en: 'Classic watch' }, 990],
    ],
  },
  beauty: {
    icon: 'lipstick',
    hue: '#A0489B',
    hero: { ar: 'عناية تليق بيكي', en: 'Care that suits you' },
    products: [
      ['lipstick', { ar: 'روج مات', en: 'Matte lipstick' }, 180],
      ['lotion', { ar: 'لوشن ترطيب', en: 'Moisturising lotion' }, 240],
      ['soap', { ar: 'صابون طبيعي', en: 'Natural soap' }, 90],
      ['blossom', { ar: 'مست ورد', en: 'Rose mist' }, 310],
    ],
  },
  electronics: {
    icon: 'phone',
    hue: '#4657B8',
    hero: { ar: 'إكسسوارات موبايلك بأحسن سعر', en: 'Phone accessories, best prices' },
    products: [
      ['phone', { ar: 'جراب موبايل', en: 'Phone case' }, 150],
      ['headphone', { ar: 'سماعة بلوتوث', en: 'Bluetooth headphones' }, 750],
      ['laptop', { ar: 'ستاند لابتوب', en: 'Laptop stand' }, 480],
      ['battery', { ar: 'باور بانك', en: 'Power bank' }, 620],
    ],
  },
  food: {
    icon: 'cake',
    hue: '#5F7D24',
    hero: { ar: 'معمول في البيت بحب', en: 'Home-made, with love' },
    products: [
      ['cake', { ar: 'تورتة شوكولاتة', en: 'Chocolate cake' }, 450],
      ['coffee', { ar: 'بن محوّج', en: 'Spiced coffee' }, 180],
      ['cookie', { ar: 'كوكيز بيتي', en: 'Home-made cookies' }, 120],
      ['honey', { ar: 'عسل نحل', en: 'Honey' }, 260],
    ],
  },
  home: {
    icon: 'couch',
    hue: '#BD6538',
    hero: { ar: 'بيتك يستاهل أحلى', en: 'Your home deserves better' },
    products: [
      ['couch', { ar: 'أباجورة ديكور', en: 'Decor lamp' }, 380],
      ['plant', { ar: 'زرعة صبار', en: 'Cactus pot' }, 150],
      ['candle', { ar: 'شمعة معطّرة', en: 'Scented candle' }, 140],
      ['bed', { ar: 'مفرش سرير', en: 'Bed cover' }, 890],
    ],
  },
  other: {
    icon: 'package',
    hue: '#5B6876',
    hero: { ar: 'حاجات حلوة وهدايا بتفرّح', en: 'Lovely things and gifts' },
    products: [
      ['books', { ar: 'كتب مختارة', en: 'Picked books' }, 200],
      ['teddy', { ar: 'دبدوب', en: 'Teddy bear' }, 320],
      ['palette', { ar: 'أدوات رسم', en: 'Art set' }, 260],
      ['gift', { ar: 'بوكس هدايا', en: 'Gift box' }, 450],
    ],
  },
};

const BUILD_STEPS = (label: Bi): Bi[] => [
  { ar: `بنختار شكل يناسب «${label.ar}»`, en: `Picking a look for “${label.en}”` },
  { ar: 'بنفعّل الدفع عند الاستلام', en: 'Switching on cash on delivery' },
  { ar: 'بنظبط الشحن لكل المحافظات', en: 'Setting up shipping to every governorate' },
  { ar: 'بنرص المنتجات في الواجهة', en: 'Laying out the products' },
];

const Icon3D: React.FC<{ name: string; size: number; className?: string }> = ({ name, size, className = '' }) => (
  <img
    src={`/emoji3d/${name}.webp`}
    alt=""
    width={size}
    height={size}
    loading="lazy"
    decoding="async"
    className={`shrink-0 select-none ${className}`}
    style={{ width: size, height: size }}
  />
);

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20);

const OnboardingChat: React.FC = () => {
  const { b, isAr } = useBi();
  const reduced = usePrefersReducedMotion();
  const { open } = useSignupModal();
  const [phase, setPhase] = useState<Phase>('idle');
  const [text, setText] = useState('');
  const [example, setExample] = useState(0);
  const [niche, setNiche] = useState<ChatChip | null>(null);
  const [built, setBuilt] = useState(0);
  const [name, setName] = useState('');
  const [pay, setPay] = useState<string | null>(null);
  const [ship, setShip] = useState<string | null>(null);
  const answers = useRef<OnboardingPrefill>({});
  const timers = useRef<number[]>([]);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // While the box is empty, its placeholder cycles through example lines.
  useEffect(() => {
    if (reduced || phase !== 'idle' || text) return;
    const t = window.setInterval(() => setExample((i) => (i + 1) % C.composer.examples.length), 3200);
    return () => window.clearInterval(t);
  }, [reduced, phase, text]);

  const num = (n: number) => (isAr ? toArabicDigits(n.toLocaleString('en-US')) : n.toLocaleString('en-US'));

  const build = (chip: ChatChip) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    track('onboarding_chat_started');
    answers.current = { ...answers.current, niche: chip.value };
    savePrefill(answers.current);
    setNiche(chip);
    setBuilt(0);
    setPhase('building');
    const step = reduced ? 250 : 850;
    for (let i = 1; i <= 4; i += 1) {
      timers.current.push(window.setTimeout(() => setBuilt(i), step * i));
    }
    timers.current.push(
      window.setTimeout(() => {
        setPhase('ready');
        track('onboarding_chat_completed', { niche: chip.value, sells_where: null, orders_band: null, shipping: null });
      }, step * 4 + (reduced ? 100 : 450)),
    );
    window.setTimeout(() => frame.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' }), 60);
  };

  const submit = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    const t = text.trim().slice(0, 200);
    if (t.length < 2 || phase === 'building') return;
    build(guessNiche(t));
  };

  const choosePay = (chip: ChatChip) => {
    setPay(chip.value);
    answers.current = { ...answers.current, payments: PAY[chip.value] };
    savePrefill(answers.current);
    track('onboarding_chat_answered', { step: 'pay', value: chip.value });
  };
  const chooseShip = (chip: ChatChip) => {
    setShip(chip.value);
    answers.current = { ...answers.current, shipping: SHIP[chip.value] };
    savePrefill(answers.current);
    track('onboarding_chat_answered', { step: 'ship', value: chip.value });
  };

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    clearPrefill();
    answers.current = {};
    setPhase('idle');
    setNiche(null);
    setPay(null);
    setShip(null);
  };

  const meta = niche ? NICHE[niche.value] ?? NICHE.other : null;
  const storeName = name.trim() || b({ ar: 'متجرك', en: 'Your store' });
  const host = `${slugify(name) || 'yourstore'}.numueg.app`;
  const days = isAr ? toArabicDigits(String(DEFAULT_TRIAL_DAYS)) : String(DEFAULT_TRIAL_DAYS);
  const payLabel = C.pay.chips.find((c) => c.value === pay)?.label;
  const shipLabel = C.ship.chips.find((c) => c.value === ship)?.label;

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-[13.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
      active ? 'border-navy bg-navy text-cream' : 'border-ink/15 bg-paper text-ink hover:border-navy/50'
    }`;

  return (
    <Section id="start-chat" labelledBy="start-chat-heading">
      <SectionHead id="start-chat-heading" eyebrow={C.eyebrow} heading={C.heading} support={C.support} align="center" />

      <div className="mx-auto mt-10 max-w-[860px]">
        {/* ── The prompt ── */}
        <form
          onSubmit={submit}
          className="rounded-[24px] border-2 border-navy/15 bg-paper p-2 shadow-[0_24px_60px_-28px_rgba(0,31,63,0.45),0_0_0_6px_rgba(232,164,48,0.10)] transition-colors focus-within:border-navy/50"
        >
          <label htmlFor="start-chat-input" className="sr-only">{b(C.composer.label)}</label>
          <textarea
            id="start-chat-input"
            rows={3}
            maxLength={200}
            value={text}
            readOnly={phase === 'building'}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
            }}
            placeholder={b(C.composer.examples[example])}
            className="block w-full resize-none border-0 bg-transparent px-4 pt-4 text-[18px]/[1.7] text-ink placeholder:text-ink-soft/55 focus:outline-none focus:ring-0"
          />
          <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-3 pb-2 pt-3">
            <span className="ps-1 text-[12.5px] text-ink-soft/80">{b(C.composer.hint)}</span>
            <button
              type="submit"
              disabled={text.trim().length < 2 || phase === 'building'}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-5 py-3 text-[15px] font-bold text-cream shadow-[0_2px_0_#001226]
                transition-transform active:translate-y-[2px] disabled:cursor-not-allowed disabled:bg-navy/40 disabled:shadow-none
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              {phase === 'building' ? (
                <>
                  <Loader2 aria-hidden="true" className="size-4 animate-spin text-saffron" />
                  {b({ ar: 'بنجهّز متجرك…', en: 'Building your store…' })}
                </>
              ) : (
                <>
                  <Icon3D name="sparkles" size={20} />
                  {b(C.composer.submit)}
                </>
              )}
            </button>
          </div>
        </form>

        {/* ── Presets (idle) ── */}
        {phase === 'idle' && (
          <div className="mt-5 rounded-[20px] border border-ink/10 bg-paper/80 p-3 sm:p-4">
            <p className="px-2 pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/80">{b(C.composer.presets)}</p>
            <div role="group" aria-label={b(C.choicesLabel)} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {C.niche.chips.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setText(b(c.label));
                    build(c);
                  }}
                  className="group flex items-center gap-3 rounded-[14px] px-2.5 py-2.5 text-start transition-colors hover:bg-cream
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-cream transition-transform group-hover:-translate-y-0.5">
                    <Icon3D name={NICHE[c.value]?.icon ?? 'package'} size={34} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold text-ink">{b(c.label)}</span>
                    {c.desc && <span className="hidden truncate text-[12.5px] text-ink-soft/80 sm:block">{b(c.desc)}</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── The store, being built, then previewed ── */}
        {phase !== 'idle' && meta && niche && (
          <div
            ref={frame}
            className="mt-5 overflow-hidden rounded-[20px] border border-ink/10 bg-paper shadow-[0_30px_70px_-34px_rgba(0,31,63,0.5)]"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 bg-cream px-4 py-2.5">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
              </span>
              <span dir="ltr" className="flex-1 truncate rounded-full bg-paper px-3 py-1 text-center font-mono text-[12px] text-ink-soft">
                {host}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
                  phase === 'ready' ? 'bg-sage/15 text-sage' : 'bg-saffron/15 text-terracotta'
                }`}
              >
                <span aria-hidden="true" className={`size-1.5 rounded-full ${phase === 'ready' ? 'bg-sage' : 'animate-pulse bg-terracotta'}`} />
                {phase === 'ready' ? b({ ar: 'معاينة', en: 'Preview' }) : b({ ar: 'بيتبني دلوقتي', en: 'Building now' })}
              </span>
            </div>

            {phase === 'building' ? (
              <div className="grid gap-6 p-5 sm:grid-cols-[1fr_1.2fr] sm:p-7">
                <ol role="status" aria-live="polite" className="space-y-3.5">
                  {BUILD_STEPS(niche.label).map((s, i) => {
                    const done = built > i;
                    const current = built === i;
                    return (
                      <li key={s.en} className={`flex items-center gap-3 text-[15px] ${done ? 'text-ink' : current ? 'text-ink' : 'text-ink-soft/50'}`}>
                        <span
                          className={`grid size-7 shrink-0 place-items-center rounded-full ${
                            done ? 'bg-sage text-cream' : current ? 'bg-saffron/20' : 'bg-ink/[0.06]'
                          }`}
                        >
                          {done ? (
                            <Check aria-hidden="true" className="size-4" strokeWidth={3} />
                          ) : current ? (
                            <Loader2 aria-hidden="true" className="size-4 animate-spin text-terracotta" />
                          ) : null}
                        </span>
                        <span className={current ? 'font-semibold' : ''}>{b(s)}</span>
                      </li>
                    );
                  })}
                </ol>
                <div aria-hidden="true" className="space-y-3">
                  <div className="numu-shimmer h-24 rounded-[12px]" />
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="numu-shimmer h-16 rounded-[10px]" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </div>
                  <div className="numu-shimmer h-3 w-2/3 rounded-full" />
                </div>
              </div>
            ) : (
              <>
                {/* Storefront preview — decorative; the summary below says it in words.
                    Laid out like a real numu storefront: announcement bar, header,
                    photo banner, "new in" grid with badges and add-to-cart, trust
                    strip. Photos: Unsplash (free licence), `public/store-preview/`. */}
                <div aria-hidden="true" className="numu-bubble-in bg-white text-ink">
                  <div className="px-4 py-1.5 text-center text-[11.5px] font-semibold text-white" style={{ background: meta.hue }}>
                    {b({ ar: 'شحن لكل المحافظات · الدفع عند الاستلام', en: 'Nationwide shipping · Cash on delivery' })}
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3 sm:px-6">
                    <span className="font-display text-[19px] font-extrabold tracking-tight" style={{ color: meta.hue }}>{storeName}</span>
                    <span className="hidden gap-5 text-[13px] font-medium text-ink/80 md:flex">
                      <span className="border-b-2 pb-0.5" style={{ borderColor: meta.hue }}>{b({ ar: 'الرئيسية', en: 'Home' })}</span>
                      <span>{b({ ar: 'وصل حديثًا', en: 'New in' })}</span>
                      <span>{b({ ar: 'العروض', en: 'Offers' })}</span>
                      <span>{b({ ar: 'تواصل معانا', en: 'Contact' })}</span>
                    </span>
                    <span className="flex items-center gap-3 text-ink/70">
                      <Search className="size-[18px]" />
                      <User className="size-[18px]" />
                      <span className="relative">
                        <ShoppingBag className="size-[19px]" />
                        <span className="absolute -end-1.5 -top-1.5 grid size-4 place-items-center rounded-full text-[9px] font-bold text-white" style={{ background: meta.hue }}>
                          {num(0)}
                        </span>
                      </span>
                    </span>
                  </div>

                  <div className="relative h-[170px] overflow-hidden sm:h-[230px]">
                    <img src={`/store-preview/${niche.value}-banner.webp`} alt="" width={1200} height={520} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent rtl:bg-gradient-to-l" />
                    <div className="absolute inset-y-0 start-0 flex max-w-[70%] flex-col justify-center gap-2 px-5 sm:px-8">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">{b({ ar: 'مجموعة جديدة', en: 'New collection' })}</span>
                      <p className="font-display text-[22px]/[1.25] font-extrabold text-white sm:text-[30px]/[1.2]">{b(meta.hero)}</p>
                      <span className="mt-1 w-fit rounded-full bg-white px-4 py-1.5 text-[12.5px] font-bold" style={{ color: meta.hue }}>
                        {b({ ar: 'تسوّق دلوقتي', en: 'Shop now' })}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-5 sm:px-6">
                    <div className="flex items-baseline justify-between">
                      <p className="font-display text-[16px] font-bold">{b({ ar: 'وصل حديثًا', en: 'New in' })}</p>
                      <span className="text-[12px] font-semibold" style={{ color: meta.hue }}>{b({ ar: 'عرض الكل', en: 'View all' })}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {meta.products.map(([, pname, price], i) => {
                        const sale = i === 1;
                        return (
                          <div key={pname.en} className="numu-bubble-in group" style={{ animationDelay: `${i * 90}ms` }}>
                            <div className="relative aspect-square overflow-hidden rounded-[10px] bg-[#f4f4f2]">
                              <img src={`/store-preview/${niche.value}-p${i + 1}.webp`} alt="" width={480} height={480} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                              {i === 0 && (
                                <span className="absolute start-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold" style={{ color: meta.hue }}>
                                  {b({ ar: 'جديد', en: 'New' })}
                                </span>
                              )}
                              {sale && (
                                <span className="absolute start-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: meta.hue }}>
                                  {b({ ar: `خصم ${num(15)}٪`, en: '15% off' })}
                                </span>
                              )}
                            </div>
                            <p className="mt-2 truncate text-[13px] font-semibold">{b(pname)}</p>
                            <p className="flex items-baseline gap-1.5 text-[12.5px]">
                              <span className="font-bold">{num(sale ? Math.round((price * 0.85) / 5) * 5 : price)} {b({ ar: 'ج.م', en: 'EGP' })}</span>
                              {sale && <span className="text-ink/45 line-through">{num(price)}</span>}
                            </p>
                            <span className="mt-2 block rounded-full border py-1 text-center text-[11.5px] font-bold" style={{ borderColor: meta.hue, color: meta.hue }}>
                              {b({ ar: 'أضف للسلة', en: 'Add to cart' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-ink/10 bg-[#fafaf8] px-4 py-3 text-[11.5px] font-semibold sm:px-6">
                    <span className="flex items-center gap-1.5">
                      <Icon3D name="truck" size={20} />
                      {shipLabel && ship !== 'unknown' ? b({ ar: `شحن مع ${shipLabel.ar}`, en: `Ships with ${shipLabel.en}` }) : b({ ar: 'شحن لكل المحافظات', en: 'Ships nationwide' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon3D name="banknote" size={20} />
                      {b({ ar: 'الدفع عند الاستلام', en: 'Cash on delivery' })}
                    </span>
                    <span className="flex items-center justify-end gap-1.5">
                      {pay && pay !== 'cod' ? (
                        <>
                          <img src="/logos/visa.svg" alt="" className="h-3.5 w-auto" />
                          <img src="/logos/mastercard.svg" alt="" className="h-4 w-auto" />
                          <img src="/logos/meeza.webp" alt="" className="h-5 w-auto" />
                        </>
                      ) : (
                        <span className="grid size-7 place-items-center rounded-full bg-[#25D366]">
                          <svg viewBox="0 0 24 24" className="size-3.5 fill-white">
                            <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97 1-3.62-.24-.37A9.82 9.82 0 1 1 12.04 21.8zm8.36-18.18A11.76 11.76 0 0 0 12.04 0C5.54 0 .26 5.28.26 11.78c0 2.08.54 4.1 1.58 5.89L.16 24l6.48-1.7a11.77 11.77 0 0 0 5.4 1.38h.01c6.5 0 11.78-5.28 11.78-11.78 0-3.15-1.22-6.1-3.43-8.33z" />
                          </svg>
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Make it yours (optional) */}
                <div className="space-y-3 border-t border-ink/10 bg-cream/60 px-4 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <label htmlFor="store-name" className="text-[13.5px] font-bold text-ink">
                      {b({ ar: 'اسم متجرك', en: 'Store name' })}
                    </label>
                    <input
                      id="store-name"
                      value={name}
                      maxLength={30}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={b({ ar: 'مثلًا: لولي', en: 'e.g. Lolly' })}
                      className="min-w-0 flex-1 rounded-full border border-ink/15 bg-paper px-4 py-1.5 text-[14px] text-ink focus:border-navy focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div role="group" aria-label={b(C.pay.ask)} className="flex flex-wrap items-center gap-2">
                    <span className="me-1 text-[13.5px] font-bold text-ink">{b(C.pay.ask)}</span>
                    {C.pay.chips.map((c) => (
                      <button key={c.value} type="button" aria-pressed={pay === c.value} onClick={() => choosePay(c)} className={chip(pay === c.value)}>
                        {b(c.label)}
                      </button>
                    ))}
                  </div>
                  <div role="group" aria-label={b(C.ship.ask)} className="flex flex-wrap items-center gap-2">
                    <span className="me-1 text-[13.5px] font-bold text-ink">{b(C.ship.ask)}</span>
                    {C.ship.chips.map((c) => (
                      <button key={c.value} type="button" aria-pressed={ship === c.value} onClick={() => chooseShip(c)} className={chip(ship === c.value)}>
                        {b(c.label)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ready */}
                <div className="flex flex-col gap-3 border-t border-ink/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
                    <Icon3D name="check" size={24} />
                    {b({ ar: `مسودة متجر «${niche.label.ar}» جاهزة.`, en: `Your ${niche.label.en.toLowerCase()} store draft is ready.` })}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => open()}
                      className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-[15px] font-bold text-cream shadow-[0_2px_0_#001226]
                        transition-transform active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2"
                    >
                      {b({ ar: 'افتح متجرك بالشكل ده', en: 'Open my store like this' })}
                      <span aria-hidden="true" className="text-saffron rtl:rotate-180">→</span>
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-full px-4 py-3 text-[14px] font-bold text-navy hover:bg-navy/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    >
                      {b({ ar: 'عدّل الوصف', en: 'Edit the description' })}
                    </button>
                  </div>
                </div>
                <p className="border-t border-ink/10 px-4 py-2.5 text-center text-[12px] text-ink-soft/80 sm:px-6">
                  {b({
                    ar: `دي معاينة على قد وصفك — بعد التسجيل بتختار الثيم وتضيف منتجاتك الحقيقية. تجربة ${days} يوم ببلاش، من غير بطاقة ائتمان.`,
                    en: `This is a preview from your description — after sign-up you pick the theme and add your real products. ${days}-day free trial, no credit card.`,
                  })}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Where the answers land (desktop) — the real hub capture ── */}
      <figure className="mx-auto mt-12 hidden max-w-[860px] lg:block">
        <div className="overflow-hidden rounded-[12px] border border-ink/10 bg-paper numu-mockup-frame">
          <AssetSlot asset="hubWizardPrefilled" ratio={16 / 10} sizes="860px" alt={C.figure.alt} />
        </div>
        <figcaption className="prose-body-sm mt-3 text-center text-ink-soft/80">{b(C.figure.caption)}</figcaption>
      </figure>
    </Section>
  );
};

export default OnboardingChat;
