import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContactModal } from '../contexts/ContactModalContext';
import ContactForm from './ContactForm';

/**
 * Contact modal — renders either the email message form or the phone
 * reservation form in brand-kit editorial chrome. Mounted once at root
 * via App.tsx and opened via useContactModal().open('email' | 'call').
 */
const ContactModal: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === 'ar';
  const { isOpen, variant, close } = useContactModal();

  // Lock body scroll while open + Escape-to-close
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close();
  };

  const isCall = variant === 'call';

  const marker = isCall
    ? `§ ${isAr ? 'احجز مكالمة' : 'BOOK A CALL'} · CAIRO · 2026`
    : `§ ${isAr ? 'راسلنا' : 'CONTACT'} · CAIRO · 2026`;

  const title = isCall
    ? isAr
      ? 'هنكلّمك في الوقت المناسب ليك.'
      : "We'll call when it works for you."
    : isAr
      ? 'اتكلم معانا.'
      : "Let's talk.";

  const subtitle = isCall
    ? isAr
      ? 'فريق المبيعات هيرد خلال ساعتين في ساعات العمل.'
      : 'Our sales team calls back within two business hours.'
    : isAr
      ? 'هنرد عليك في أقل من ساعة خلال أوقات العمل.'
      : 'We reply within the hour during business hours.';

  return (
    <div
      className="fixed inset-0 z-[100]"
      dir={dir}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      {/* Backdrop — fixed so it always covers the viewport, even when the
          scroll container scrolls past the panel */}
      <div
        onClick={close}
        className="fixed inset-0 bg-ink/80 backdrop-blur-md animate-modal-backdrop"
        aria-hidden="true"
      />

      {/* Scroll container — the whole modal (panel + § marker) scrolls
          together. items-start on mobile so short viewports start at top;
          items-center on desktop. */}
      <div className="relative h-full overflow-y-auto">
        <div
          onClick={handleBackdropClick}
          className="min-h-full flex items-start sm:items-center justify-center p-4 sm:py-10 sm:px-6"
        >
          {/* Panel — opaque paper, ring for edge definition, navy-tinted
              drop shadow. No internal overflow; the wrapper above scrolls. */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[600px] my-4 sm:my-0 bg-paper ring-1 ring-ink/10 rounded-[14px] shadow-modal-panel animate-modal-panel"
          >
        {/* § marker peeking above top edge */}
        <span className="absolute -top-3 start-6 bg-paper px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta border border-terracotta/40 rounded-[2px] font-semibold whitespace-nowrap">
          {marker}
        </span>

        {/* Close button */}
        <button
          type="button"
          onClick={close}
          aria-label={isAr ? 'إغلاق' : 'Close'}
          className="absolute top-4 end-4 size-8 rounded-[4px] flex items-center justify-center text-ink-soft hover:text-terracotta hover:bg-terracotta/5 transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-8 sm:p-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-saffron/15 border border-saffron/40 rounded-[4px] px-3 py-1 mb-4">
              <span
                className="size-1.5 rounded-full bg-saffron animate-pulse"
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] font-semibold text-saffron uppercase tracking-[0.18em]">
                {isCall
                  ? isAr
                    ? 'مبيعات · رد سريع'
                    : 'SALES · FAST REPLY'
                  : isAr
                    ? 'دعم · بالعربي'
                    : 'SUPPORT · IN ARABIC'}
              </span>
            </div>

            <h2
              id="contact-modal-title"
              className="font-display text-3xl sm:text-[36px] font-bold text-ink tracking-tight leading-[1.05] mb-3"
            >
              {title}
            </h2>
            <p className="prose-body-sm text-ink/75">
              {subtitle}
            </p>
          </div>

          <ContactForm variant={variant} compact onSuccess={() => {
            // Give the success state 1.8s of dwell time, then auto-close
            setTimeout(close, 1800);
          }} />
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
