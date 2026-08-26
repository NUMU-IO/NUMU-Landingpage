import React from 'react';
import { PageShell, PageSection, PageClose, BodyHead } from '../components/redesign/PageShell';
import { PrimaryCta, SecondaryCta, useBi } from '../components/redesign/ui';
import { Bi } from '../components/redesign/copy';

/**
 * /features — "Explain capabilities by merchant job."
 *
 * Grouped the way `pages/other-pages.md` fixes it: build the store, receive
 * orders, collect payment and ship, understand performance, grow. Each group
 * gets one outcome statement, then the capabilities beneath it.
 *
 * Every capability listed here is one the platform already ships and already
 * describes publicly. Nothing forward-looking or unreleased appears.
 */

interface Group {
  key: string;
  job: Bi;
  outcome: Bi;
  items: Bi[];
}

const GROUPS: Group[] = [
  {
    key: 'build',
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
    ],
  },
  {
    key: 'orders',
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
    job: { ar: 'اقبض واشحن', en: 'Collect payment and ship' },
    outcome: {
      ar: 'العميل بيدفع بالطريقة اللي تناسبه، والشحن بسعره الصح.',
      en: 'The customer pays the way that suits them, and shipping carries the right price.',
    },
    items: [
      { ar: 'دفع عند الاستلام مظبوط للسوق المصري', en: 'Cash on delivery tuned for the Egyptian market' },
      { ar: 'بوابات دفع محلية: بيموب، فوري، كاشير', en: 'Local payment gateways: Paymob, Fawry, Kashier' },
      { ar: 'أسعار شحن حسب المحافظة', en: 'Shipping rates by governorate' },
      { ar: 'شحن مع بوسطة وأرامكس', en: 'Shipping with Bosta and Aramex' },
    ],
  },
  {
    key: 'understand',
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
