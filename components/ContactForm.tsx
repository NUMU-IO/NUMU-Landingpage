import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL || 'https://numueg.app/api/v1';

export type ContactFormVariant = 'email' | 'call';

interface ContactFormProps {
  variant: ContactFormVariant;
  /** Fires after a successful submit — caller can use it to close a modal */
  onSuccess?: () => void;
  /** Compact layout drops some spacing; use inside modals */
  compact?: boolean;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';
type TimeSlot = 'today' | 'tomorrow' | 'this_week' | 'anytime';

/**
 * Shared contact form — renders two field sets driven by `variant`:
 *
 *  "email" → full message form matching /contact:
 *            name, email, phone, country, city, message
 *
 *  "call"  → lightweight callback request (max conversion):
 *            name, phone, preferred time slot, topic (optional)
 *
 * Both POST to /public/contact. The call variant encodes its metadata into
 * the same `message` field, so nothing on the backend has to change. Sales
 * can filter on the `[CALLBACK]` prefix in their inbox.
 */
const ContactForm: React.FC<ContactFormProps> = ({
  variant,
  onSuccess,
  compact = false,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Email form state
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: isAr ? 'مصر' : 'Egypt',
    city: '',
    message: '',
  });

  // Call form state
  const [callForm, setCallForm] = useState({
    name: '',
    phone: '',
    slot: 'today' as TimeSlot,
    topic: '',
  });

  const timeSlots: { value: TimeSlot; label_en: string; label_ar: string }[] = [
    { value: 'today', label_en: 'Today', label_ar: 'النهاردة' },
    { value: 'tomorrow', label_en: 'Tomorrow', label_ar: 'بكرة' },
    { value: 'this_week', label_en: 'This week', label_ar: 'هذا الأسبوع' },
    { value: 'anytime', label_en: 'Anytime', label_ar: 'في أي وقت' },
  ];

  const slotLabel = (slot: TimeSlot): string => {
    const row = timeSlots.find((s) => s.value === slot);
    return row ? (isAr ? row.label_ar : row.label_en) : slot;
  };

  const inputClass =
    'h-11 sm:h-12 px-4 rounded-[4px] bg-cream border border-ink/25 text-ink placeholder:text-ink-soft/55 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu';

  // Labels: navy ink for hierarchy, 12px for legibility at uppercase+tracked
  const labelClass =
    'font-mono text-[12px] font-semibold text-navy uppercase tracking-[0.14em]';

  const textareaClass =
    'px-4 py-3 rounded-[4px] bg-cream border border-ink/25 text-ink placeholder:text-ink-soft/55 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu resize-none leading-relaxed';

