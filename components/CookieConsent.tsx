import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const STORAGE_KEY = "numu-cookie-consent";

const CookieConsent: React.FC = () => {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 p-4"
      dir={dir}
    >
      <div className="max-w-lg mx-auto bg-[#0f172a] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-2xl">
        <p className="text-sm text-white/70 flex-1">
          {isAr
            ? "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. باستخدامك للموقع، أنت توافق على سياسة الخصوصية."
            : "We use cookies to improve your experience. By using this site, you agree to our privacy policy."}
        </p>
        <div className="flex gap-2 shrink-0">
          <a
            href="/privacy"
            className="text-xs text-white/40 hover:text-white/60 underline"
          >
            {isAr ? "الخصوصية" : "Privacy"}
          </a>
          <button
            onClick={accept}
            className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            {isAr ? "موافق" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
