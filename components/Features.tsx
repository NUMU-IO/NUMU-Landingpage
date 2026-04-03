import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: "payments",
      title: t("features.payments.title"),
      desc: t("features.payments.desc"),
    },
    {
      icon: "local_shipping",
      title: t("features.logistics.title"),
      desc: t("features.logistics.desc"),
    },
    {
      icon: "receipt_long",
      title: t("features.tax.title"),
      desc: t("features.tax.desc"),
    },
    {
      icon: "translate",
      title: t("features.arabic.title"),
      desc: t("features.arabic.desc"),
    },
    {
      icon: "share",
      title: t("features.social.title"),
      desc: t("features.social.desc"),
    },
    {
      icon: "auto_awesome",
      title: t("features.ai.title"),
      desc: t("features.ai.desc"),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      <div className="mb-8 sm:mb-10 md:mb-16 text-center">
        <h2 className="font-arabic text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-main dark:text-white mb-3 sm:mb-4">
          {t("features.title")}
        </h2>
        <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">
          {t("features.subtitle")}
        </p>
      </div>

      {/* 3x2 grid like Zid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-background-light dark:bg-background-dark rounded-2xl shadow-neu-flat p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-neu-floating group"
          >
            <div className="size-14 md:size-16 rounded-2xl shadow-neu-pressed flex items-center justify-center text-primary mx-auto mb-5 group-hover:shadow-neu-glow transition-shadow duration-300">
              <span className="material-symbols-outlined text-2xl md:text-[28px]">
                {feature.icon}
              </span>
            </div>
            <h3 className="font-arabic text-base sm:text-lg md:text-xl font-bold text-text-main dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
