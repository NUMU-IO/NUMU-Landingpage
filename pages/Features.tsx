import React from 'react';
import { PageShell, PageSection, PageClose, BodyHead } from '../components/redesign/PageShell';
import { PrimaryCta, SecondaryCta, AssetSlot, useBi } from '../components/redesign/ui';
import { Bi } from '../components/redesign/copy';
import type { AssetKey } from '../components/redesign/assets';

/**
 * /features — "Explain capabilities by merchant job."
 *
 * Grouped the way `pages/other-pages.md` fixes it: build the store, receive
 * orders, collect payment and ship, understand performance, grow. Each group
 * gets one outcome statement, then the capabilities beneath it.
 *
 * Every capability listed here is one the platform already ships and already
 * describes publicly. Nothing forward-looking or unreleased appears.
 *
 * Each group carries one of the owner-supplied illustrations (2026-09-25,
 * `assets.ts` § Illustrations): drawn scenes of the job, not product screens,
 * so the list stays the only place a capability is claimed.
 */

interface Group {
  key: string;
  job: Bi;
  outcome: Bi;
  items: Bi[];
  /** Owner-supplied illustration for the job — mood, never a capability claim. */
  illo?: { asset: AssetKey; ratio: number; alt: Bi };
}

const GROUPS: Group[] = [
  {
    key: 'build',
    illo: {
      asset: 'illoOpenStore',
      ratio: 3 / 2,
      alt: { ar: 'رسمة توضيحية: تاجر على اللابتوب بيجهّز متجره الإلكتروني، ومنتجاته على الرف وراه.', en: 'Illustration: a merchant at a laptop setting up his online store, his products on the shelf behind him.' },
    },
    job: { ar: 'ابني المتجر', en: 'Build the store' },
    outcome: {
      ar: 'متجر عربي شكله محترم من غير مصمم ومن غير مبرمج.',
      en: 'A respectable Arabic storefront with no designer and no developer.',
    },
    items: [
      { ar: 'ثيمات عربية جاهزة تعدّل ألوانها وخطوطها وأقسامها', en: 'Ready Arabic themes with editable colours, fonts and sections' },
      { ar: 'معاينة مباشرة لشكل المتجر قبل ما تنشره', en: 'Live preview of the storefront before you publish it' },
      { ar: 'اتجاه عربي من اليمين لليسار في كل الصفحات', en: 'Right-to-left Arabic across every page' },
      { ar: 'دومين خاص بيك', en: 'Your own domain' },
      { ar: 'مدوّنة للمتجر وصفحات وقوائم وحقول مخصصة', en: 'A store blog, custom pages, menus and custom fields' },
      { ar: 'أكتر من فرع ومخزن، ونقل مخزون بينهم', en: 'Several locations and warehouses, with stock transfers between them' },
    ],
  },
  {
    key: 'orders',
    illo: {
      asset: 'illoPackingOrders',
      ratio: 1,
      alt: { ar: 'رسمة توضيحية: تاجر بيغلّف أوردر في كرتونة، وقدامه اللابتوب مفتوح على قائمة الطلبات.', en: 'Illustration: a merchant packing an order into a box, his laptop open on the orders list.' },
    },
    job: { ar: 'استقبل الطلبات', en: 'Receive orders' },
    outcome: {
      ar: 'كل أوردر بيوصلك في مكان واحد وانت عارف حالته.',
      en: 'Every order arrives in one place and you know where it stands.',
    },
    items: [
      { ar: 'شاشة طلبات بحالة واضحة لكل أوردر', en: 'An orders screen with a clear status on every order' },
      { ar: 'إدارة المنتجات والمخزون', en: 'Product and inventory management' },
      { ar: 'أكواد خصم', en: 'Discount codes' },
      { ar: 'ملف العميل وسجل طلباته', en: 'Customer profiles and order history' },
    ],
  },
  {
    key: 'pay-ship',
    illo: {
      asset: 'illoCodDecision',
      ratio: 4 / 5,
      alt: { ar: 'رسمة توضيحية: تاجرة ماسكة تابلت وقدامها أوردر عليه إشارة أمان وتلات اختيارات: شحن، عربون، أو رفض — والمندوب واقف بالطرد.', en: 'Illustration: a merchant holding a tablet with an order, a safety signal and three choices — ship, deposit or decline — while the courier waits with the parcel.' },
    },
    job: { ar: 'اقبض واشحن', en: 'Collect payment and ship' },
    outcome: {
      ar: 'العميل بيدفع بالطريقة اللي تناسبه، والشحن بسعره الصح.',
      en: 'The customer pays the way that suits them, and shipping carries the right price.',
    },
    items: [
      { ar: 'دفع عند الاستلام مظبوط للسوق المصري', en: 'Cash on delivery tuned for the Egyptian market' },
      { ar: 'بوابات دفع محلية: بيموب، فوري، كاشير، فواتيرك، إنستاباي', en: 'Local payment gateways: Paymob, Fawry, Kashier, Fawaterak, InstaPay' },
      { ar: 'محافظ: فودافون كاش، WE Pay، أورنج كاش، أو تحويل بنكي', en: 'Wallets: Vodafone Cash, WE Pay, Orange Cash, or bank transfer' },
      { ar: 'عربون لتأكيد أوردر الدفع عند الاستلام', en: 'A deposit to confirm a cash-on-delivery order' },
      { ar: 'أسعار شحن حسب المحافظة', en: 'Shipping rates by governorate' },
      { ar: 'شحن مع بوسطة ومايلرز وJ&T، أو مندوبك الخاص', en: 'Shipping with Bosta, Mylerz and J&T, or your own courier' },
      { ar: 'طباعة البوالص بالجملة وتسوية الكاش مع شركة الشحن', en: 'Bulk shipping labels and cash reconciliation with the courier' },
      { ar: 'COD Autopilot: تأكيد الشحن والتسليم على واتساب لوحده (مع إضافة واتساب)', en: 'COD Autopilot: shipping and delivery confirmations over WhatsApp, on their own (with the WhatsApp add-on)' },
    ],
  },
  {
    key: 'understand',
    illo: {
      asset: 'illoMerchantStore',
      ratio: 16 / 9,
      alt: { ar: 'رسمة توضيحية: تاجرة في محلها وجنبها شاشة متجرها ورسم بياني للمبيعات.', en: 'Illustration: a merchant in her shop beside her storefront screen and a sales chart.' },
    },
    job: { ar: 'افهم أداءك', en: 'Understand performance' },
    outcome: {
      ar: 'تعرف بتكسب منين، ومنتجاتك اللي ماشية أنهي.',
      en: 'You know where the money comes from and which products are moving.',
    },
    items: [
      { ar: 'تحليلات المبيعات والطلبات', en: 'Sales and order analytics' },
      { ar: 'المنتجات الأكتر مبيعًا', en: 'Best-selling products' },
      { ar: 'مصادر الزيارات', en: 'Traffic sources' },
      { ar: 'تصدير بياناتك في أي وقت', en: 'Export your data at any time' },
    ],
  },
  {
    key: 'grow',
    illo: {
      asset: 'illoConnectedTools',
      ratio: 1,
      alt: { ar: 'رسمة توضيحية: متجر في النص ومتوصل بيه بطاقة ومحفظة وشحن وتحليلات ومحادثات وإنستغرام.', en: 'Illustration: a store in the centre, wired to cards, a wallet, shipping, analytics, chat and Instagram.' },
    },
    job: { ar: 'كبّر شغلك', en: 'Grow the business' },
    outcome: {
      ar: 'أدوات بتشتغل معاك لما المتجر يكبر، مش بتقف قدامك.',
      en: 'Tools that keep working as the store grows instead of getting in the way.',
    },
    items: [
      { ar: 'استرداد السلات المتروكة', en: 'Abandoned-cart recovery' },
      { ar: 'أعضاء فريق بصلاحيات', en: 'Staff members with permissions' },
      { ar: 'وصول API وويب هوكس', en: 'API access and webhooks' },
      { ar: 'تواصل مع العملاء على واتساب', en: 'Customer contact over WhatsApp' },
      { ar: 'حملات وعروض وكوبونات وكروت هدايا', en: 'Campaigns, promotions, coupons and gift cards' },
      { ar: 'مجموعات منتجات (bundles) وبيع إضافي', en: 'Product bundles and upsells' },
      { ar: 'استيراد من إنستغرام وفيسبوك وملفات إكسل', en: 'Import from Instagram, Facebook and Excel files' },
      { ar: 'اربط Claude أو ChatGPT بمتجرك (MCP)', en: 'Connect Claude or ChatGPT to your store (MCP)' },
    ],
  },
];