  const postContact = async (payload: Record<string, string>) => {
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        const msg =
          json?.error?.message ||
          json?.detail ||
          (isAr ? 'فشل الإرسال' : 'Could not send');
        setErrorMsg(msg);
        setStatus('error');
        return;
      }
      setStatus('sent');
      onSuccess?.();
    } catch {
      setErrorMsg(
        isAr ? 'حدث خطأ، حاول مرة أخرى' : 'Something went wrong, try again',
      );
      setStatus('error');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postContact(emailForm);
  };

  const handleCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slot = slotLabel(callForm.slot);
    const message = `[CALLBACK] Preferred: ${slot}. ${callForm.topic ? `Topic: ${callForm.topic}` : ''}`.trim();
    postContact({
      name: callForm.name,
      email: '',
      phone: callForm.phone,
      country: isAr ? 'مصر' : 'Egypt',
      city: '',
      message,
    });
  };

  // ── Success state ─────────────────────────────────────────
  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-5 text-center py-4">
        <div className="size-14 rounded-[4px] bg-sage/15 border border-sage/40 flex items-center justify-center">
          <svg
            className="size-7 text-sage"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
            {variant === 'call'
              ? isAr
                ? 'المكالمة محجوزة.'
                : 'Call reserved.'
              : isAr
                ? 'تم إرسال الرسالة.'
                : 'Message sent.'}
          </h3>
          <p className="text-ink-soft/75 text-sm max-w-md mx-auto">
            {variant === 'call'
              ? isAr
                ? 'هنتصل بيك في الوقت اللي اخترته. خلّي موبايلك جنبك.'
                : "We'll call you at the time you picked. Keep your phone nearby."
              : isAr
                ? 'فريق الدعم هيرد في أقل من ساعة.'
                : 'Support replies within the hour.'}
          </p>
        </div>
      </div>
    );
  }

  // ── Call reservation form ─────────────────────────────────
  if (variant === 'call') {
    return (
      <form onSubmit={handleCallSubmit} className={compact ? 'flex flex-col gap-3' : 'flex flex-col gap-4'}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-call-name" className={labelClass}>
            {t('contact.name')}
          </label>
          <input
            id="contact-call-name"
            type="text"
            required
            autoComplete="name"
            value={callForm.name}
            onChange={(e) => setCallForm({ ...callForm, name: e.target.value })}
            className={inputClass}
            placeholder={t('contact.name_placeholder')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-call-phone" className={labelClass}>
            {t('contact.phone')}
          </label>
          <input
            id="contact-call-phone"
            type="tel"
            required
            dir="ltr"
            autoComplete="tel"
            value={callForm.phone}
            onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })}
            className={inputClass}
            placeholder="+20 1XX XXX XXXX"
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className={`${labelClass} mb-1`}>
            {isAr ? 'وقت مناسب للمكالمة' : 'Best time to call'}
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const active = callForm.slot === slot.value;
              return (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => setCallForm({ ...callForm, slot: slot.value })}
                  // eslint-disable-next-line jsx-a11y/aria-proptypes
                  aria-pressed={active}
                  className={`h-11 rounded-[4px] text-sm font-semibold border transition-all duration-200 ease-numu ${
                    active
                      ? 'bg-navy text-cream border-navy'
                      : 'bg-cream text-ink border-ink/15 hover:border-navy/40 hover:bg-navy/[0.03]'
                  }`}
                >
                  {isAr ? slot.label_ar : slot.label_en}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-call-topic" className={labelClass}>
            {isAr ? 'موضوع المكالمة (اختياري)' : 'Topic (optional)'}
          </label>
          <textarea
            id="contact-call-topic"
            rows={compact ? 2 : 3}
            value={callForm.topic}
            onChange={(e) => setCallForm({ ...callForm, topic: e.target.value })}
            className={textareaClass}
            placeholder={
              isAr
                ? 'مثلاً: عندي متجر بيبيع منتجات أطفال وعايز أحرّكه على نُمُو'
                : 'e.g. I run a kids-clothing store and want to move to numu'
            }
          />
        </div>

        {status === 'error' && (
          <p className="font-mono text-[11px] text-terracotta bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-2">
            {errorMsg || t('contact.error')}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="group mt-2 bg-navy text-cream font-semibold h-12 rounded-[4px] hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {status === 'sending' ? (
            <div className="h-5 w-5 rounded-full border-2 border-cream/30 border-t-cream animate-spin" />
          ) : (
            <>
              <span>{isAr ? 'احجز المكالمة' : 'Reserve the call'}</span>
              <span
                aria-hidden="true"
                className="text-saffron rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
              >
                →
              </span>
            </>
          )}
        </button>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/55 mt-1">
          {isAr
            ? 'مجاني · بدون التزام · هنتصل بيك أول ما نقدر'
            : 'Free · no commitment · we call as soon as we can'}
        </p>
      </form>
    );
  }

  // ── Email form (full-message variant) ─────────────────────
  return (
    <form onSubmit={handleEmailSubmit} className={compact ? 'flex flex-col gap-3' : 'flex flex-col gap-4'}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className={labelClass}>
          {t('contact.name')}
        </label>
        <input
          id="contact-name"
          type="text"
          required
          autoComplete="name"
          value={emailForm.name}
          onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
          className={inputClass}
          placeholder={t('contact.name_placeholder')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className={labelClass}>
          {t('contact.email')}
        </label>
        <input
          id="contact-email"
          type="email"
          required
          autoComplete="email"
          dir="ltr"
          value={emailForm.email}
          onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
          className={inputClass}
          placeholder={t('contact.email_placeholder')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-phone" className={labelClass}>
          {t('contact.phone')}
        </label>
        <input
          id="contact-phone"
          type="tel"
          required
          dir="ltr"
          autoComplete="tel"
          value={emailForm.phone}
          onChange={(e) => setEmailForm({ ...emailForm, phone: e.target.value })}
          className={inputClass}
          placeholder={t('contact.phone_placeholder') || '+20 1XX XXX XXXX'}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-country" className={labelClass}>
            {t('contact.country')}
          </label>
          <input
            id="contact-country"
            type="text"
            required
            autoComplete="country-name"
            value={emailForm.country}
            onChange={(e) => setEmailForm({ ...emailForm, country: e.target.value })}
            className={inputClass}
            placeholder={t('contact.country_placeholder') || (isAr ? 'مثلاً مصر' : 'e.g. Egypt')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-city" className={labelClass}>
            {t('contact.city')}
          </label>
          <input
            id="contact-city"
            type="text"
            required
            autoComplete="address-level2"
            value={emailForm.city}
            onChange={(e) => setEmailForm({ ...emailForm, city: e.target.value })}
            className={inputClass}
            placeholder={t('contact.city_placeholder') || (isAr ? 'مثلاً القاهرة' : 'e.g. Cairo')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className={labelClass}>
          {t('contact.message')}
        </label>
        <textarea
          id="contact-message"
          required
          rows={compact ? 4 : 5}
          value={emailForm.message}
          onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
          className={textareaClass}
          placeholder={t('contact.message_placeholder')}
        />
      </div>

      {status === 'error' && (
        <p className="font-mono text-[11px] text-terracotta bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-2">
          {errorMsg || t('contact.error')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group mt-2 bg-navy text-cream font-semibold h-12 rounded-[4px] hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {status === 'sending' ? (
          <div className="h-5 w-5 rounded-full border-2 border-cream/30 border-t-cream animate-spin" />
        ) : (
          <>
            <span>{t('contact.send')}</span>
            <span
              aria-hidden="true"
              className="text-saffron rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
            >
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
