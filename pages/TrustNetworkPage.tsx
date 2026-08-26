import React from 'react';
import { PageShell, PageSection, PageClose, BodyHead } from '../components/redesign/PageShell';
import { PrimaryCta, SecondaryCta, AssetSlot, useBi } from '../components/redesign/ui';
import { cod } from '../components/redesign/copy';
import type { Bi } from '../components/redesign/copy';

/**
 * /trust-network — "Explain risk signals, control, and privacy."
 *
 * Structure fixed by `pages/other-pages.md`: the human explanation first —
 * what the system shows, what the merchant controls, what is opt-in, and the
 * three possible actions — with data handling *below* it.
 *
 * Two rules govern the language on this page:
 *
 *   • No fear framing. Never "bad customer", never "fraudster", and never any
 *     wording implying numu passes final judgement on a person.
 *   • Nothing unapproved. `07-cod-operations.md` requires product and security
 *     sign-off on every behavioural or risk claim, so this page describes the
 *     merchant-facing behaviour and the boundaries — and deliberately stops
 *     short of hashing scheme, retention windows, fail-open semantics and
 *     appeal mechanics, which are still PENDING that review.
 */

const CONTROL: { title: Bi; body: Bi }[] = [
  {
    title: { ar: 'الخاصية اختيارية', en: 'The feature is opt-in' },
    body: {
      ar: 'مفيش حاجة بتشتغل من غير ما تفعّلها انت. تقدر تقفلها في أي وقت، والمتجر بيفضل شغال عادي.',
      en: 'Nothing runs until you switch it on. You can switch it off at any time and the store keeps working as normal.',
    },
  },
  {
    title: { ar: 'الإشارة مش قرار', en: 'A signal is not a decision' },
    body: {
      ar: 'نُمُو بيوريك إشارة على الأوردر. هو مش بيلغي أوردر ولا بيرفض عميل — القرار بيفضل عندك انت.',
      en: 'numu shows you a signal on the order. It does not cancel an order or refuse a customer — the decision stays with you.',
    },
  },
  {
    title: { ar: 'القرار بتاعك مسجّل', en: 'Your decision is the record' },
    body: {
      ar: 'اللي بيتنفّذ هو الإجراء اللي انت اخترته على الأوردر، مش استنتاج تلقائي من النظام.',
      en: 'What happens is the action you chose on the order, not an automatic inference from the system.',
    },
  },
];

const AR_DIGITS = ['١', '٢', '٣'];

