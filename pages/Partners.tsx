import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";

/**
 * "Hire an expert": the public NUMU partner directory (/partners) and each
 * partner's profile (/partners/:id), fed by GET /public/partners.
 *
 * The list is prerendered like /stores (scripts/prerender.mjs proxies the
 * public API at build time), so every profile ships as a plain `<a href>`
 * crawlers can follow. Profiles render client-side. A partner's email is
 * never shown: the contact form posts to the API, which mails the partner.
 */

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "https://numueg.app/api/v1";

type Service = "apps" | "themes" | "setup" | "marketing";
type BadgeKind = "verified" | "top";

interface DirectoryPartner {
  id: string;
  display_name: string;
  website_url: string | null;
  logo_url: string | null;
  bio_ar: string | null;
  bio_en: string | null;
  services: Service[];
  languages: string[];
  city: string | null;
  badges: BadgeKind[];
}

interface PartnerProfile extends DirectoryPartner {
  apps: { name: string; slug: string; icon_url: string | null }[];
  themes: { name: string; slug: string; thumbnail_url: string | null }[];
}

const SERVICES: Record<Service, { ar: string; en: string }> = {
  apps: { ar: "تطبيقات", en: "Apps" },
  themes: { ar: "ثيمات", en: "Themes" },
  setup: { ar: "تجهيز المتاجر", en: "Store setup" },
  marketing: { ar: "تسويق", en: "Marketing" },
};

const BADGES: Record<BadgeKind, { ar: string; en: string }> = {
  verified: { ar: "موثّق", en: "Verified" },
  top: { ar: "شريك مميز", en: "Top partner" },
};

const LANGS: Record<string, { ar: string; en: string }> = {
  ar: { ar: "العربية", en: "Arabic" },
  en: { ar: "الإنجليزية", en: "English" },
  fr: { ar: "الفرنسية", en: "French" },
};

const Nav: React.FC<{ isAr: boolean }> = ({ isAr }) => (
  <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 border-b border-ink/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
    <Link to="/" className="flex items-center gap-2.5" aria-label={isAr ? "نُمُو — الرئيسية" : "numu — home"}>
      <img src="/numu-mark-cream.webp" alt="" className="h-8 w-auto object-contain" width="40" height="40" />
      {isAr ? (
        <span className="font-display text-xl font-bold tracking-tight text-ink">نُمُو</span>
      ) : (
        <span className="font-display text-lg font-semibold tracking-tight text-ink lowercase">numu</span>
      )}
    </Link>
    <Link
      to="/partners"
      className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80 hover:text-navy transition-colors"
    >
      {isAr ? "كل الشركاء" : "All partners"}
    </Link>
  </nav>
);

const Logo: React.FC<{ p: DirectoryPartner; size?: string }> = ({ p, size = "size-12" }) =>
  p.logo_url ? (
    <img src={p.logo_url} alt="" loading="lazy" className={`${size} rounded-[4px] object-contain bg-white/60`} />
  ) : (
    <span
      className={`grid ${size} place-items-center rounded-[4px] bg-navy/10 font-display text-lg font-bold text-navy`}
      aria-hidden="true"
    >
      {p.display_name.trim().charAt(0)}
    </span>
  );

const Badges: React.FC<{ badges: BadgeKind[]; isAr: boolean }> = ({ badges, isAr }) => (
  <>
    {badges.map((b) => (
      <span
        key={b}
        className="rounded-[4px] border border-sage/40 bg-sage/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-sage"
      >
        {isAr ? BADGES[b].ar : BADGES[b].en}
      </span>
    ))}
  </>
);

