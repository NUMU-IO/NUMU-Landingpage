import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell, PageSection, PageClose, BodyHead } from '../components/redesign/PageShell';
import { PrimaryCta, useBi } from '../components/redesign/ui';
import type { Bi } from '../components/redesign/copy';
import LocationMap from '../components/redesign/LocationMap';
import { MessageCircle, Mail, BriefcaseBusiness, type LucideIcon } from 'lucide-react';

/**
 * /support — "Make human help easy to access."
 *
 * `pages/other-pages.md`: "Every support promise must be approved and
 * current." So every channel, address, hour and response time on this page is
 * carried over verbatim from what numueg.app already publishes in
 * `components/ContactSection.tsx` — none of it is written fresh here. The
 * response-time line in particular is an existing public commitment, not a new
 * one, and it is flagged in the handoff for re-confirmation.
 */

interface Channel {
  key: string;
  label: Bi;
  title: Bi;
  body: Bi;
  value: string;
  href: string;
  external?: boolean;
  cta: Bi;
  accent: string;
  /**
   * lucide, ISC licensed and needing no attribution — flaticon blocks
   * non-browser requests and its free tier requires a visible credit line.
   * Decorative: each card's label and title already name the channel.
   */
  Icon: LucideIcon;
}

const CHANNELS: Channel[] = [
  {
    key: 'whatsapp',
    Icon: MessageCircle,
    label: { ar: 'واتساب', en: 'WhatsApp' },
    title: { ar: 'كلّم إنسان حقيقي.', en: 'Talk to a human.' },
    body: {
      ar: 'أسرع طريقة توصل بيها لفريق الدعم، وبالعربي.',
      en: 'The fastest way to reach the support team, in Arabic.',
    },
    value: 'wa.me/201060082542',
    href: 'https://wa.me/201060082542',
    external: true,
    cta: { ar: 'ابدأ المحادثة', en: 'Chat on WhatsApp' },
    accent: 'text-sage',
  },
  {
    key: 'email',
    Icon: Mail,
    label: { ar: 'إيميل', en: 'Email' },
    title: { ar: 'ابعت رسالة مفصلة.', en: 'Write us a proper note.' },
    body: {
      ar: 'للمشاكل اللي محتاجة صور أو تفاصيل أكتر من رسالة سريعة.',
      en: 'For anything that needs screenshots or more detail than a quick message.',
    },
    value: 'support@numueg.app',
    href: 'mailto:support@numueg.app',
    external: true,
    cta: { ar: 'ابعت إيميل', en: 'Send an email' },
    accent: 'text-navy',
  },
  {
    key: 'sales',
    Icon: BriefcaseBusiness,
    label: { ar: 'مبيعات', en: 'Sales' },
    title: { ar: 'متجر كبير؟ احجز مكالمة.', en: 'Big store? Book a call.' },
    body: {
      ar: 'لو عندك حجم أوردرات كبير أو محتاج إعداد مخصص، كلّم فريق المبيعات.',
      en: 'If you have serious order volume or need a custom setup, talk to the sales team.',
    },
    value: 'sales@numueg.app',
    href: 'mailto:sales@numueg.app',
    external: true,
    cta: { ar: 'كلم فريق المبيعات', en: 'Talk to sales' },
    accent: 'text-terracotta',
  },
];

