import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useWaitlistModal } from "../contexts/WaitlistModalContext";
import DemoStartModal from "./DemoStartModal";

const AnimatedCounter: React.FC<{
  end: number;
  suffix?: string;
  duration?: number;
}> = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
};

const Hero: React.FC = () => {
  const [activeBar, setActiveBar] = useState(10);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const { t, dir } = useLanguage();
  const { open: openWaitlist } = useWaitlistModal();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("demo") === "1") {
      setDemoModalOpen(true);
      searchParams.delete("demo");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Merchant hub dashboard palette — lives inside a framed card on cream.
  const dashBg = "#001F3F"; // navy-900
  const cardBg =
    "linear-gradient(168deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)";
  const cardBorder = "rgba(255,255,255,0.08)";
  const mutedText = "rgba(255,255,255,0.55)";
  const foreText = "rgba(255,255,255,0.92)";

  return (
    <div className="relative bg-cream paper-grain pb-14 sm:pb-20 lg:pb-24">
      {/* Container — 1360px per brand-kit spec for brand surfaces */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 lg:pt-32 pb-10 lg:pb-12">
        {/* Text + ambient mark */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10 mb-8 lg:mb-10">
          {/* Text side */}
          <div className="flex-1 text-center lg:text-start">
            {/* Eyebrow row — just the location mono label + the Start-Free
                callout chip. Dropped the terracotta § 01 marker — it read
                as an "orange underline" beneath the navbar at distance. */}
            <div className="mb-5 flex flex-wrap items-center gap-3 animate-fade-in-up justify-center lg:justify-start">
              <span className="eyebrow">
                NUMUEG.APP · CAIRO · 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-saffron/15 border border-saffron/40 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-saffron">
                <span className="size-1.5 rounded-full bg-saffron animate-pulse" aria-hidden="true" />
                {dir === "rtl" ? "ابدأ مجانًا" : "Start Free"}
              </span>
            </div>

            {/* Headline — Reem Kufi, navy ink, one navy accent line + terracotta underline */}
            <h1
              className="font-display font-bold text-ink mb-5 animate-fade-in-up-1 flex flex-col tracking-tight"
              style={{ gap: "0.3rem" }}
            >
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[60px] leading-[1.05]">
                {t("hero.title_line1")}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[60px] leading-[1.05] text-navy">
                {t("hero.title_line2")}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[60px] leading-[1.05]">
                {t("hero.title_line3")}
                {t("hero.title_line4") !== "hero.title_line4" && t("hero.title_line4")
                  ? " " + t("hero.title_line4")
                  : ""}
              </span>
            </h1>

            <p className="prose-body text-ink/75 max-w-xl animate-fade-in-up-2 mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>

            {/* CTAs — navy primary with saffron arrow accent + outlined secondary */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-7 animate-fade-in-up-3 justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => openWaitlist()}
                className="group bg-navy text-cream font-semibold py-3.5 px-7 rounded-[4px] shadow-sm hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center gap-3 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <span>{t("hero.cta_primary")}</span>
                <span
                  aria-hidden="true"
                  className="text-lg text-saffron group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
                >
                  →
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="text-ink font-semibold py-3.5 px-7 rounded-[4px] border border-ink/15 hover:border-terracotta hover:text-terracotta hover:bg-terracotta/[0.04] transition-all duration-200 ease-numu flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <span>{t("hero.cta_secondary")}</span>
              </button>
              <DemoStartModal
                isOpen={demoModalOpen}
                onClose={() => setDemoModalOpen(false)}
              />
            </div>

            {/* Trust row — ETA e-invoicing is the #1 differentiator no
                foreign SaaS offers (audit §4.1), so it leads. Local payment
                + carrier wordmarks follow as typographic rails — Egyptian
                merchants scan for these names above the fold before they
                scroll (audit §4.8–9). Pure type, no logo images, keeps
                the hero lean. */}
            <div className="mt-8 sm:mt-9 animate-fade-in-up-4 flex flex-col items-center lg:items-start gap-3 sm:gap-3.5">
              <span className="eyebrow text-ink-soft/60">
                § {t("hero.trust_eyebrow")}
              </span>

              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-terracotta/[0.06] border border-terracotta/30 rounded-[4px]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="size-3.5 shrink-0 text-terracotta"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8.5l3.2 3.2L13 4.8" />
                </svg>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] font-semibold text-terracotta">
                  {t("hero.trust_eta")}
                </span>
              </span>

              <dl className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-1.5 font-mono text-[11px] tracking-wide text-ink/70 items-center lg:items-start">
                <div className="flex items-center gap-2">
                  <dt className="uppercase tracking-[0.18em] text-ink-soft/55 font-semibold">
                    {t("hero.trust_pay")}
                  </dt>
                  <dd className="flex items-center gap-1.5">
                    <span className="font-semibold text-ink">Paymob</span>
                    <span aria-hidden="true" className="text-ink-soft/40">·</span>
                    <span className="font-semibold text-ink">Fawry</span>
                    <span aria-hidden="true" className="text-ink-soft/40">·</span>
                    <span className="font-semibold text-ink">Vodafone Cash</span>
                    <span aria-hidden="true" className="text-ink-soft/40">·</span>
                    <span className="font-semibold text-ink">InstaPay</span>
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="uppercase tracking-[0.18em] text-ink-soft/55 font-semibold">
                    {t("hero.trust_ship")}
                  </dt>
                  <dd className="flex items-center gap-1.5">
                    <span className="font-semibold text-ink">Bosta</span>
                    <span aria-hidden="true" className="text-ink-soft/40">·</span>
                    <span className="font-semibold text-ink">Aramex</span>
                    <span aria-hidden="true" className="text-ink-soft/40">·</span>
                    <span className="font-semibold text-ink">ShipBlu</span>
                    <span aria-hidden="true" className="text-ink-soft/40">·</span>
                    <span className="font-semibold text-ink">Khazenly</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Ambient wordmark side — cream ground, multi-accent capsules */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative h-[380px] animate-fade-in-up-3">
            {/* Floating order capsule — sage accent (success/paid) */}
            <div
              className="absolute top-2 end-0 z-10 px-4 py-3 bg-paper border border-ink/10 border-s-[3px] border-s-sage flex items-center gap-3 shadow-card rounded-[4px]"
              style={{ maxWidth: 240 }}
            >
              <div className="size-9 rounded-[4px] bg-sage/15 flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="font-mono text-xs font-semibold text-sage"
                >
                  +1
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-ink truncate">
                  {t("preview.new_order")}
                </p>
                <p className="font-mono text-[10px] text-ink-soft/60 uppercase tracking-wide">
                  {dir === "rtl" ? "القاهرة · EGP ١٣٠٠" : "Cairo · EGP 1,300"}
                </p>
              </div>
            </div>

            {/* Arabic wordmark — N mark + نُمُو on a single baseline, nothing
                else. No saffron Latinisation (read as an "orange line" at
                low zoom), no terracotta underline. Cleaner, louder. */}
            <div
              className="relative flex items-center justify-center gap-8 select-none animate-float"
              aria-hidden="true"
            >
              <img
                src="/numu-mark-cream.webp"
                alt=""
                className="h-40 xl:h-52 w-auto object-contain"
                width="220"
                height="464"
              />
              <span className="font-display font-bold text-navy leading-[0.9] text-[160px] xl:text-[200px]">
                نُمُو
              </span>
            </div>

            {/* Revenue capsule — saffron accent (warmth / offer / revenue) */}
            <div
              className="absolute bottom-4 start-0 z-10 px-4 py-3 bg-paper border border-ink/10 border-s-[3px] border-s-saffron shadow-card rounded-[4px] animate-float"
              style={{ animationDelay: "2s" }}
            >
              <p className="font-mono text-[10px] text-ink-soft/60 uppercase tracking-[0.18em] mb-1">
                {dir === "rtl" ? "إيرادات اليوم" : "Today's Revenue"}
              </p>
              <p className="text-xl font-bold text-navy tabular-nums leading-none">
                {dir === "rtl" ? "EGP ٢٤,٨٠٠" : "EGP 24,800"}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] font-semibold text-sage"
                >
                  ↑ {dir === "rtl" ? "١٨%" : "18%"}
                </span>
              </div>
            </div>

            {/* Bosta capsule removed — two floating capsules (order +
                revenue) is enough motion; the third was noise. */}
          </div>
        </div>

        {/* ===== Dashboard mockup — framed card on cream ===== */}
        <div className="animate-fade-in-up-5">
          <div className="relative max-w-5xl mx-auto">
            <div
              className="relative rounded-[14px] overflow-hidden numu-mockup-frame"
              style={{ background: dashBg }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-2 px-5 py-3"
                style={{ borderBottom: `1px solid ${cardBorder}` }}
              >
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-sage/80" />
                  <div className="size-3 rounded-full bg-saffron/80" />
                  <div className="size-3 rounded-full bg-terracotta/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div
                    className="flex items-center gap-2 rounded-[4px] px-4 py-1"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <span
                      className="font-mono text-[11px] tracking-wide"
                      style={{ color: mutedText }}
                    >
                      numueg.app/dashboard
                    </span>
                  </div>
                </div>
                <div className="w-[52px]" />
              </div>

              <div className="flex" style={{ direction: dir }}>
                {/* Sidebar */}
                <div
                  className="hidden md:flex flex-col w-[200px] py-4 px-3 gap-0.5 shrink-0"
                  style={{ borderInlineEnd: `1px solid ${cardBorder}` }}
                >
                  {/* Sidebar brand */}
                  <div className="flex items-center gap-2.5 px-3 py-2 mb-4">
                    <div
                      className="size-7 rounded-[4px] flex items-center justify-center font-display font-bold text-[12px]"
                      style={{ background: "#F5EFE6", color: dashBg }}
                    >
                      N
                    </div>
                    <span
                      className="font-display text-xs font-semibold tracking-tight"
                      style={{ color: foreText }}
                    >
                      numu
                    </span>
                  </div>

                  {/* Active nav */}
                  <div
                    className="flex items-center gap-2.5 px-3 py-[7px] rounded-[4px] mb-0.5"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <span
                      className="size-1.5 rounded-full bg-cream"
                      aria-hidden="true"
                    />
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: foreText }}
                    >
                      {dir === "rtl" ? "لوحة التحكم" : "Dashboard"}
                    </span>
                  </div>

                  {[
                    dir === "rtl" ? "الطلبات" : "Orders",
                    dir === "rtl" ? "المنتجات" : "Products",
                    dir === "rtl" ? "الأقسام" : "Categories",
                    dir === "rtl" ? "العملاء" : "Customers",
                  ].map((label, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-3 py-[7px] rounded-[4px] hover:bg-white/[0.04] transition-colors"
                    >
                      <span
                        className="size-1.5 rounded-full bg-white/20"
                        aria-hidden="true"
                      />
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: mutedText }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}

                  <div className="px-3 mt-4 mb-2">
                    <span
                      className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      § {dir === "rtl" ? "إحصائيات" : "Insights"}
                    </span>
                  </div>
                  {[
                    dir === "rtl" ? "التقارير" : "Analytics",
                    dir === "rtl" ? "الشحن" : "Shipping",
                    dir === "rtl" ? "الفواتير" : "Invoices",
                  ].map((label, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-3 py-[7px] rounded-[4px] hover:bg-white/[0.04] transition-colors"
                    >
                      <span
                        className="size-1.5 rounded-full bg-white/20"
                        aria-hidden="true"
                      />
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: mutedText }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div className="flex-1 p-4 sm:p-5 min-w-0">
                  <div className="mb-5">
                    <h3
                      className="font-display text-sm sm:text-[15px] font-semibold mb-0.5"
                      style={{ color: foreText }}
                    >
                      {dir === "rtl"
                        ? "صباح الخير، أحمد"
                        : "Good morning, Ahmed"}
                    </h3>
                    <p
                      className="font-mono text-[11px] tracking-wide"
                      style={{ color: mutedText }}
                    >
                      {dir === "rtl"
                        ? "عندك ٨ طلبات جديدة النهاردة"
                        : "8 new orders today"}
                    </p>
                  </div>

                  {/* KPI row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    {[
                      {
                        label: dir === "rtl" ? "الإيرادات" : "Revenue",
                        value: dir === "rtl" ? "EGP ٢٤,٨٠٠" : "EGP 24,800",
                        change: dir === "rtl" ? "+١٨%" : "+18%",
                      },
                      {
                        label: dir === "rtl" ? "الطلبات" : "Orders",
                        value: dir === "rtl" ? "١٥٦" : "156",
                        change: dir === "rtl" ? "+١٢%" : "+12%",
                      },
                      {
                        label: dir === "rtl" ? "العملاء" : "Customers",
                        value: dir === "rtl" ? "٢,٣٤٠" : "2,340",
                        change: dir === "rtl" ? "+٨%" : "+8%",
                      },
                      {
                        label: dir === "rtl" ? "معدل التحويل" : "Conversion",
                        value: dir === "rtl" ? "٣.٢%" : "3.2%",
                        change: dir === "rtl" ? "+٠.٤%" : "+0.4%",
                      },
                    ].map((kpi, i) => (
                      <div
                        key={i}
                        className="rounded-[10px] p-3 sm:p-4"
                        style={{
                          background: cardBg,
                          border: `1px solid ${cardBorder}`,
                        }}
                      >
                        <div className="mb-2">
                          <span
                            className="font-mono text-[10px] font-medium uppercase tracking-[0.18em]"
                            style={{ color: mutedText }}
                          >
                            {kpi.label}
                          </span>
                        </div>
                        <p
                          className="font-display text-lg sm:text-2xl font-bold tracking-tight tabular-nums leading-none mb-1"
                          style={{ color: foreText }}
                        >
                          {kpi.value}
                        </p>
                        <span className="font-mono text-[11px] font-semibold text-sage">
                          {kpi.change}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Chart + Recent orders */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                    <div
                      className="lg:col-span-3 rounded-[10px] p-4"
                      style={{
                        background: cardBg,
                        border: `1px solid ${cardBorder}`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="font-display text-[13px] font-semibold"
                          style={{ color: foreText }}
                        >
                          {dir === "rtl" ? "الإيرادات" : "Revenue"}
                        </span>
                        <div className="flex gap-1">
                          {["7d", "30d", "90d"].map((p, i) => (
                            <span
                              key={p}
                              className="font-mono text-[10px] px-2.5 py-0.5 rounded-[4px] font-medium uppercase tracking-wide"
                              style={{
                                background:
                                  i === 0
                                    ? "rgba(255,255,255,0.1)"
                                    : "transparent",
                                color: i === 0 ? foreText : mutedText,
                              }}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div
                        className="flex items-end gap-[3px] h-24 sm:h-32"
                        onMouseLeave={() => setActiveBar(10)}
                      >
                        {[
                          35, 50, 40, 70, 55, 85, 65, 90, 60, 75, 80, 95, 70,
                        ].map((h, i) => (
                          <div
                            key={i}
                            onMouseEnter={() => setActiveBar(i)}
                            className="flex-1 rounded-t-[2px] transition-all duration-200 cursor-pointer"
                            style={{
                              height: `${h}%`,
                              background:
                                activeBar === i
                                  ? "#F5EFE6"
                                  : `rgba(245, 239, 230, ${0.18 + h / 600})`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {(dir === "rtl"
                          ? ["جمعة", "خميس", "أربعاء", "ثلاثاء", "إثنين", "أحد", "سبت"]
                          : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]
                        ).map((d) => (
                          <span
                            key={d}
                            className="font-mono text-[9px] tracking-wide"
                            style={{ color: mutedText }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="lg:col-span-2 rounded-[10px] p-4"
                      style={{
                        background: cardBg,
                        border: `1px solid ${cardBorder}`,
                      }}
                    >
                      <span
                        className="font-display text-[13px] font-semibold block mb-3"
                        style={{ color: foreText }}
                      >
                        {dir === "rtl" ? "آخر الطلبات" : "Recent Orders"}
                      </span>
                      <div className="space-y-1">
                        {[
                          {
                            id: dir === "rtl" ? "#١٢٨٤" : "#1284",
                            name: dir === "rtl" ? "فاطمة أحمد" : "Fatma Ahmed",
                            amount: dir === "rtl" ? "EGP ٤٥٠" : "EGP 450",
                            status: dir === "rtl" ? "مسلَّم" : "Delivered",
                            statusClass:
                              "text-sage bg-sage/10 border-sage/30",
                          },
                          {
                            id: dir === "rtl" ? "#١٢٨٣" : "#1283",
                            name: dir === "rtl" ? "محمد علي" : "Mohamed Ali",
                            amount: dir === "rtl" ? "EGP ١,٢٠٠" : "EGP 1,200",
                            status: dir === "rtl" ? "مشحون" : "Shipped",
                            statusClass:
                              "text-navy-100 bg-navy-100/10 border-navy-100/20",
                          },
                          {
                            id: dir === "rtl" ? "#١٢٨٢" : "#1282",
                            name: dir === "rtl" ? "سارة حسن" : "Sara Hassan",
                            amount: dir === "rtl" ? "EGP ٣٢٠" : "EGP 320",
                            status: dir === "rtl" ? "قيد التجهيز" : "Processing",
                            statusClass:
                              "text-saffron bg-saffron/10 border-saffron/30",
                          },
                          {
                            id: dir === "rtl" ? "#١٢٨١" : "#1281",
                            name: dir === "rtl" ? "أحمد يوسف" : "Ahmed Youssef",
                            amount: dir === "rtl" ? "EGP ٨٩٠" : "EGP 890",
                            status: dir === "rtl" ? "معلَّق" : "Pending",
                            statusClass:
                              "text-white/50 bg-white/5 border-white/10",
                          },
                        ].map((order, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 rounded-[4px] p-2 -mx-1 hover:bg-white/[0.03] transition-colors"
                          >
                            <div
                              className="size-7 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,0.06)" }}
                            >
                              <span
                                className="font-display text-[10px] font-semibold"
                                style={{ color: mutedText }}
                              >
                                {order.name[0]}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className="font-mono text-[12px] font-semibold tabular-nums"
                                  style={{ color: foreText }}
                                >
                                  {order.id}
                                </span>
                                <span
                                  className={`font-mono text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-[2px] border ${order.statusClass}`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p
                                className="text-[11px] truncate"
                                style={{ color: mutedText }}
                              >
                                {order.name}
                              </p>
                            </div>
                            <span
                              className="font-display text-[13px] font-semibold tabular-nums shrink-0"
                              style={{ color: foreText }}
                            >
                              {order.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping notification capsule */}
            <div
              className="absolute -end-3 sm:end-6 top-12 sm:top-16 p-3 rounded-[4px] hidden sm:flex items-center gap-3 animate-float"
              style={{
                background: "rgba(245, 239, 230, 0.95)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(15, 22, 36, 0.12)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="size-8 rounded-[4px] bg-sage/15 flex items-center justify-center">
                <span className="font-mono text-[11px] font-semibold text-sage">+1</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-ink">
                  {t("preview.new_order")}
                </p>
                <p className="font-mono text-[9px] text-ink-soft/60 uppercase tracking-[0.18em]">
                  {t("preview.new_order_time")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats bar — each stat gets a different accent color per brand-kit palette
export const HeroStats: React.FC = () => {
  const { dir } = useLanguage();
  const stats = [
    {
      value: 1000,
      suffix: "+",
      label: dir === "rtl" ? "تاجر" : "Merchants",
      color: "text-navy",
    },
    {
      value: 50000,
      suffix: "+",
      label: dir === "rtl" ? "طلب" : "Orders Processed",
      color: "text-saffron",
    },
    {
      value: 99,
      suffix: "%",
      label: dir === "rtl" ? "وقت تشغيل" : "Uptime",
      color: "text-sage",
    },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 py-8 sm:py-10">
      {stats.map((stat, i) => (
        <React.Fragment key={i}>
          <div className="text-center">
            <p
              className={`font-display text-3xl sm:text-4xl font-bold tabular-nums tracking-tight leading-none ${stat.color}`}
            >
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/70">
              {stat.label}
            </p>
          </div>
          {/* Bone divider between stats — brand-kit neutral */}
          {i < stats.length - 1 && (
            <span
              className="hidden sm:block w-px h-10 bg-bone"
              aria-hidden="true"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Hero;