const Features: React.FC = () => {
  const { b } = useBi();

  return (
    <PageShell
      slug="features"
      eyebrow={{ ar: 'المميزات', en: 'Features' }}
      heading={{
        ar: 'كل اللي التاجر محتاجه، مرتّب حسب شغله.',
        en: 'Everything a merchant needs, ordered by the job it does.',
      }}
      lead={{
        ar: 'مش قايمة مميزات طويلة. دي الشغلانات اللي بتعملها كل يوم، وإيه اللي نُمُو بيقدمه في كل واحدة فيها.',
        en: 'Not a long feature list. These are the jobs you do every day, and what numu gives you for each one.',
      }}
      title={{
        ar: 'مميزات نُمُو — كل حاجة مرتّبة حسب شغل التاجر',
        en: 'numu features — organised by the merchant job they serve',
      }}
      description={{
        ar: 'ابني متجرك، استقبل الطلبات، اقبض واشحن، افهم أداءك، وكبّر شغلك — مميزات نُمُو مرتّبة حسب اللي بتعمله كل يوم.',
        en: 'Build the store, receive orders, collect payment and ship, understand performance, grow — numu features grouped by what you actually do each day.',
      }}
      action={<SecondaryCta />}
    >
      {GROUPS.map((group, i) => (
        <PageSection key={group.key} surface={i % 2 === 0 ? 'paper' : 'cream'}>
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-14">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy-500 mb-4">
                {String(i + 1).padStart(2, '0')}
              </p>
              <BodyHead heading={group.job} support={group.outcome} />
              {group.illo && (
                <div className="mt-8 max-w-md overflow-hidden rounded-[10px] border border-ink/10 bg-cream">
                  <AssetSlot
                    asset={group.illo.asset}
                    ratio={group.illo.ratio}
                    alt={group.illo.alt}
                    sizes="(min-width: 1024px) 440px, 100vw"
                  />
                </div>
              )}
            </div>

            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 lg:pt-14">
              {group.items.map((item, j) => (
                <li key={j} className="flex gap-3 border-t border-ink/10 pt-4">
                  <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-saffron" />
                  <span className="prose-body-sm text-ink-soft/85">{b(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </PageSection>
      ))}

      <PageClose
        heading={{ ar: 'شوفهم شغالين على متجر حقيقي.', en: 'See them running on a real store.' }}
        support={{
          ar: 'ابدأ متجرك وجرّب الأدوات دي بنفسك من غير بطاقة ائتمان.',
          en: 'Start your store and try these tools yourself, with no credit card.',
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

export default Features;
