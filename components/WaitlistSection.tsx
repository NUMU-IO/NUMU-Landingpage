import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL || 'https://numueg.app/api/v1';

interface WaitlistStats {
  total_signups: number;
  stores_launched: number;
}

const WaitlistSection: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const isAr = language === 'ar';
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [incomingRef, setIncomingRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [position, setPosition] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<WaitlistStats | null>(null);

  // Read referral code from URL ?ref=XXXX and auto-scroll to form
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setIncomingRef(ref);
      // Auto-scroll to waitlist section after a short delay for render
      setTimeout(() => {
        document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch(`${API_BASE}/public/waitlist/stats`, { credentials: 'include' })
      .then(r => r.json())
      .then(json => setStats(json.data ?? json))
      .catch(() => {});
  }, []);

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
        body: JSON.stringify({ email, name: name || undefined, referral_code: incomingRef || undefined, source: 'landing_page' }),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json?.error?.message || json?.detail || (isAr ? 'حدث خطأ' : 'Something went wrong');
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
    navigator.clipboard.writeText(`${window.location.origin}/?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-5xl mx-auto w-full px-4" dir={dir}>
        <div className="relative rounded-[2rem] overflow-hidden shadow-neu-floating p-8 sm:p-12 md:p-16" style={{ background: 'hsl(222.2, 47.4%, 11.2%)' }}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/numu_v3.webp')", backgroundSize: "100px", backgroundRepeat: "repeat" }} />
          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            {/* Success icon */}
            <div className="size-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">check_circle</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {isAr ? 'أنت على القائمة!' : "You're on the list!"}
              </h3>
              <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
                {isAr
                  ? 'هنبعتلك إيميل لما يجيلك الدور. شارك الكود عشان تطلع في الترتيب!'
                  : "We'll email you when it's your turn. Share your code to move up!"}
              </p>
            </div>

            {/* Position + referral */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <div className="flex-1 rounded-xl bg-white/[0.06] border border-white/[0.08] p-4 text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{isAr ? 'ترتيبك' : 'Position'}</p>
                <p className="text-3xl font-black text-white tabular-nums">#{position}</p>
              </div>
              <div className="flex-1 rounded-xl bg-white/[0.06] border border-white/[0.08] p-4 text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{isAr ? 'كود الإحالة' : 'Referral Code'}</p>
                <p className="text-xl font-black text-white font-mono tracking-widest">{referralCode}</p>
              </div>
            </div>

            <button
              onClick={copyLink}
              className="bg-white text-brand-start font-bold h-12 px-8 rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
              <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ رابط الإحالة' : 'Copy Referral Link')}</span>
            </button>

            <p className="text-xs text-white/30">
              {isAr ? 'لديك كود دعوة؟' : 'Already have an invite code?'}
              {' '}
              <Link to="/signup" className="text-white/60 hover:text-white underline">{isAr ? 'سجّل الآن' : 'Sign up now'} →</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4" dir={dir}>
      <div className="relative rounded-[2rem] overflow-hidden shadow-neu-floating p-8 sm:p-12 md:p-16" style={{ background: 'hsl(222.2, 47.4%, 11.2%)' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/numu_v3.webp')", backgroundSize: "100px", backgroundRepeat: "repeat" }} />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left — text */}
          <div className="flex-1 text-center lg:text-start">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 mb-4">
              <span className="material-symbols-outlined text-amber-400 text-sm">lock</span>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">{isAr ? 'بيتا خاصة' : 'PRIVATE BETA'}</span>
            </div>

            <h2 className="font-arabic text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              {isAr ? 'انضم لقائمة الانتظار' : 'Join the Waitlist'}
            </h2>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-lg">
              {isAr
                ? 'نحن في مرحلة البيتا الخاصة. سجّل بريدك واحصل على وصول مبكر لمنصة NUMU — وشارك الكود عشان تطلع في الترتيب.'
                : "We're in private beta. Sign up for early access to NUMU — and share your code to move up the queue."}
            </p>

            {/* Social proof */}
            {stats && stats.total_signups > 0 && (
              <div className="flex items-center justify-center lg:justify-start gap-5 mt-5">
                <div className="flex items-center gap-1.5 text-white/30">
                  <span className="material-symbols-outlined text-base">group</span>
                  <span className="text-xs font-medium">{stats.total_signups}+ {isAr ? 'تاجر مسجل' : 'merchants waiting'}</span>
                </div>
                {stats.stores_launched > 0 && (
                  <div className="flex items-center gap-1.5 text-white/30">
                    <span className="material-symbols-outlined text-base">rocket_launch</span>
                    <span className="text-xs font-medium">{stats.stores_launched} {isAr ? 'متجر مفتوح' : 'stores launched'}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — form */}
          <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={isAr ? 'بريدك الإلكتروني' : 'Your email address'}
                required
                className="h-12 px-4 rounded-xl bg-white/[0.07] border border-white/[0.1] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
                dir="ltr"
              />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={isAr ? 'اسمك (اختياري)' : 'Your name (optional)'}
                className="h-12 px-4 rounded-xl bg-white/[0.07] border border-white/[0.1] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
              />

              {incomingRef && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {isAr ? `تمت الإحالة بواسطة: ${incomingRef}` : `Referred by: ${incomingRef}`}
                </div>
              )}

              {error && (
                <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="bg-white text-brand-start font-bold h-12 rounded-xl shadow-[6px_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-brand-start/30 border-t-brand-start animate-spin" />
                ) : (
                  <>
                    <span>{isAr ? 'انضم للقائمة' : 'Join Waitlist'}</span>
                    <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-white/25 mt-3">
              {isAr ? 'لديك كود دعوة؟' : 'Have an invite code?'}
              {' '}
              <Link to="/signup" className="text-white/50 hover:text-white underline">{isAr ? 'سجّل مباشرة' : 'Sign up directly'} →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistSection;
