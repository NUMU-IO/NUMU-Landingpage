import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

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
  const { t, dir } = useLanguage();

  // Real merchant hub colors
  const dashBg = "#0d1117"; // hsl(225, 25%, 6%)
  const cardBg =
    "linear-gradient(168deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)";
  const cardBorder = "rgba(255,255,255,0.06)";
  const cardShadow =
    "0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.12)";
  const mutedText = "rgba(255,255,255,0.45)";
  const foreText = "rgba(255,255,255,0.92)";
  const primaryColor = "#3b82f6";

  return (
    <div className="relative hero-bg pb-32 sm:pb-40 lg:pb-48">
      {/* Dot grid texture - same as merchant hub auth */}
      <div className="absolute inset-0 hero-dot-grid pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-20 lg:pb-28">
        {/* Two-column hero: text + floating visuals */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-12 lg:mb-16">
          {/* Text side */}
          <div className="flex-1 text-center lg:text-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in-up">
              <span className="size-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold text-white/60 tracking-wide uppercase">
                {t("hero.built_for")}
              </span>
            </div>

            {/* Headline — each line is a separate block for clean Arabic spacing */}
            <div
              className="font-arabic font-extrabold text-white mb-6 animate-fade-in-up-1 flex flex-col pt-3 overflow-visible"
              style={{ gap: "0.75rem" }}
            >
              <p
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ lineHeight: 1.6, paddingTop: '0.2em' }}
              >
                <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', paddingTop: '0.3em', display: 'inline-block' }}>
                  {t("hero.title_line1").split(" ")[0]}
                </span>{" "}
                {t("hero.title_line1").split(" ").slice(1).join(" ")}
              </p>
              <p
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ lineHeight: 1.1 }}
              >
                {t("hero.title_line2")}
              </p>
              <p
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent pt-2"
                style={{ lineHeight: 1.1 }}
              >
                {t("hero.title_line3")}
                {t("hero.title_line4") !== "hero.title_line4" && t("hero.title_line4") ? " " + t("hero.title_line4") : ""}
              </p>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-white/50 leading-relaxed max-w-xl animate-fade-in-up-2 mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 animate-fade-in-up-3 justify-center lg:justify-start">
              <a
                href="#waitlist"
                onClick={(e) => { e.preventDefault(); document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="group bg-brand-gradient text-white font-bold py-3.5 px-8 rounded-2xl shadow-[5px_5px_10px_rgba(15,23,42,0.3),-5px_-5px_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(30,64,175,0.3)] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <span>{t("hero.cta_primary")}</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform">
                  arrow_forward
                </span>
              </a>
              <button className="text-white/60 hover:text-white font-bold py-3.5 px-8 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined text-primary text-lg">
                  play_circle
                </span>
                <span>{t("hero.cta_secondary")}</span>
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 animate-fade-in-up-4 justify-center lg:justify-start">
              {[
                { icon: "check_circle", text: t("hero.badge_eta") },
                { icon: "check_circle", text: t("hero.badge_whatsapp") },
                { icon: "check_circle", text: t("hero.badge_clean") },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-white/40 text-xs sm:text-sm"
                >
                  <span className="material-symbols-outlined text-primary text-sm">
                    {badge.icon}
                  </span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating visuals side — hidden on mobile */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative h-[480px] animate-fade-in-up-3">
            {/* Floating order notification */}
            <div
              className="absolute top-8 end-0 p-3.5 rounded-xl flex items-center gap-3 animate-float z-10"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <div className="size-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-400">
                  shopping_cart
                </span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white/90">
                  {t("preview.new_order")}
                </p>
                <p className="text-[10px] text-white/40">
                  {dir === "rtl" ? "القاهرة • EGP 1,300" : "Cairo • EGP 1,300"}
                </p>
              </div>
            </div>

            {/* Large NUMU symbol as ambient bg element */}
            <div className="relative">
              {/* Colorful glow behind the logo */}
              <div
                className="absolute inset-0 scale-150 blur-[60px] rounded-full opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, rgba(30,64,175,0.6), rgba(99,102,241,0.3) 50%, transparent 70%)",
                }}
              />
              <img
                src="/numu-symbol-white.webp"
                alt=""
                width="256"
                height="256"
                className="h-48 sm:h-64 w-auto object-contain animate-float relative"
                style={{ animationDelay: "1s" }}
                decoding="async"
              />
            </div>

            {/* Floating revenue card */}
            <div
              className="absolute bottom-12 start-0 p-3.5 rounded-xl animate-float z-10"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                animationDelay: "2s",
              }}
            >
              <p className="text-[10px] text-white/40 mb-1">
                {dir === "rtl" ? "إيرادات اليوم" : "Today's Revenue"}
              </p>
              <p className="text-lg font-black text-white/90 tabular-nums">
                EGP 24,800
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-emerald-400 text-xs">
                  trending_up
                </span>
                <span className="text-[10px] font-semibold text-emerald-400">
                  +18%
                </span>
              </div>
            </div>

            {/* Floating shipping badge */}
            <div
              className="absolute top-1/2 start-4 p-2.5 rounded-lg animate-float"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.08)",
                animationDelay: "4s",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400 text-sm rtl:-scale-x-100">
                  local_shipping
                </span>
                <span className="text-[10px] font-semibold text-white/70">
                  Bosta
                </span>
                <span className="size-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== REAL MERCHANT HUB DASHBOARD MOCKUP ===== */}
        <div className="animate-fade-in-up-5">
          <div className="relative max-w-5xl mx-auto">
            {/* Glow behind */}
            <div className="absolute -inset-4 bg-primary/8 rounded-[2rem] blur-2xl pointer-events-none" />

            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: dashBg,
                boxShadow:
                  "0 20px 60px -12px rgba(0,0,0,0.6), 0 0 80px rgba(30,64,175,0.06)",
              }}
            >
              {/* Window chrome - reversed for RTL feel */}
              <div
                className="flex items-center gap-2 px-5 py-3"
                style={{ borderBottom: `1px solid ${cardBorder}` }}
              >
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-red-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div
                    className="flex items-center gap-2 rounded-lg px-4 py-1"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <span
                      className="material-symbols-outlined text-xs"
                      style={{ color: mutedText }}
                    >
                      lock
                    </span>
                    <span className="text-[11px]" style={{ color: mutedText }}>
                      numueg.app/dashboard
                    </span>
                  </div>
                </div>
                <div className="w-[52px]" />
              </div>

              {/* Dashboard content */}
              <div className="flex" style={{ direction: dir }}>
                {/* Sidebar - matches real merchant hub */}
                <div
                  className="hidden md:flex flex-col w-[200px] py-4 px-3 gap-0.5 shrink-0"
                  style={{ borderInlineEnd: `1px solid ${cardBorder}` }}
                >
                  {/* Logo */}
                  <div className="flex items-center gap-2.5 px-3 py-2 mb-4">
                    <div
                      className="size-7 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.92)" }}
                    >
                      <span
                        className="text-[10px] font-black"
                        style={{ color: dashBg }}
                      >
                        N
                      </span>
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: foreText }}
                    >
                      NUMU
                    </span>
                  </div>

                  {/* Active item */}
                  <div
                    className="flex items-center gap-2.5 px-3 py-[7px] rounded-lg mb-0.5"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ color: foreText }}
                    >
                      dashboard
                    </span>
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: foreText }}
                    >
                      {dir === "rtl" ? "لوحة التحكم" : "Dashboard"}
                    </span>
                  </div>

                  {/* Regular items */}
                  {[
                    {
                      icon: "shopping_bag",
                      label: dir === "rtl" ? "الطلبات" : "Orders",
                    },
                    {
                      icon: "inventory_2",
                      label: dir === "rtl" ? "المنتجات" : "Products",
                    },
                    {
                      icon: "category",
                      label: dir === "rtl" ? "الأقسام" : "Categories",
                    },
                    {
                      icon: "people",
                      label: dir === "rtl" ? "العملاء" : "Customers",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-3 py-[7px] rounded-lg hover:bg-white/[0.04] transition-colors"
                    >
                      <span
                        className="material-symbols-outlined text-[15px]"
                        style={{ color: mutedText }}
                      >
                        {item.icon}
                      </span>
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: mutedText }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}

                  {/* Group label */}
                  <div className="px-3 mt-4 mb-2">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      {dir === "rtl" ? "إحصائيات" : "Insights"}
                    </span>
                  </div>
                  {[
                    {
                      icon: "bar_chart",
                      label: dir === "rtl" ? "التقارير" : "Analytics",
                    },
                    {
                      icon: "local_shipping",
                      label: dir === "rtl" ? "الشحن" : "Shipping",
                    },
                    {
                      icon: "receipt_long",
                      label: dir === "rtl" ? "الفواتير" : "Invoices",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-3 py-[7px] rounded-lg hover:bg-white/[0.04] transition-colors"
                    >
                      <span
                        className="material-symbols-outlined text-[15px]"
                        style={{ color: mutedText }}
                      >
                        {item.icon}
                      </span>
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: mutedText }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Main content area */}
                <div className="flex-1 p-4 sm:p-5 min-w-0">
                  {/* Greeting */}
                  <div className="mb-5">
                    <h3
                      className="text-sm sm:text-[15px] font-semibold mb-0.5"
                      style={{ color: foreText }}
                    >
                      {dir === "rtl"
                        ? "صباح الخير، أحمد"
                        : "Good morning, Ahmed"}
                    </h3>
                    <p className="text-[11px]" style={{ color: mutedText }}>
                      {dir === "rtl"
                        ? "عندك 8 طلبات جديدة النهاردة"
                        : "You have 8 new orders today"}
                    </p>
                  </div>

                  {/* KPI Cards - glass cards matching merchant hub */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    {[
                      {
                        label: dir === "rtl" ? "الإيرادات" : "Revenue",
                        value: "EGP 24,800",
                        change: "+18%",
                        icon: "trending_up",
                      },
                      {
                        label: dir === "rtl" ? "الطلبات" : "Orders",
                        value: "156",
                        change: "+12%",
                        icon: "shopping_cart",
                      },
                      {
                        label: dir === "rtl" ? "العملاء" : "Customers",
                        value: "2,340",
                        change: "+8%",
                        icon: "group",
                      },
                      {
                        label: dir === "rtl" ? "معدل التحويل" : "Conversion",
                        value: "3.2%",
                        change: "+0.4%",
                        icon: "speed",
                      },
                    ].map((kpi, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-3 sm:p-4"
                        style={{
                          background: cardBg,
                          border: `1px solid ${cardBorder}`,
                          boxShadow: cardShadow,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-[11px] font-medium uppercase tracking-wider"
                            style={{ color: mutedText }}
                          >
                            {kpi.label}
                          </span>
                          <span
                            className="material-symbols-outlined text-sm"
                            style={{ color: "rgba(255,255,255,0.15)" }}
                          >
                            {kpi.icon}
                          </span>
                        </div>
                        <p
                          className="text-lg sm:text-2xl font-bold tracking-tight tabular-nums leading-none mb-1"
                          style={{ color: foreText }}
                        >
                          {kpi.value}
                        </p>
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {kpi.change}
                        </span>
                        <span
                          className="text-[10px] ms-1"
                          style={{ color: mutedText }}
                        >
                          {dir === "rtl" ? "من أمس" : "vs yesterday"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Chart + Recent Orders */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                    {/* Revenue Chart */}
                    <div
                      className="lg:col-span-3 rounded-xl p-4"
                      style={{
                        background: cardBg,
                        border: `1px solid ${cardBorder}`,
                        boxShadow: cardShadow,
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: foreText }}
                        >
                          {dir === "rtl" ? "الإيرادات" : "Revenue"}
                        </span>
                        <div className="flex gap-1">
                          {["7d", "30d", "90d"].map((p, i) => (
                            <span
                              key={p}
                              className="text-[10px] px-2.5 py-0.5 rounded-md font-medium"
                              style={{
                                background:
                                  i === 0
                                    ? "rgba(255,255,255,0.1)"
                                    : "transparent",
                                color: i === 0 ? foreText : mutedText,
                                boxShadow:
                                  i === 0
                                    ? "0 1px 2px rgba(0,0,0,0.2)"
                                    : "none",
                              }}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Chart bars */}
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
                            className="flex-1 rounded-t-[3px] transition-all duration-300 cursor-pointer"
                            style={{
                              height: `${h}%`,
                              background:
                                activeBar === i
                                  ? `linear-gradient(180deg, ${primaryColor}, #1e3a8a)`
                                  : `rgba(59, 130, 246, ${0.08 + h / 600})`,
                              boxShadow:
                                activeBar === i
                                  ? `0 0 12px rgba(59,130,246,0.4)`
                                  : "none",
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {(dir === "rtl"
                          ? [
                              "جمعة",
                              "خميس",
                              "أربعاء",
                              "ثلاثاء",
                              "إثنين",
                              "أحد",
                              "سبت",
                            ]
                          : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]
                        ).map((d) => (
                          <span
                            key={d}
                            className="text-[9px]"
                            style={{ color: mutedText }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div
                      className="lg:col-span-2 rounded-xl p-4"
                      style={{
                        background: cardBg,
                        border: `1px solid ${cardBorder}`,
                        boxShadow: cardShadow,
                      }}
                    >
                      <span
                        className="text-[13px] font-semibold block mb-3"
                        style={{ color: foreText }}
                      >
                        {dir === "rtl" ? "آخر الطلبات" : "Recent Orders"}
                      </span>
                      <div className="space-y-1">
                        {[
                          {
                            id: "#1284",
                            name: dir === "rtl" ? "فاطمة أحمد" : "Fatma Ahmed",
                            amount: "EGP 450",
                            status: "Delivered",
                            statusColor:
                              "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                          },
                          {
                            id: "#1283",
                            name: dir === "rtl" ? "محمد علي" : "Mohamed Ali",
                            amount: "EGP 1,200",
                            status: "Shipped",
                            statusColor:
                              "text-blue-400 bg-blue-500/10 border-blue-500/20",
                          },
                          {
                            id: "#1282",
                            name: dir === "rtl" ? "سارة حسن" : "Sara Hassan",
                            amount: "EGP 320",
                            status: "Processing",
                            statusColor:
                              "text-amber-400 bg-amber-500/10 border-amber-500/20",
                          },
                          {
                            id: "#1281",
                            name: dir === "rtl" ? "أحمد يوسف" : "Ahmed Youssef",
                            amount: "EGP 890",
                            status: "Pending",
                            statusColor:
                              "text-white/40 bg-white/5 border-white/10",
                          },
                        ].map((order, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 rounded-lg p-2 -mx-1 hover:bg-white/[0.03] transition-colors"
                          >
                            <div
                              className="size-7 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,0.06)" }}
                            >
                              <span
                                className="text-[10px] font-semibold"
                                style={{ color: mutedText }}
                              >
                                {order.name[0]}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-[13px] font-semibold tabular-nums"
                                  style={{ color: foreText }}
                                >
                                  {order.id}
                                </span>
                                <span
                                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${order.statusColor}`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p
                                className="text-[11px]"
                                style={{ color: mutedText }}
                              >
                                {order.name}
                              </p>
                            </div>
                            <span
                              className="text-[13px] font-semibold tabular-nums shrink-0"
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

            {/* Floating notification */}
            <div
              className="absolute -end-3 sm:end-6 top-16 sm:top-20 p-3 rounded-xl animate-float hidden sm:flex items-center gap-3"
              style={{
                background: "rgba(13,17,23,0.9)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${cardBorder}`,
                boxShadow: cardShadow,
              }}
            >
              <div className="size-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-400 text-sm">
                  shopping_cart
                </span>
              </div>
              <div>
                <p
                  className="text-[11px] font-semibold"
                  style={{ color: foreText }}
                >
                  {t("preview.new_order")}
                </p>
                <p className="text-[9px]" style={{ color: mutedText }}>
                  {t("preview.new_order_time")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean hard cut — no gradient, the dashboard mockup bridges the gap */}
    </div>
  );
};

// Stats bar — exported separately to sit in the light section
export const HeroStats: React.FC = () => {
  const { dir } = useLanguage();
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 py-10 sm:py-14">
      {[
        {
          value: 1000,
          suffix: "+",
          label: dir === "rtl" ? "تاجر" : "Merchants",
        },
        {
          value: 50000,
          suffix: "+",
          label: dir === "rtl" ? "طلب" : "Orders Processed",
        },
        {
          value: 99,
          suffix: "%",
          label: dir === "rtl" ? "وقت تشغيل" : "Uptime",
        },
      ].map((stat, i) => (
        <div key={i} className="text-center">
          <p className="text-2xl sm:text-3xl font-black text-text-main">
            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
          </p>
          <p className="text-xs text-text-muted mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Hero;
