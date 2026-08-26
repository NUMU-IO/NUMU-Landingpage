import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";

/**
 * Merchant storefront directory.
 *
 * This page exists for crawl reachability, not for traffic. Every NUMU store
 * lives on its own host (`<sub>.numueg.app`), and nothing on the open web
 * linked to any of them — URL Inspection on a fully indexable storefront page
 * came back "URL is unknown to Google: no referring sitemaps, no referring
 * page". A storefront can be perfect on-page and still never get crawled if no
 * indexed document points at it.
 *
 * Two things therefore matter more than the visual design here:
 *
 *   1. The links must be plain `<a href>` to absolute external URLs — not
 *      react-router `<Link>`, which renders a same-origin path and would send
 *      crawlers to numueg.app/vionne.numueg.app.
 *   2. They must survive into the prerendered HTML. scripts/prerender.mjs waits
 *      for network idle before capturing, so the fetch below completes at build
 *      time and the anchors ship inside the static file — no JS execution
 *      required on the crawler's side.
 *
 * Deliberately no `rel="nofollow"`: passing authority to merchant stores is the
 * entire point.
 */

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "https://numueg.app/api/v1";

interface DirectoryStore {
  name: string;
  subdomain: string;
  url: string;
  description: string | null;
  logo_url: string | null;
  country: string;
}

const Stores: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";
  const [stores, setStores] = useState<DirectoryStore[]>([]);
  const [loaded, setLoaded] = useState(false);

  useSEO({
    title: isAr
      ? "متاجر نُمُو — دليل المتاجر"
      : "Stores built on numu — merchant directory",
    description: isAr
      ? "استعرض المتاجر الإلكترونية الشغالة على منصة نُمُو — أزياء، إكسسوارات، بيوت علامات مصرية، وأكتر. كل متجر بدومين خاص بيه."
      : "Browse live online stores running on numu — fashion, accessories, Egyptian brand houses and more. Every store on its own domain.",
    canonical: "https://numueg.app/stores",
  });

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/public/stores`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json) => {
        if (cancelled) return;
        setStores(json?.data?.stores ?? []);
        setLoaded(true);
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("[Stores] directory fetch failed:", err);
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream paper-grain" dir={dir}>
      <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 border-b border-ink/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label={isAr ? "نُمُو — الرئيسية" : "numu — home"}
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
          ← {isAr ? "الرئيسية" : "Home"}
        </Link>
      </nav>

      <header className="relative z-10 text-center px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-sage/15 border border-sage/40 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-sage uppercase tracking-[0.18em]">
            § LIVE STORES
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              متاجر بتشتغل <span className="text-terracotta">على نُمُو.</span>
            </>
          ) : (
            <>
              Real stores, <span className="text-terracotta">running on numu.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "دي متاجر حقيقية بتبيع دلوقتي. كل واحد منهم بدأ بحساب فاضي زي بتاعك."
            : "These are real businesses selling right now. Every one of them started with an empty account, same as yours."}
        </p>
      </header>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {stores.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => (
              <li key={store.subdomain}>
                <a
                  href={store.url}
                  className="group flex h-full flex-col gap-3 rounded-[6px] border border-ink/10 bg-cream/60 p-5 transition-colors hover:border-navy/40 hover:bg-cream"
                >
                  <div className="flex items-center gap-3">
                    {store.logo_url ? (
                      <img
                        src={store.logo_url}
                        alt=""
                        loading="lazy"
                        className="size-10 rounded-[4px] object-contain bg-white/60"
                        width="40"
                        height="40"
                      />
                    ) : (
                      <span
                        className="grid size-10 place-items-center rounded-[4px] bg-navy/10 font-display text-lg font-bold text-navy"
                        aria-hidden="true"
                      >
                        {store.name.trim().charAt(0)}
                      </span>
                    )}
                    <span className="font-display text-lg font-semibold text-ink group-hover:text-navy transition-colors">
                      {store.name}
                    </span>
                  </div>
                  {store.description && (
                    <p className="text-sm leading-relaxed text-ink/70 line-clamp-3">
                      {store.description}
                    </p>
                  )}
                  <span className="mt-auto font-mono text-[11px] tracking-[0.12em] text-ink-soft/70" dir="ltr">
                    {store.url.replace(/^https:\/\//, "")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center prose-body text-ink/60">
            {loaded
              ? isAr
                ? "لسه مفيش متاجر معروضة هنا. ارجع تاني قريب."
                : "No storefronts listed yet. Check back soon."
              : isAr
                ? "بنحمّل المتاجر…"
                : "Loading stores…"}
          </p>
        )}

        <div className="mt-14 text-center">
          <Link
            to="/?signup=1"
            className="inline-flex items-center gap-2 rounded-[4px] bg-navy px-6 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-navy/90"
          >
            {isAr ? "افتح متجرك دلوقتي" : "Open your store"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Stores;
