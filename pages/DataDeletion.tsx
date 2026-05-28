import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * /data-deletion — public page required by Meta's app review for the
 * "User Data Deletion" Basic Settings field. Required reading for any
 * GDPR-relevant data flows (we store merchant + customer phone numbers
 * for WhatsApp opt-ins, addresses, order history).
 *
 * Bilingual (en + ar) with content inlined rather than going through the
 * translation context — that way nothing else has to change. The page
 * matches the visual structure of Privacy.tsx (nav, hero chip, h1,
 * accented section cards) so it feels native to the rest of the site.
 */

type Section = {
  title: string;
  body: React.ReactNode;
  accent: 'navy' | 'saffron' | 'sage' | 'terracotta';
};

const accentBar: Record<string, string> = {
  navy: 'bg-navy',
  saffron: 'bg-saffron',
  sage: 'bg-sage',
  terracotta: 'bg-terracotta',
};

const DELETION_EMAIL = 'numueg1@gmail.com';
const MAILTO_HREF = `mailto:${DELETION_EMAIL}?subject=${encodeURIComponent(
  'Data Deletion Request',
)}`;

const DataDeletion: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === 'ar';

  useSEO({
    title: isAr
      ? 'حذف بيانات المستخدم — نُمُو'
      : 'User data deletion — numu',
    description: isAr
      ? 'إزاي تطلب حذف بياناتك الشخصية من منصة نُمُو، والمدة اللي بناخدها للرد، والبيانات اللي ممكن نضطر نحتفظ بيها لأسباب قانونية.'
      : 'How to request deletion of your personal data from numu, our response timeframe, and the data we may be legally required to retain.',
    canonical: 'https://numueg.app/data-deletion',
  });

  const sections: Section[] = isAr
    ? [
        {
          title: 'البيانات اللي بنخزنها عنك',
          accent: 'navy',
          body: (
            <p className="prose-body text-ink/80">
              لو إنت تاجر على نُمُو، بنخزن إيميلك، رقم تليفونك، اسم متجرك،
              بيانات الدفع، وسجل الطلبات والمنتجات. لو إنت زبون اشتريت من
              متجر على نُمُو، بنخزن اسمك، رقم تليفونك (لو وافقت على
              رسايل واتساب)، عنوان الشحن، وسجل طلباتك. كل البيانات مرتبطة
              بحسابك أو برقم تليفونك.
            </p>
          ),
        },
        {
          title: 'إزاي تطلب الحذف',
          accent: 'saffron',
          body: (
            <div className="space-y-3 prose-body text-ink/80">
              <p>
                ابعت إيميل على{' '}
                <a
                  href={MAILTO_HREF}
                  className="text-navy underline underline-offset-2 hover:text-navy/80"
                >
                  {DELETION_EMAIL}
                </a>{' '}
                من نفس الإيميل المسجل عندنا، وقول إنك عايز تحذف بياناتك.
              </p>
              <p>
                لو كنت زبون مش تاجر، ابعت من إيميلك مع رقم التليفون اللي
                استخدمته في الشراء، عشان نقدر نلاقي حسابك.
              </p>
              <p>
                ممكن كمان ترد بكلمة <span className="font-mono">STOP</span>{' '}
                على أي رسالة واتساب جايالك من متجر على نُمُو، وده هيوقف
                الرسايل التسويقية فوراً — بس الحذف الكامل لازم تبعت إيميل.
              </p>
            </div>
          ),
        },
        {
          title: 'مدة الرد',
          accent: 'sage',
          body: (
            <p className="prose-body text-ink/80">
              بنحذف بياناتك خلال 30 يوم من تأكيد طلبك (الحد الأقصى 90 يوم
              في الحالات المعقدة). هنبعتلك إيميل تأكيد بعد الحذف.
            </p>
          ),
        },
        {
          title: 'البيانات اللي بنحتفظ بيها',
          accent: 'terracotta',
          body: (
            <p className="prose-body text-ink/80">
              في حالات محددة بيفرضها القانون، ممكن نحتفظ ببعض البيانات
              لمدة محدودة: فواتير وسجلات معاملات مالية (للضرايب)، طلبات
              مش متسلمة، أو نزاعات استرداد قائمة. البيانات دي بتتحذف تلقائياً
              بعد انتهاء مدة الالتزام القانوني، وبتفضل محمية ومش بنستخدمها
              لأي غرض تاني.
            </p>
          ),
        },
        {
          title: 'البيانات على ميتا (واتساب وفيسبوك)',
          accent: 'navy',
          body: (
            <p className="prose-body text-ink/80">
              لو وافقت على رسايل واتساب من متجر، بنخزن سجل اشتراك (رقم
              التليفون + تاريخ الموافقة + المتجر). لما تطلب الحذف، بنحذف
              السجل ده فوراً. أي بيانات تانية بتمر على واتساب من ميتا
              نفسها بتتحكم فيها{' '}
              <a
                href="https://www.whatsapp.com/legal/business-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy underline underline-offset-2 hover:text-navy/80"
              >
                سياسة واتساب للأعمال
              </a>
              .
            </p>
          ),
        },
        {
          title: 'سؤال أو شكوى',
          accent: 'saffron',
          body: (
            <p className="prose-body text-ink/80">
              لو طلبك اتأخر أو محتاج توضيح، ابعت تاني على{' '}
              <a
                href={MAILTO_HREF}
                className="text-navy underline underline-offset-2 hover:text-navy/80"
              >
                {DELETION_EMAIL}
              </a>{' '}
              مع عنوان الإيميل الأصلي. كمان تقدر تشتكي للهيئة المختصة في
              بلدك لحماية البيانات.
            </p>
          ),
        },
      ]
    : [
        {
          title: 'What data we hold about you',
          accent: 'navy',
          body: (
            <p className="prose-body text-ink/80">
              If you are a merchant on numu, we store your email, phone
              number, store name, payment-method metadata, and the history
              of orders and products in your account. If you are a customer
              who bought from a numu store, we store your name, phone
              number (if you opted in to WhatsApp messaging), shipping
              address, and order history. All data is keyed to your
              account or phone number.
            </p>
          ),
        },
        {
          title: 'How to request deletion',
          accent: 'saffron',
          body: (
            <div className="space-y-3 prose-body text-ink/80">
              <p>
                Email us at{' '}
                <a
                  href={MAILTO_HREF}
                  className="text-navy underline underline-offset-2 hover:text-navy/80"
                >
                  {DELETION_EMAIL}
                </a>{' '}
                from the email registered on your account, asking us to
                delete your data.
              </p>
              <p>
                If you were a customer (not a merchant), email us from any
                address and include the phone number you used at checkout
                so we can locate your record.
              </p>
              <p>
                You can also reply <span className="font-mono">STOP</span>{' '}
                to any WhatsApp message sent by a numu store, which
                immediately revokes marketing consent — full deletion
                still requires the email above.
              </p>
            </div>
          ),
        },
        {
          title: 'Response time',
          accent: 'sage',
          body: (
            <p className="prose-body text-ink/80">
              We complete deletion within 30 days of confirming your
              request (90 days maximum in complex cases). You will receive
              a confirmation email once your data has been removed.
            </p>
          ),
        },
        {
          title: 'Data we may retain',
          accent: 'terracotta',
          body: (
            <p className="prose-body text-ink/80">
              In specific cases mandated by law, we may retain limited
              data for a limited period: invoices and financial-transaction
              records (tax obligations), undelivered shipments, and open
              refund disputes. This data is auto-purged once the legal
              retention period expires and is never used for any other
              purpose.
            </p>
          ),
        },
        {
          title: 'Meta data (WhatsApp and Facebook)',
          accent: 'navy',
          body: (
            <p className="prose-body text-ink/80">
              If you consented to WhatsApp messaging from a store, we
              store an opt-in record (phone number + consent timestamp +
              store). When you request deletion, this record is removed
              immediately. Any data flowing through WhatsApp on Meta's own
              infrastructure is governed by the{' '}
              <a
                href="https://www.whatsapp.com/legal/business-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy underline underline-offset-2 hover:text-navy/80"
              >
                WhatsApp Business Policy
              </a>
              .
            </p>
          ),
        },
        {
          title: 'Questions or complaints',
          accent: 'saffron',
          body: (
            <p className="prose-body text-ink/80">
              If your request is delayed or you need clarification, email
              us again at{' '}
              <a
                href={MAILTO_HREF}
                className="text-navy underline underline-offset-2 hover:text-navy/80"
              >
                {DELETION_EMAIL}
              </a>{' '}
              with the subject line of your original request. You also
              have the right to lodge a complaint with the data
              protection authority in your jurisdiction.
            </p>
          ),
        },
      ];

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
        <div className="inline-flex items-center gap-2 bg-terracotta/15 border border-terracotta/40 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-terracotta" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-terracotta uppercase tracking-[0.18em]">
            § DATA DELETION · {isAr ? 'مارس ٢٠٢٦' : 'March 2026'}
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? 'حذف بيانات المستخدم' : 'User data deletion'}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? 'إنت عندك الحق إنك تطلب حذف بياناتك الشخصية من نُمُو في أي وقت. الصفحة دي بتقولك إزاي تعمل ده وإيه اللي بيحصل بعدها.'
            : 'You have the right to request deletion of your personal data from numu at any time. This page explains how to do that and what happens after.'}
        </p>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="flex flex-col gap-3">
          {sections.map(({ title, body, accent }, i) => (
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
                {title}
              </h2>
              {body}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataDeletion;
