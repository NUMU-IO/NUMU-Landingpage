import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

/* Real Bosta hexagon icon SVG */
const BostaIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M65.244 17.666L35.544.533a3.78 3.78 0 00-3.87 0l-29.7 17.133C.79 18.376 0 19.639 0 21.06v25.107c0 1.421.71 2.684 1.975 3.395l29.7 17.133c.631.315 1.263.552 1.974.552.71 0 1.343-.158 1.975-.552l29.7-17.133c1.184-.71 1.974-1.974 1.974-3.395V21.06a4.24 4.24 0 00-2.054-3.394zM60.347 39.93l-10.98-6.316 10.98-6.316V39.93zM33.649 7.323L57.424 21.06 33.65 34.798 9.795 21.06 33.649 7.323zM6.872 27.219l10.98 6.316-10.98 6.316V27.219zm26.777 32.607L9.795 46.088l14.85-8.606 6.95 4.027c.632.316 1.264.553 1.975.553.71 0 1.343-.158 1.975-.553l6.95-4.027 14.85 8.606L33.65 59.826z" fill="#E30613" />
  </svg>
);

/* WhatsApp icon SVG */
const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const Integrations: React.FC = () => {
  const { t, dir } = useLanguage();

  const partners = [
    { name: "Paymob", desc: dir === "rtl" ? "بيموب و محافظ الكترونيه" : "Paymob & E-Wallets", logo: <img src="/paymob-logo.webp" alt="Paymob" className="h-5 w-auto object-contain" /> },
    { name: "Bosta", desc: t("integrations.bosta"), logo: <BostaIcon size={22} /> },
    { name: "Fawry", desc: dir === "rtl" ? "فوري يعني ادفع من أي مكان" : "Pay anywhere", logo: <img src="/fawry-logo.webp" alt="Fawry" className="h-5 w-auto object-contain" /> },
    { name: "WhatsApp", desc: t("integrations.whatsapp"), logo: <WhatsAppIcon size={22} /> },
    { name: "Kashier", desc: dir === "rtl" ? "بوابة دفع متكاملة" : "Payment gateway", logo: <img src="/kashier-icon.webp" alt="Kashier" className="h-5 w-auto object-contain" /> },
    { name: "Aramex", desc: dir === "rtl" ? "شحن دولي" : "International shipping", logo: <img src="/paymob-logo.webp" alt="Aramex" className="h-0 w-0 hidden" /> },
  ];

  // Replace Aramex with text logo
  partners[5] = {
    name: "Aramex",
    desc: dir === "rtl" ? "شحن دولي" : "International shipping",
    logo: <span className="text-[11px] font-black tracking-tight" style={{ color: '#E85D04' }}>aramex</span>,
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h2 className="font-arabic text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-main mb-3 sm:mb-4">
          {t("integrations.title")}
        </h2>
        <p className="text-text-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
          {t("integrations.subtitle")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* Orbital diagram — 6 icons evenly spaced */}
        <div className="lg:w-1/2 relative h-[320px] sm:h-[380px] w-full max-w-[400px] mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />

          {/* Center NUMU hub */}
          <div className="relative z-10 size-20 sm:size-24 bg-background-light rounded-2xl shadow-neu-floating flex items-center justify-center">
            <img src="/numu-symbol-white.webp" alt="NUMU" className="h-10 sm:h-12 w-auto object-contain invert" />
          </div>

          {/* Orbit ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full border border-primary/10" />

          {/* 6 orbiting icons — fixed positions around the circle */}
          {/* Top */}
          <div className="absolute -top-2 sm:top-2 left-1/2 -translate-x-1/2 w-12 h-12 bg-background-light rounded-xl shadow-neu-flat-sm flex items-center justify-center animate-float p-2" style={{ animationDelay: '0s' }}>
            <img src="/paymob-logo.webp" alt="Paymob" className="h-5 w-auto object-contain" />
          </div>
          {/* Top-right */}
          <div className="absolute top-[15%] right-[5%] sm:right-[8%] w-12 h-12 bg-background-light rounded-xl shadow-neu-flat-sm flex items-center justify-center animate-float p-2" style={{ animationDelay: '1s' }}>
            <BostaIcon size={20} />
          </div>
          {/* Bottom-right */}
          <div className="absolute bottom-[15%] right-[5%] sm:right-[8%] w-12 h-12 bg-background-light rounded-xl shadow-neu-flat-sm flex items-center justify-center animate-float p-2" style={{ animationDelay: '2s' }}>
            <img src="/fawry-logo.webp" alt="Fawry" className="h-5 w-auto object-contain" />
          </div>
          {/* Bottom */}
          <div className="absolute -bottom-2 sm:bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 bg-background-light rounded-xl shadow-neu-flat-sm flex items-center justify-center animate-float p-2" style={{ animationDelay: '3s' }}>
            <WhatsAppIcon size={20} />
          </div>
          {/* Bottom-left */}
          <div className="absolute bottom-[15%] left-[5%] sm:left-[8%] w-12 h-12 bg-background-light rounded-xl shadow-neu-flat-sm flex items-center justify-center animate-float p-2" style={{ animationDelay: '4s' }}>
            <img src="/kashier-icon.webp" alt="Kashier" className="h-5 w-auto object-contain" />
          </div>
          {/* Top-left — Aramex text logo */}
          <div className="absolute top-[15%] left-[5%] sm:left-[8%] w-12 h-12 bg-background-light rounded-xl shadow-neu-flat-sm flex items-center justify-center animate-float" style={{ animationDelay: '5s' }}>
            <span className="text-[10px] font-black tracking-tight" style={{ color: '#E85D04' }}>aramex</span>
          </div>
        </div>

        {/* Partner cards */}
        <div className="lg:w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-background-light shadow-neu-flat-sm hover:shadow-neu-flat transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="size-11 sm:size-12 rounded-xl shadow-neu-pressed flex items-center justify-center shrink-0 p-1.5">
                  {partner.logo}
                </div>
                <div className="min-w-0">
                  <p className="font-arabic text-sm sm:text-base font-bold text-text-main">{partner.name}</p>
                  <p className="text-[11px] sm:text-xs text-text-muted truncate">{partner.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