function useJson<T>(path: string | null): { data: T | null; loaded: boolean } {
  const [state, setState] = useState<{ data: T | null; loaded: boolean }>({ data: null, loaded: false });
  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    setState({ data: null, loaded: false });
    fetch(`${API_BASE}${path}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json) => !cancelled && setState({ data: json?.data ?? null, loaded: true }))
      .catch((err) => {
        if (cancelled) return;
        console.warn("[Partners] fetch failed:", err);
        setState({ data: null, loaded: true });
      });
    return () => {
      cancelled = true;
    };
  }, [path]);
  return state;
}

const Directory: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";
  const [service, setService] = useState<Service | "">("");
  const [badge, setBadge] = useState<BadgeKind | "">("");
  const { data, loaded } = useJson<DirectoryPartner[]>("/public/partners");

  useSEO({
    title: isAr ? "اطلب خبير — دليل شركاء نُمُو" : "Hire an expert — numu partner directory",
    description: isAr
      ? "شركاء نُمُو بيبنوا تطبيقات وثيمات، بيجهزوا المتاجر، وبيسوّقولها. اختار الخبير المناسب وابعتله رسالة."
      : "numu partners build apps and themes, set up stores and market them. Find the right expert and send them a message.",
    canonical: "https://numueg.app/partners",
  });

  const partners = (data ?? []).filter(
    (p) => (!service || p.services.includes(service)) && (!badge || p.badges.includes(badge)),
  );
  const select = "rounded-[4px] border border-ink/15 bg-cream px-3 py-2 text-sm text-ink";

  return (
    <div className="min-h-screen bg-cream paper-grain" dir={dir}>
      <Nav isAr={isAr} />
      <header className="relative z-10 text-center px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              اطلب <span className="text-terracotta">خبير.</span>
            </>
          ) : (
            <>
              Hire an <span className="text-terracotta">expert.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "شركاء نُمُو بيبنوا تطبيقات وثيمات، بيجهزوا متجرك، وبيسوّقوله."
            : "numu partners build apps and themes, set up your store and market it."}
        </p>
      </header>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <label className="sr-only" htmlFor="pd-service">
            {isAr ? "الخدمة" : "Service"}
          </label>
          <select id="pd-service" className={select} value={service} onChange={(e) => setService(e.target.value as Service | "")}>
            <option value="">{isAr ? "كل الخدمات" : "All services"}</option>
            {(Object.keys(SERVICES) as Service[]).map((s) => (
              <option key={s} value={s}>
                {isAr ? SERVICES[s].ar : SERVICES[s].en}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="pd-badge">
            {isAr ? "الشارة" : "Badge"}
          </label>
          <select id="pd-badge" className={select} value={badge} onChange={(e) => setBadge(e.target.value as BadgeKind | "")}>
            <option value="">{isAr ? "كل الشركاء" : "All partners"}</option>
            {(Object.keys(BADGES) as BadgeKind[]).map((b) => (
              <option key={b} value={b}>
                {isAr ? BADGES[b].ar : BADGES[b].en}
              </option>
            ))}
          </select>
        </div>

        {partners.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((p) => (
              <li key={p.id}>
                <a
                  href={`/${language}/partners/${p.id}`}
                  className="group flex h-full flex-col gap-3 rounded-[6px] border border-ink/10 bg-cream/60 p-5 transition-colors hover:border-navy/40 hover:bg-cream"
                >
                  <div className="flex items-center gap-3">
                    <Logo p={p} size="size-10" />
                    <span className="font-display text-lg font-semibold text-ink group-hover:text-navy transition-colors">
                      {p.display_name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badges badges={p.badges} isAr={isAr} />
                  </div>
                  {(isAr ? p.bio_ar || p.bio_en : p.bio_en || p.bio_ar) && (
                    <p className="text-sm leading-relaxed text-ink/70 line-clamp-3">
                      {isAr ? p.bio_ar || p.bio_en : p.bio_en || p.bio_ar}
                    </p>
                  )}
                  <span className="mt-auto text-xs text-ink-soft/80">
                    {p.services.map((s) => (isAr ? SERVICES[s].ar : SERVICES[s].en)).join(" · ")}
                    {p.city ? ` — ${p.city}` : ""}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center prose-body text-ink/60">
            {loaded
              ? isAr
                ? "مفيش شركاء بالمواصفات دي لسه."
                : "No partners match yet."
              : isAr
                ? "بنحمّل الشركاء…"
                : "Loading partners…"}
          </p>
        )}
      </div>
    </div>
  );
};

const ContactForm: React.FC<{ partnerId: string; isAr: boolean }> = ({ partnerId, isAr }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "limited">("idle");
  const input = "w-full rounded-[4px] border border-ink/15 bg-cream px-3 py-2 text-sm text-ink";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch(`${API_BASE}/public/partners/${partnerId}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() }),
      });
      setState(res.ok ? "sent" : res.status === 429 ? "limited" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <p role="status" className="prose-body text-sage">
        {isAr ? "رسالتك وصلت. الشريك هيرد عليك على إيميلك." : "Message sent. The partner will reply to your email."}
      </p>
    );
  }
  return (
    <form className="space-y-3" onSubmit={submit}>
      <label className="block text-sm text-ink" htmlFor="pc-name">
        {isAr ? "اسمك" : "Your name"}
        <input
          id="pc-name"
          required
          minLength={2}
          maxLength={100}
          className={input}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </label>
      <label className="block text-sm text-ink" htmlFor="pc-email">
        {isAr ? "إيميلك" : "Your email"}
        <input
          id="pc-email"
          type="email"
          dir="ltr"
          required
          className={input}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </label>
      <label className="block text-sm text-ink" htmlFor="pc-message">
        {isAr ? "محتاج إيه؟" : "What do you need?"}
        <textarea
          id="pc-message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className={input}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        />
      </label>
      {(state === "error" || state === "limited") && (
        <p role="alert" className="text-sm text-terracotta">
          {state === "limited"
            ? isAr
              ? "بعت رسايل كتير. جرّب تاني بعد شوية."
              : "Too many messages. Try again later."
            : isAr
              ? "مقدرناش نبعت رسالتك. جرّب تاني."
              : "Couldn't send your message. Try again."}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center gap-2 rounded-[4px] bg-navy px-6 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-navy/90 disabled:opacity-60"
      >
        {state === "sending" ? (isAr ? "بنبعت…" : "Sending…") : isAr ? "ابعت رسالة" : "Send message"}
      </button>
    </form>
  );
};

const Profile: React.FC<{ id: string }> = ({ id }) => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";
  const { data: p, loaded } = useJson<PartnerProfile>(`/public/partners/${encodeURIComponent(id)}`);
  const bio = p ? (isAr ? p.bio_ar || p.bio_en : p.bio_en || p.bio_ar) : null;

  useSEO({
    title: p ? `${p.display_name} — ${isAr ? "شريك نُمُو" : "numu partner"}` : isAr ? "شريك نُمُو" : "numu partner",
    description: bio ?? (isAr ? "شريك في دليل خبراء نُمُو." : "A partner in the numu expert directory."),
    canonical: `https://numueg.app/partners/${id}`,
    noIndex: loaded && !p,
  });

  return (
    <div className="min-h-screen bg-cream paper-grain" dir={dir}>
      <Nav isAr={isAr} />
      <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {!p ? (
          <p className="text-center prose-body text-ink/60">
            {loaded ? (isAr ? "الشريك ده مش موجود." : "This partner isn't listed.") : isAr ? "بنحمّل…" : "Loading…"}
          </p>
        ) : (
          <div className="space-y-10">
            <header className="flex flex-wrap items-center gap-4">
              <Logo p={p} size="size-16" />
              <div className="space-y-2">
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">{p.display_name}</h1>
                <div className="flex flex-wrap gap-1.5">
                  <Badges badges={p.badges} isAr={isAr} />
                </div>
              </div>
            </header>
            {bio && <p className="prose-body text-ink/80 whitespace-pre-line">{bio}</p>}
            <dl className="grid gap-4 sm:grid-cols-2 text-sm">
              {p.services.length > 0 && (
                <div>
                  <dt className="font-semibold text-ink">{isAr ? "الخدمات" : "Services"}</dt>
                  <dd className="text-ink/75">{p.services.map((s) => (isAr ? SERVICES[s].ar : SERVICES[s].en)).join(" · ")}</dd>
                </div>
              )}
              {p.languages.length > 0 && (
                <div>
                  <dt className="font-semibold text-ink">{isAr ? "اللغات" : "Languages"}</dt>
                  <dd className="text-ink/75">
                    {p.languages.map((l) => (LANGS[l] ? (isAr ? LANGS[l].ar : LANGS[l].en) : l)).join(" · ")}
                  </dd>
                </div>
              )}
              {p.city && (
                <div>
                  <dt className="font-semibold text-ink">{isAr ? "المدينة" : "City"}</dt>
                  <dd className="text-ink/75">{p.city}</dd>
                </div>
              )}
              {p.website_url && (
                <div>
                  <dt className="font-semibold text-ink">{isAr ? "الموقع" : "Website"}</dt>
                  <dd>
                    <a href={p.website_url} rel="noopener nofollow" target="_blank" dir="ltr" className="text-navy underline underline-offset-2">
                      {p.website_url.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            {(p.apps.length > 0 || p.themes.length > 0) && (
              <section className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-ink">{isAr ? "شغلهم على نُمُو" : "Their work on numu"}</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {p.apps.map((a) => (
                    <li key={`app-${a.slug}`} className="flex items-center gap-3 rounded-[6px] border border-ink/10 p-3">
                      {a.icon_url && <img src={a.icon_url} alt="" loading="lazy" className="size-8 rounded-[4px] object-contain" />}
                      <span className="text-sm text-ink">{a.name}</span>
                      <span className="ms-auto font-mono text-[10px] uppercase text-ink-soft/70">{isAr ? "تطبيق" : "App"}</span>
                    </li>
                  ))}
                  {p.themes.map((t) => (
                    <li key={`theme-${t.slug}`} className="flex items-center gap-3 rounded-[6px] border border-ink/10 p-3">
                      {t.thumbnail_url && <img src={t.thumbnail_url} alt="" loading="lazy" className="size-8 rounded-[4px] object-cover" />}
                      <span className="text-sm text-ink">{t.name}</span>
                      <span className="ms-auto font-mono text-[10px] uppercase text-ink-soft/70">{isAr ? "ثيم" : "Theme"}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section className="space-y-3 rounded-[6px] border border-ink/10 bg-cream/60 p-5">
              <h2 className="font-display text-xl font-semibold text-ink">
                {isAr ? `تواصل مع ${p.display_name}` : `Contact ${p.display_name}`}
              </h2>
              <ContactForm partnerId={p.id} isAr={isAr} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

const Partners: React.FC = () => {
  const { id } = useParams();
  return id ? <Profile id={id} /> : <Directory />;
};

export default Partners;
