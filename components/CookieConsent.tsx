import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const STORAGE_KEY = "numu-cookie-consent";

const CookieConsent: React.FC = () => {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Never while `scripts/prerender.mjs` is capturing the page: a banner baked
    // into the static HTML is shown to every visitor until the scripts load,
    // including the ones who accepted it long ago.
    if ((window as { __PRERENDER__?: boolean }).__PRERENDER__) return;
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4" dir={dir}>
      <div
        className="mx-auto flex max-w-xl flex-col gap-3 rounded-[10px] border border-ink/15 bg-paper p-4
          shadow-[0_12px_32px_-12px_rgba(0,31,63,0.35)] sm:flex-row sm:items-center"
      >
        <p className="flex-1 text-[13.5px]/[1.7] text-ink-soft">
          {isAr
            ? "بنستخدم ملفات تعريف الارتباط عشان الموقع يشتغل كويس. باستخدامك للموقع، إنت موافق على "
            : "We use cookies to keep the site working well. By using it, you agree to our "}
          <Link to="/privacy" className="font-semibold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy">
            {isAr ? "سياسة الخصوصية" : "privacy policy"}
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-[4px] bg-navy px-5 py-2 text-sm font-semibold text-cream transition-colors
            hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
            focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          {isAr ? "موافق" : "Accept"}
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