const Support: React.FC = () => {
  const { b } = useBi();

  return (
    <PageShell
      slug="support"
      eyebrow={{ ar: 'الدعم', en: 'Support' }}
      heading={{ ar: 'محتاج مساعدة؟ إحنا موجودين.', en: 'Need help? We are here.' }}
      lead={{
        ar: 'اختار الطريقة اللي تناسبك. فريق الدعم بيرد بالعربي.',
        en: 'Pick whichever channel suits you. The support team replies in Arabic.',
      }}
      title={{
        ar: 'دعم نُمُو — واتساب، إيميل، ومبيعات',
        en: 'numu support — WhatsApp, email and sales',
      }}
      description={{
        ar: 'اتواصل مع فريق دعم نُمُو على واتساب أو الإيميل، أو كلّم فريق المبيعات. مواعيد العمل الأحد – الخميس ٩ص – ٦م.',
        en: 'Reach the numu support team on WhatsApp or email, or talk to sales. Hours are Sunday to Thursday, 9 am to 6 pm.',
      }}
    >
      <PageSection surface="paper">
        <ul className="grid gap-5 md:grid-cols-3">
          {CHANNELS.map((c) => (
            <li
              key={c.key}
              className="flex flex-col bg-cream border border-ink/12 rounded-[4px] p-6 sm:p-7"
            >
              <p className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] ${c.accent}`}>
                <c.Icon aria-hidden="true" size={15} strokeWidth={2} className="shrink-0" />
                {b(c.label)}
              </p>
              <h2 className="font-display text-xl font-bold text-ink mt-3">{b(c.title)}</h2>
              <p className="prose-body-sm mt-3 text-ink-soft/80 flex-1">{b(c.body)}</p>

              <p className="font-mono text-xs text-ink-soft/70 mt-5 break-all">{c.value}</p>

              <a
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="mt-4 inline-flex items-center justify-center rounded-[4px] border border-navy/25
                  px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy/[0.05]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                  focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                {b(c.cta)}
              </a>
            </li>
          ))}
        </ul>
      </PageSection>

      {/* ── Hours, response time and escalation ── */}
      <PageSection surface="cream">
        <BodyHead heading={{ ar: 'مواعيدنا وإزاي بنرد.', en: 'Our hours, and how we respond.' }} />

        <dl className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              t: { ar: 'مواعيد العمل', en: 'Working hours' },
              d: { ar: 'الأحد – الخميس · ٩ص – ٦م', en: 'Sun – Thu · 9 am – 6 pm' },
            },
            {
              t: { ar: 'وقت الرد', en: 'Response time' },
              d: { ar: 'أقل من ساعة في مواعيد العمل', en: 'Under an hour during working hours' },
            },
            {
              t: { ar: 'لغة الدعم', en: 'Support language' },
              d: { ar: 'عربي وإنجليزي', en: 'Arabic and English' },
            },
            {
              t: { ar: 'مكاننا', en: 'Where we are' },
              d: { ar: 'قصر النيل · القاهرة', en: 'Qasr El Nil · Cairo' },
            },
          ].map((row, i) => (
            <div key={i} className="border-t border-ink/12 pt-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/60">
                {b(row.t)}
              </dt>
              <dd className="prose-body-sm mt-2 text-ink font-semibold">{b(row.d)}</dd>
            </div>
          ))}
        </dl>

        {/* Where we actually are — resolved from the owner's Maps link. */}
        <div className="mt-12 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
          <LocationMap />
          <div>
            <h3 className="font-display text-lg font-bold text-ink">
              {b({ ar: 'تعالى لنا', en: 'Come and see us' })}
            </h3>
            <p className="prose-body mt-3 text-ink-soft/85">
              {b({
                ar: 'المكتب في قصر الدوبارة، قصر النيل، القاهرة. لو جاي، ابعتلنا على واتساب الأول عشان نكون مستنينك.',
                en: 'The office is in Qasr Ad Dobarah, Qasr El Nil, Cairo. If you are coming over, message us on WhatsApp first so we are expecting you.',
              })}
            </p>
          </div>
        </div>

        <div className="mt-12 max-w-2xl">
          <h3 className="font-display text-lg font-bold text-ink">
            {b({ ar: 'لو المشكلة مستعجلة ومحدش رد', en: 'If it is urgent and nobody has replied' })}
          </h3>
          <p className="prose-body mt-3 text-ink-soft/85">
            {b({
              ar: 'ابعت على واتساب واكتب في أول الرسالة «عاجل» مع اسم متجرك ورقم الأوردر. لو لسه محتاج تصعيد، ابعت على sales@numueg.app بنفس التفاصيل.',
              en: 'Message WhatsApp and start with “urgent”, your store name and the order number. If you still need to escalate, email sales@numueg.app with the same details.',
            })}
          </p>
          <p className="prose-body-sm mt-4 text-ink-soft/70">
            {b({ ar: 'للأسئلة العامة، تقدر كمان تستخدم', en: 'For general questions you can also use' })}{' '}
            <Link
              to="/contact"
              className="font-semibold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy"
            >
              {b({ ar: 'صفحة التواصل', en: 'the contact page' })}
            </Link>
            .
          </p>
        </div>
      </PageSection>

      <PageClose
        heading={{ ar: 'لسه مبدأتش متجرك؟', en: 'Not started your store yet?' }}
        support={{
          ar: 'ابدأ من غير بطاقة ائتمان، والدعم معاك من أول يوم.',
          en: 'Start with no credit card — support is with you from day one.',
        }}
        action={<PrimaryCta onDark />}
      />
    </PageShell>
  );
};

export default Support;
