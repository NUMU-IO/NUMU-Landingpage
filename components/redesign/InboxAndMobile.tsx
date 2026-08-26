import React from 'react';
import { Section, SectionHead, AssetSlot, useBi } from './ui';
import { Reveal } from './Reveal';
import type { Bi } from './copy';

/**
 * تواصل — the omnichannel inbox, and numu on the phone.
 *
 * ─── Everything here is verified against the product ──────────────────────
 * Inbox:
 *   • The screenshot is the real `/inbox` screen from the merchant dashboard.
 *   • The three channels named — WhatsApp, Facebook, Instagram — are exactly
 *     the three filters the real inbox exposes
 *     (numo-merchant-hub/src/pages/Inbox.tsx). No other channel is claimed.
 *     Email and SMS are NOT inbox channels and are not mentioned.
 *
 * PWA:
 *   • The dashboard is a real installable PWA — `vite-plugin-pwa` with a
 *     hand-written service worker (numo-merchant-hub/vite.config.ts).
 *   • It is the DASHBOARD that installs, not this marketing site, and the
 *     copy says so.
 *   • Push notifications are marked "(Phase 2)" in the worker and are NOT
 *     implemented, so they are not claimed. Neither is offline editing —
 *     the worker runs an explicit NetworkOnly deny on /api/.
 *   • What is claimed: install to the home screen, and run the dashboard
 *     from the phone. Both are true today.
 */

const INBOX_POINTS: Bi[] = [
  {
    ar: 'محادثات واتساب وفيسبوك وإنستغرام في صندوق واحد، مش في تلات تطبيقات.',
    en: 'WhatsApp, Facebook and Instagram conversations in one inbox, not across three apps.',
  },
  {
    ar: 'فلتر بالقناة، وبحث في المحادثات، وحالة واضحة لكل محادثة.',
    en: 'Filter by channel, search the conversations, and see a clear status on each one.',
  },
  {
    ar: 'العميل وطلباته قدامك وانت بترد، من غير ما تفتح شاشة تانية.',
    en: 'The customer and their orders sit beside the thread while you reply.',
  },
];

const MOBILE_POINTS: Bi[] = [
  {
    ar: 'ثبّت لوحة التحكم على شاشة موبايلك وافتحها زي أي تطبيق.',
    en: 'Install the dashboard to your phone’s home screen and open it like any app.',
  },
  {
    ar: 'تابع الأوردرات والمنتجات والعملاء والرسائل وانت بره المكتب.',
    en: 'Follow orders, products, customers and messages while you are away from the desk.',
  },
];

const InboxAndMobile: React.FC = () => {
  const { b } = useBi();

  return (
    <Section id="inbox" surface="cream" labelledBy="inbox-heading">
      <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
        <div>
          <SectionHead
            id="inbox-heading"
            eyebrow={{ ar: 'تواصل', en: 'Conversations' }}
            heading={{
              ar: 'كل رسايل عملائك في مكان واحد.',
              en: 'Every customer message in one place.',
            }}
            support={{
              ar: 'صندوق وارد واحد بيجمع واتساب وفيسبوك وإنستغرام، فمحدش بيضيع بين التطبيقات ومفيش رسالة بتفوتك.',
              en: 'One inbox that gathers WhatsApp, Facebook and Instagram, so nothing gets lost between apps and no message slips past you.',
            }}
          />

          <ul className="mt-9 space-y-4">
            {INBOX_POINTS.map((point, i) => (
              <Reveal as="li" key={i} delay={i * 90} className="flex gap-3.5">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-saffron" />
                <span className="prose-body-sm text-ink-soft/85">{b(point)}</span>
              </Reveal>
            ))}
          </ul>

          {/* ── numu on the phone ── */}
          <Reveal delay={280} className="mt-10 rounded-[10px] border border-ink/12 bg-paper p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-navy">
              {b({ ar: 'على الموبايل', en: 'On mobile' })}
            </p>
            <h3 className="font-display text-[19px]/[1.4] font-bold text-ink mt-2.5">
              {b({ ar: 'نُمُو معاك على الموبايل.', en: 'numu comes with you on the phone.' })}
            </h3>
            <p className="prose-body-sm mt-2.5 text-ink-soft/80">
              {b({
                ar: 'لوحة التحكم تطبيق ويب تقدّمي (PWA) — تثبّتها على شاشة الموبايل من المتصفح من غير ما تنزّل حاجة من أي متجر تطبيقات.',
                en: 'The dashboard is a progressive web app — install it to your home screen straight from the browser, with nothing to download from an app store.',
              })}
            </p>
            <ul className="mt-4 space-y-2.5">
              {MOBILE_POINTS.map((point, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-navy/40" />
                  <span className="prose-body-sm text-ink-soft/80">{b(point)}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={120} className="overflow-hidden rounded-[10px] border border-ink/10 bg-cream numu-mockup-frame">
          <AssetSlot
            asset="inbox"
            ratio={16 / 10}
            alt={{
              ar: 'صندوق الوارد في نُمُو: محادثات من واتساب وفيسبوك وإنستغرام في قائمة واحدة.',
              en: 'The numu inbox: conversations from WhatsApp, Facebook and Instagram in one list.',
            }}
          />
        </Reveal>
      </div>
    </Section>
  );
};

export default InboxAndMobile;
