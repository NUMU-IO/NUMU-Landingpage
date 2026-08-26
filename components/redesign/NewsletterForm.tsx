import React, { useState, useId } from 'react';
import { Mail, Send } from 'lucide-react';
import { useBi } from './ui';

/**
 * Footer email capture.
 *
 * ─── What this actually subscribes you to ─────────────────────────────────
 * There is no newsletter list on the backend. The only public email-capture
 * endpoint NUMU-api exposes is `POST /public/waitlist`
 * (`api/v1/routes/public/waitlist.py`) — the beta merchant list. So that is
 * where this posts, with `source: 'footer_newsletter'` so the two entry
 * points stay distinguishable in the table, and the copy says "أخبار نُمُو
 * وتحديثات المنتج" rather than promising a periodical that nobody sends.
 *
 * If a genuinely separate newsletter list is wanted, it needs its own
 * endpoint and table; this component then only changes its URL.
 *
 * ─── Why 409 is a success here ────────────────────────────────────────────
 * The endpoint rejects a duplicate email with 409. For a waitlist that is
 * correct — you cannot hold two places in a queue. For a subscribe box it is
 * not an error the visitor can act on, and showing them a red failure for
 * "you already gave us this address" is a bad outcome. 409 is therefore
 * reported as "you are already on the list".
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://numueg.app/api/v1';

type State = 'idle' | 'loading' | 'done' | 'already' | 'error';

const NewsletterForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { b } = useBi();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');
  const inputId = useId();
  const statusId = useId();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;

    setState('loading');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/public/waitlist`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, source: 'footer_newsletter' }),
      });

      if (res.status === 409) {
        setState('already');
        return;
      }

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setMessage(
          json?.error?.message ||
            json?.detail ||
            b({ ar: 'حصل خطأ، جرّب تاني.', en: 'Something went wrong, try again.' }),
        );
        setState('error');
        return;
      }

      setEmail('');
      setState('done');
    } catch {
      setMessage(b({ ar: 'حصل خطأ، جرّب تاني.', en: 'Something went wrong, try again.' }));
      setState('error');
    }
  };

  const settled = state === 'done' || state === 'already';

  return (
    <form onSubmit={submit} className={`w-full ${className}`} noValidate>
      <label
        htmlFor={inputId}
        className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/60"
      >
        <Mail aria-hidden="true" size={14} strokeWidth={2} className="shrink-0" />
        {b({ ar: 'أخبار نُمُو', en: 'numu updates' })}
      </label>

      <p className="prose-body-sm mt-1.5 text-ink-soft/70">
        {b({
          ar: 'ابعتلنا إيميلك ونبعتلك تحديثات المنتج وأخبار نُمُو. من غير سبام، وتقدر تلغي في أي وقت.',
          en: 'Leave your email and we will send product updates and numu news. No spam, unsubscribe whenever.',
        })}
      </p>

      <div className="mt-3.5 flex flex-col gap-2.5 sm:flex-row">
        <input
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          dir="ltr"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== 'idle' && state !== 'loading') setState('idle');
          }}
          placeholder="you@example.com"
          disabled={state === 'loading'}
          aria-describedby={statusId}
          className="min-w-0 flex-1 rounded-[6px] border border-ink/15 bg-cream px-3.5 py-2.5
            text-sm text-ink placeholder:text-ink-soft/40 transition-colors
            focus:border-navy/40 focus:outline-none focus-visible:ring-2
            focus-visible:ring-saffron focus-visible:ring-offset-2
            focus-visible:ring-offset-paper disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={state === 'loading'}
          className="shrink-0 rounded-[6px] bg-navy px-5 py-2.5 text-sm font-semibold text-cream
            transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper
            disabled:opacity-70"
        >
          <span className="inline-flex items-center gap-1.5">
            {state !== 'loading' && (
              <Send aria-hidden="true" size={14} strokeWidth={2} className="shrink-0 rtl:-scale-x-100" />
            )}
            {state === 'loading'
              ? b({ ar: 'بنبعت…', en: 'Sending…' })
              : b({ ar: 'اشترك', en: 'Subscribe' })}
          </span>
        </button>
      </div>

      {/* One live region for every outcome, so a screen reader hears the
          result without the form moving focus. */}
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className={`prose-body-sm mt-2.5 min-h-5 ${
          state === 'error' ? 'text-terracotta' : settled ? 'text-sage' : 'text-ink-soft/60'
        }`}
      >
        {state === 'done' && b({ ar: 'تمام — إيميلك اتسجّل.', en: 'Done — you are on the list.' })}
        {state === 'already' && b({ ar: 'إيميلك مسجّل عندنا بالفعل.', en: 'You are already on the list.' })}
        {state === 'error' && message}
      </p>
    </form>
  );
};

export default NewsletterForm;
