import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useWaitlistModal } from '../contexts/WaitlistModalContext';

const API_BASE = import.meta.env.VITE_API_URL || 'https://numueg.app/api/v1';

interface WaitlistStats {
  total_signups: number;
  stores_launched: number;
}

const toArabicDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) =>
    String.fromCharCode(0x0660 + parseInt(d, 10)),
  );

/**
 * Waitlist modal — editorial paper panel, terracotta § marker,
 * flat navy form inputs. Triggered via useWaitlistModal().open().
 * Auto-opens on ?ref=XXXX URL param.
 */
const WaitlistModal: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === 'ar';
  const { isOpen, incomingRef: ctxRef, open, close } = useWaitlistModal();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [localRef, setLocalRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [position, setPosition] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<WaitlistStats | null>(null);

  // Auto-open when arriving via ?ref=XXXX
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref && !isOpen) {
      open(ref);
    }
  }, [searchParams, isOpen, open]);

  useEffect(() => {
    if (ctxRef) setLocalRef(ctxRef);
  }, [ctxRef]);

  // Load stats once when modal first opens
  useEffect(() => {
    if (!isOpen || stats) return;
    fetch(`${API_BASE}/public/waitlist/stats`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => setStats(json.data ?? json))
      .catch(() => {});
  }, [isOpen, stats]);

  // Lock body scroll while open; handle Escape to close
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/public/waitlist`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          referral_code: localRef || undefined,
          source: 'landing_page_modal',
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg =
          json?.error?.message ||
          json?.detail ||
          (isAr ? 'حدث خطأ' : 'Something went wrong');
        setError(msg);
        return;
      }

      const data = json.data ?? json;
      setReferralCode(data.referral_code);
      setPosition(data.position);
      setSubmitted(true);
    } catch {
      setError(isAr ? 'حدث خطأ، حاول مرة أخرى' : 'Something went wrong, try again');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/?ref=${referralCode}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100]"
      dir={dir}
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-modal-title"
    >
      {/* Backdrop — fixed so it always covers the viewport even when the
          scroll container (below) scrolls past the panel */}
      <div
        onClick={close}
        className="fixed inset-0 bg-ink/80 backdrop-blur-md animate-modal-backdrop"
        aria-hidden="true"
      />

      {/* Scroll container — the WHOLE modal (panel + § marker) scrolls
          together when content overflows. items-start on mobile so short
          viewports start at the top; items-center on desktop for normal
          centered dialog behavior. */}
      <div className="relative h-full overflow-y-auto">
        <div
          onClick={handleBackdropClick}
          className="min-h-full flex items-start sm:items-center justify-center p-4 sm:py-10 sm:px-6"
        >
          {/* Panel — opaque paper, ring for edge definition, navy-tinted
              drop shadow. No internal overflow; the wrapper above scrolls. */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[640px] my-4 sm:my-0 bg-paper ring-1 ring-ink/10 rounded-[14px] shadow-modal-panel animate-modal-panel"
          >
        {/* § marker peeking above top edge */}
        <span className="absolute -top-3 start-6 bg-paper px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta border border-terracotta/40 rounded-[2px] font-semibold">
          § WAITLIST · CAIRO · 2026
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
          {submitted ? (
            /* ── Submitted state ─────────────────── */
            <div className="flex flex-col items-center gap-6 text-center">
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
                <h3
                  id="waitlist-modal-title"
                  className="font-display text-3xl font-bold text-ink tracking-tight mb-2"
                >
                  {isAr ? 'أنت على القائمة.' : "You're on the list."}
                </h3>
                <p className="text-ink-soft/75 text-sm sm:text-base max-w-md mx-auto">
                  {isAr
                    ? 'هنبعتلك إيميل لما يجيلك الدور. شارك الكود عشان تطلع في الترتيب.'
                    : "We'll email you when it's your turn. Share your code to move up."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <div className="flex-1 bg-cream border border-ink/10 border-s-[3px] border-s-saffron rounded-[4px] p-4 text-center">
                  <p className="font-mono text-[10px] text-ink-soft/60 uppercase tracking-[0.18em] mb-1">
                    {isAr ? 'ترتيبك' : 'Position'}
                  </p>
                  <p className="font-display text-3xl font-bold text-navy tabular-nums">
                    #{isAr ? toArabicDigits(position) : position}
                  </p>
                </div>
                <div className="flex-1 bg-cream border border-ink/10 border-s-[3px] border-s-terracotta rounded-[4px] p-4 text-center">
                  <p className="font-mono text-[10px] text-ink-soft/60 uppercase tracking-[0.18em] mb-1">
                    {isAr ? 'كود الإحالة' : 'Referral Code'}
                  </p>
                  <p className="font-mono text-xl font-semibold text-navy tracking-widest">
                    {referralCode}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={copyLink}
                className="group bg-navy text-cream font-semibold h-11 px-7 rounded-[4px] hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center gap-3 text-sm"
              >
                <span>
                  {copied
                    ? isAr
                      ? 'تم النسخ'
                      : 'Copied'
                    : isAr
                      ? 'نسخ رابط الإحالة'
                      : 'Copy Referral Link'}
                </span>
                <span aria-hidden="true" className="text-saffron">
                  {copied ? '✓' : '⧉'}
                </span>
              </button>

              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/55">
                {isAr ? 'لديك كود دعوة؟' : 'Already invited?'}{' '}
                <Link
                  to="/signup"
                  onClick={close}
                  className="text-terracotta hover:text-navy underline transition-colors"
                >
                  {isAr ? 'سجّل الآن' : 'Sign up now'} →
                </Link>
              </p>
            </div>
          ) : (
            /* ── Form state ──────────────────────── */
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-saffron/15 border border-saffron/40 rounded-[4px] px-3 py-1 mb-4">
                  <span
                    className="size-1.5 rounded-full bg-saffron animate-pulse"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] font-semibold text-saffron uppercase tracking-[0.18em]">
                    {isAr ? 'بيتا خاصة' : 'PRIVATE BETA'}
                  </span>
                </div>

                <h2
                  id="waitlist-modal-title"
                  className="font-display text-3xl sm:text-[36px] font-bold text-ink tracking-tight leading-[1.05] mb-3"
                >
                  {isAr ? (
                    <>
                      انضم <span className="text-terracotta">لقائمة الانتظار.</span>
                    </>
                  ) : (
                    <>
                      Get on the <span className="text-terracotta">waitlist.</span>
                    </>
                  )}
                </h2>
                <p className="prose-body-sm text-ink/75">
                  {isAr
                    ? 'إحنا في مرحلة البيتا الخاصة. سجّل بريدك واحصل على وصول مبكر لمنصة نُمُو — وشارك الكود عشان تطلع في الترتيب.'
                    : "We're in private beta. Sign up for early access — share your code to move up the queue."}
                </p>

                {stats && stats.total_signups > 0 && (
                  <div className="flex flex-wrap items-center gap-4 mt-5">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-1.5 rounded-full bg-sage"
                        aria-hidden="true"
                      />
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/70">
                        <span className="font-display font-bold text-navy tabular-nums">
                          {isAr
                            ? toArabicDigits(stats.total_signups)
                            : stats.total_signups.toLocaleString()}
                          +
                        </span>{' '}
                        {isAr ? 'تاجر بينتظر' : 'merchants waiting'}
                      </span>
                    </div>
                    {stats.stores_launched > 0 && (
                      <>
                        <span className="w-px h-4 bg-bone" aria-hidden="true" />
                        <div className="flex items-center gap-2">
                          <span
                            className="size-1.5 rounded-full bg-terracotta"
                            aria-hidden="true"
                          />
                          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/70">
                            <span className="font-display font-bold text-terracotta tabular-nums">
                              {isAr
                                ? toArabicDigits(stats.stores_launched)
                                : stats.stores_launched}
                            </span>{' '}
                            {isAr ? 'متجر مفتوح' : 'stores launched'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAr ? 'بريدك الإلكتروني' : 'Your email address'}
                  required
                  autoFocus
                  className="h-12 px-4 rounded-[4px] bg-cream border border-ink/15 text-ink placeholder:text-ink-soft/45 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15 transition-all duration-200 ease-numu"
                  dir="ltr"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? 'اسمك (اختياري)' : 'Your name (optional)'}
                  className="h-12 px-4 rounded-[4px] bg-cream border border-ink/15 text-ink placeholder:text-ink-soft/45 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15 transition-all duration-200 ease-numu"
                />

                {localRef && (
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-sage bg-sage/10 border border-sage/30 rounded-[4px] px-3 py-2 font-semibold">
                    <span
                      className="size-1.5 rounded-full bg-sage"
                      aria-hidden="true"
                    />
                    {isAr ? `إحالة: ${localRef}` : `Referred by: ${localRef}`}
                  </div>
                )}

                {error && (
                  <p className="font-mono text-[11px] text-terracotta bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="group bg-navy text-cream font-semibold h-12 rounded-[4px] hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-cream/30 border-t-cream animate-spin" />
                  ) : (
                    <>
                      <span>{isAr ? 'انضم للقائمة' : 'Join Waitlist'}</span>
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

              <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/55 mt-4">
                {isAr ? 'لديك كود دعوة؟' : 'Have an invite code?'}{' '}
                <Link
                  to="/signup"
                  onClick={close}
                  className="text-terracotta hover:text-navy underline transition-colors"
                >
                  {isAr ? 'سجّل مباشرة' : 'Sign up directly'} →
                </Link>
              </p>
            </>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistModal;