const TrustNetworkPage: React.FC = () => {
  const { b, isAr } = useBi();

  return (
    <PageShell
      slug="trust-network"
      eyebrow={{ ar: 'Trust Network', en: 'Trust Network' }}
      heading={cod.heading}
      lead={cod.support}
      title={{
        ar: 'Trust Network — إشارات الريسك في الدفع عند الاستلام | نُمُو',
        en: 'Trust Network — cash-on-delivery risk signals | numu',
      }}
      description={{
        ar: 'إزاي بتشوف إشارة الريسك على أوردر الدفع عند الاستلام، وإيه اللي بتتحكم فيه انت، وإيه حدود البيانات.',
        en: 'How you see a risk signal on a cash-on-delivery order, what stays under your control, and where the data boundaries sit.',
      }}
      action={<PrimaryCta />}
    >
      {/* ── What it shows, and the three actions ── */}
      <PageSection surface="paper">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
          <div>
            <BodyHead
              heading={{ ar: 'إيه اللي بتشوفه بالظبط.', en: 'What you actually see.' }}
              support={{
                ar: 'على أوردر الدفع عند الاستلام، بتلاقي إشارة بتلخّص إذا كان الأوردر ده محتاج نظرة تانية قبل الشحن ولا لأ.',
                en: 'On a cash-on-delivery order you find a signal summarising whether this order deserves a second look before you ship it.',
              }}
            />

            <ol className="mt-9 space-y-5">
              {cod.steps.map((step, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="grid place-items-center size-9 shrink-0 rounded-full border border-navy/25
                      bg-cream font-display text-sm font-bold text-navy"
                  >
                    {isAr ? AR_DIGITS[i] : i + 1}
                  </span>
                  <span className="font-display text-base sm:text-lg font-bold text-ink">
                    {b(step)}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-navy-900 numu-navy-surface rounded-[4px] p-5 sm:p-7">
            <div className="relative z-10">
              <div className="overflow-hidden rounded-[4px] border border-cream/10 bg-navy-800">
                <AssetSlot
                  asset="ordersWorkflow"
                  ratio={16 / 10}
                  alt={{
                    ar: 'شاشة الأوردر في نُمُو وعليها إشارة الريسك والإجراءات المتاحة للتاجر.',
                    en: 'The numu order screen showing the risk signal and the merchant actions.',
                  }}
                />
              </div>

              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/50">
                {b({ ar: 'الإجراءات اللي بإيدك', en: 'The actions you control' })}
              </p>
              <ul className="mt-3 space-y-2.5">
                {cod.actions.map((action, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-[4px] border border-cream/15 bg-cream/[0.06] px-4 py-3"
                  >
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${['bg-sage', 'bg-saffron', 'bg-terracotta'][i]}`}
                    />
                    <span className="text-sm font-semibold text-cream">{b(action)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </PageSection>

      {/* ── What the merchant controls ── */}
      <PageSection surface="cream">
        <BodyHead
          heading={{ ar: 'انت اللي ماسك القرار.', en: 'You hold the decision.' }}
          support={{
            ar: 'الجزء ده هو الأهم في الخاصية، وعشان كده مكتوب قبل أي كلام تقني.',
            en: 'This is the most important part of the feature, which is why it comes before anything technical.',
          }}
        />

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {CONTROL.map((item, i) => (
            <li key={i} className="bg-paper border border-ink/12 rounded-[4px] p-6">
              <h3 className="font-display text-lg font-bold text-ink">{b(item.title)}</h3>
              <p className="prose-body-sm mt-3 text-ink-soft/85">{b(item.body)}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      {/* ── Data handling — kept below the human explanation ── */}
      <PageSection surface="paper">
        <BodyHead
          heading={{ ar: 'البيانات وحدودها.', en: 'The data, and its boundaries.' }}
        />

        <div className="mt-8 max-w-2xl space-y-5">
          <p className="prose-body text-ink-soft/85">
            {b({
              ar: 'الإشارة بتتبنى على سلوك الأوردرات، مش على رأي في العميل نفسه. ومحدش من التجار بيشوف بيانات عميل تاجر تاني.',
              en: 'The signal is built from order behaviour, not from an opinion about the customer. No merchant sees another merchant’s customer data.',
            })}
          </p>
          <p className="prose-body text-ink-soft/85">
            {b({
              ar: 'بيانات متجرك بتفضل بتاعتك، وتقدر تصدّرها أو تطلب حذفها في أي وقت.',
              en: 'Your store data stays yours, and you can export it or request its deletion at any time.',
            })}
          </p>

          {/* The remaining technical detail is not published until product and
              security sign it off — stating it early would be the exact
              unapproved claim the spec guards against. */}
          <p className="prose-body-sm text-ink-soft/65 border-s-2 border-saffron/50 ps-4">
            {b({
              ar: 'التفاصيل التقنية الكاملة — طريقة التشفير، مدة الاحتفاظ بالبيانات، والتظلّم — بتتنشر في وثيقة الخصوصية والأمان الخاصة بالخاصية. لو محتاجها دلوقتي، كلّمنا.',
              en: 'The full technical detail — the hashing scheme, retention windows and the appeal route — is published in the feature’s dedicated privacy and security document. If you need it now, contact us.',
            })}
          </p>
        </div>
      </PageSection>

      <PageClose
        heading={{ ar: 'شغّلها لما تبقى جاهز.', en: 'Switch it on when you are ready.' }}
        support={{
          ar: 'افتح متجرك الأول، والخاصية موجودة مستنياك تفعّلها وقت ما تحب.',
          en: 'Open your store first — the feature is there waiting whenever you decide to enable it.',
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

export default TrustNetworkPage;
