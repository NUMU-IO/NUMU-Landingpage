import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSEO } from "../../hooks/useSEO";

/**
 * COD cost calculator — free SEO tool. Targets "تكلفة الدفع عند الاستلام",
 * "حاسبة الشحن", "نسبة المرتجعات", "RTO". Everything client-side.
 *
 * The point of difference: every other shipping calculator in the market
 * answers "what does one shipment cost", which is the easy half and not the
 * question that decides whether a COD business survives. The cost that kills
 * Egyptian merchants is RTO — you pay outbound shipping on every attempt,
 * return shipping on every refusal, and collect revenue on neither. At an 18%
 * refusal rate you are funding roughly one in five deliveries out of the
 * margin on the other four.
 *
 * So this computes per ATTEMPT and then divides by the delivered fraction,
 * which is the only way to get a truthful cost-per-delivered-order, and it
 * surfaces the break-even RTO rate: the refusal percentage above which the
 * product loses money no matter how well it sells.
 */

const toArabicDigits = (s: string): string =>
  s.replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d, 10)));

const arabicToWestern = (s: string): string =>
  s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

const parseNum = (raw: string): number => {
  const cleaned = arabicToWestern(raw).replace(/[^0-9.]/g, "");
  if (!cleaned) return NaN;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
};

const fmt = (n: number, isAr: boolean, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(isAr ? "ar-EG" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

const FIELDS = [
  {
    id: "aov",
    label_ar: "قيمة الأوردر",
    label_en: "Order value",
    hint_ar: "متوسط سعر الأوردر (ج.م)",
    hint_en: "Average order value (EGP)",
    def: "450",
  },
  {
    id: "cogs",
    label_ar: "تكلفة البضاعة",
    label_en: "Cost of goods",
    hint_ar: "تكلفتك أنت للمنتج",
    hint_en: "What the product costs you",
    def: "180",
  },
  {
    id: "ship",
    label_ar: "تكلفة الشحن",
    label_en: "Shipping cost",
    hint_ar: "بتدفعها على كل محاولة توصيل",
    hint_en: "Paid on every delivery attempt",
    def: "60",
  },
  {
    id: "returnShip",
    label_ar: "تكلفة المرتجع",
    label_en: "Return cost",
    hint_ar: "شحن رجوع الأوردر المرفوض",
    hint_en: "Return leg on a refused order",
    def: "40",
  },
  {
    id: "codFee",
    label_ar: "عمولة التحصيل ٪",
    label_en: "COD collection fee %",
    hint_ar: "نسبة شركة الشحن من قيمة الأوردر",
    hint_en: "Courier's % of collected value",
    def: "1",
  },
  {
    id: "rto",
    label_ar: "نسبة المرتجعات ٪",
    label_en: "RTO / refusal rate %",
    hint_ar: "الأوردرات اللي بترجع من غير تسليم",
    hint_en: "Orders returned undelivered",
    def: "18",
  },
  {
    id: "packaging",
    label_ar: "التغليف",
    label_en: "Packaging",
    hint_ar: "تكلفة التغليف للأوردر",
    hint_en: "Per-order packaging cost",
    def: "10",
  },
  {
    id: "orders",
    label_ar: "أوردرات في الشهر",
    label_en: "Orders per month",
    hint_ar: "لحساب الأثر الشهري",
    hint_en: "For the monthly figure",
    def: "300",
  },
];

const Tool: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  useSEO({
    title: isAr
      ? "حاسبة تكلفة الدفع عند الاستلام والمرتجعات — نُمُو"
      : "COD & RTO cost calculator — numu",
    description: isAr
      ? "احسب تكلفة الدفع عند الاستلام الحقيقية لكل أوردر متسلّم — بالشحن والمرتجعات وعمولة التحصيل، واعرف نسبة المرتجعات اللي بتخليك تخسر. مجاني."
      : "Work out the true cost of cash on delivery per delivered order — shipping, returns and collection fees included — and the RTO rate at which you start losing money. Free, no signup.",
    canonical: "https://numueg.app/tools/cod",
  });

  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.id, f.def])),
  );
  const set = (id: string, v: string) => setVals((p) => ({ ...p, [id]: v }));

  const calc = useMemo(() => {
    const n = (id: string) => parseNum(vals[id]);
    const aov = n("aov");
    const cogs = n("cogs");
    const ship = n("ship") || 0;
    const returnShip = n("returnShip") || 0;
    const codFee = (n("codFee") || 0) / 100;
    const rto = Math.min(Math.max((n("rto") || 0) / 100, 0), 0.99);
    const packaging = n("packaging") || 0;
    const orders = Math.max(0, n("orders") || 0);

    if (!Number.isFinite(aov) || !Number.isFinite(cogs)) return null;

    const delivered = 1 - rto;

    // Contribution from one DELIVERED order, before any logistics cost.
    // Goods on a refused order come back and are resold, so COGS is only
    // consumed on delivery — the loss on an RTO is the shipping, not the stock.
    const contribution = aov - cogs - codFee * aov;

    // Per attempt: outbound shipping and packaging are paid whatever happens;
    // the return leg only on refusals; revenue only on deliveries.
    const perAttempt =
      contribution * delivered - ship - packaging - returnShip * rto;

    const perDelivered = delivered > 0 ? perAttempt / delivered : NaN;

    // All logistics spend attributable to one delivered order — this is the
    // number merchants think is `ship` and is not.
    const logisticsPerDelivered =
      delivered > 0 ? (ship + packaging + returnShip * rto) / delivered : NaN;

    // Break-even RTO. Solving perAttempt = 0 for r:
    //   contribution*(1-r) - ship - packaging - returnShip*r = 0
    //   r = (contribution - ship - packaging) / (contribution + returnShip)
    const denom = contribution + returnShip;
    const breakEven =
      denom > 0 ? (contribution - ship - packaging) / denom : NaN;

    const marginPct = aov > 0 && delivered > 0 ? (perDelivered / aov) * 100 : NaN;

    // What five points of RTO is worth per month — the COD Autopilot pitch,
    // stated as money rather than as a claim.
    const improvedRto = Math.max(rto - 0.05, 0);
    const improvedPerAttempt =
      contribution * (1 - improvedRto) - ship - packaging - returnShip * improvedRto;
    const monthlyGain = (improvedPerAttempt - perAttempt) * orders;

    return {
      perDelivered,
      logisticsPerDelivered,
      breakEven: breakEven * 100,
      marginPct,
      monthlyProfit: perAttempt * orders,
      monthlyGain,
      losing: perDelivered < 0,
      nearEdge: Number.isFinite(breakEven) && rto > breakEven * 0.8,
      rtoPct: rto * 100,
    };
  }, [vals]);

  const num = (n: number, d = 2) => {
    const s = fmt(n, isAr, d);
    return isAr ? toArabicDigits(s) : s;
  };

  return (
    <div className="min-h-screen bg-cream paper-grain" dir={dir}>
      <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 border-b border-ink/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <Link
          to="/tools"
          className="flex items-center gap-2.5"
          aria-label={isAr ? "كل الأدوات" : "All tools"}
        >
          <img
            src="/numu-mark-cream.webp"
            alt=""
            className="h-8 w-auto object-contain"
            width="40"
            height="40"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80">
            § {isAr ? "الأدوات" : "TOOLS"}
          </span>
        </Link>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80 hover:text-navy transition-colors"
        >
          ← {isAr ? "الرئيسية" : "Home"}
        </Link>
      </nav>

      <div className="relative z-10 text-center px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
        <div className="inline-flex items-center gap-2 bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-terracotta" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-terracotta uppercase tracking-[0.18em]">
            § COD · RTO-AWARE
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.08] mb-4 max-w-3xl mx-auto">
          {isAr ? (
            <>
              الدفع عند الاستلام بيكلفك{" "}
              <span className="text-terracotta">أكتر مما تفتكر.</span>
            </>
          ) : (
            <>
              COD costs more than{" "}
              <span className="text-terracotta">the shipping label.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "أي حاسبة شحن هتقولك تكلفة الشحنة. دي بتقولك تكلفة الأوردر المتسلّم فعلاً — بعد ما تحسب الأوردرات اللي رجعت وانت دافع شحنها."
            : "Any shipping calculator tells you what one shipment costs. This tells you what a delivered order costs — after the refused ones you paid to ship anyway."}
        </p>
      </div>

      <div className="relative z-10 max-w-[1060px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70 mb-4">
              § {isAr ? "المدخلات" : "INPUTS"}
            </p>
            <div className="flex flex-col gap-4">
              {FIELDS.map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={f.id}
                    className="block font-display text-sm font-semibold text-ink mb-1"
                  >
                    {isAr ? f.label_ar : f.label_en}
                  </label>
                  <input
                    id={f.id}
                    type="text"
                    inputMode="decimal"
                    value={vals[f.id]}
                    onChange={(e) => set(f.id, e.target.value)}
                    className="w-full h-11 px-3 bg-cream border border-ink/15 rounded-[4px] font-display text-base text-ink tabular-nums focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu"
                    dir="ltr"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/55">
                    {isAr ? f.hint_ar : f.hint_en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div
              className={`rounded-[10px] p-6 sm:p-8 text-center ${
                calc?.losing
                  ? "bg-terracotta text-cream"
                  : calc?.nearEdge
                    ? "bg-saffron text-ink"
                    : "bg-sage/90 text-cream"
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold opacity-70 mb-2">
                § {isAr ? "الربح من كل أوردر متسلّم" : "PROFIT PER DELIVERED ORDER"}
              </p>
              <p className="font-display text-5xl sm:text-6xl font-bold tabular-nums leading-none mb-3">
                {calc ? num(calc.perDelivered) : "—"}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-70">
                {isAr ? "جنيه · بعد المرتجعات" : "EGP · after returns"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label_ar: "تكلفة اللوجستيات الحقيقية",
                  label_en: "True logistics cost",
                  value: calc ? num(calc.logisticsPerDelivered) : "—",
                  sub_ar: "لكل أوردر متسلّم",
                  sub_en: "per delivered order",
                },
                {
                  label_ar: "الهامش الصافي",
                  label_en: "Net margin",
                  value: calc ? `${num(calc.marginPct, 1)}${isAr ? "٪" : "%"}` : "—",
                  sub_ar: "من قيمة الأوردر",
                  sub_en: "of order value",
                },
                {
                  label_ar: "نقطة التعادل",
                  label_en: "Break-even RTO",
                  // A negative break-even is arithmetically valid and means the
                  // product loses money at ZERO returns — the margin does not
                  // cover shipping at all. Printing "-12%" as a refusal rate
                  // would read as nonsense, so say what it actually means.
                  value: !calc
                    ? "—"
                    : calc.breakEven < 0
                      ? isAr
                        ? "خسارة دائماً"
                        : "Always a loss"
                      : `${num(Math.min(calc.breakEven, 100), 1)}${isAr ? "٪" : "%"}`,
                  sub_ar:
                    calc && calc.breakEven < 0
                      ? "الهامش لا يغطي الشحن"
                      : "فوقها بتخسر",
                  sub_en:
                    calc && calc.breakEven < 0
                      ? "margin never covers shipping"
                      : "above this you lose",
                },
              ].map((c) => (
                <div
                  key={c.label_en}
                  className="bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 text-center"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/60 mb-2">
                    {isAr ? c.label_ar : c.label_en}
                  </p>
                  <p className="font-display text-2xl font-bold text-ink tabular-nums">
                    {c.value}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-ink-soft/50">
                    {isAr ? c.sub_ar : c.sub_en}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70 mb-3">
                § {isAr ? "لو قلّلت المرتجعات ٥ نقاط" : "IF RTO DROPPED 5 POINTS"}
              </p>
              <p className="font-display text-3xl font-bold text-ink tabular-nums mb-2">
                +{calc ? num(calc.monthlyGain, 0) : "—"}{" "}
                <span className="font-mono text-sm font-medium text-ink-soft/60">
                  {isAr ? "ج.م / شهر" : "EGP / month"}
                </span>
              </p>
              <p className="prose-body text-sm text-ink/75 mb-4">
                {isAr
                  ? "ده مش تخفيض في التكلفة — ده ربح كنت بتدفعه شحن لأوردرات محدش استلمها. تأكيد الأوردر على واتساب قبل الشحن هو أرخص طريقة لتقليل الرقم ده."
                  : "That is not a cost saving — it is margin you were spending to ship orders nobody accepted. Confirming orders over WhatsApp before dispatch is the cheapest way to move that number."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/?signup=1"
                  className="inline-flex items-center gap-2 rounded-[4px] bg-navy px-5 py-2.5 font-display text-sm font-semibold text-cream transition-colors hover:bg-navy/90"
                >
                  {isAr ? "ابدأ مجاناً" : "Start free"}
                </Link>
                <Link
                  to="/tools/profit-margin"
                  className="inline-flex items-center gap-2 rounded-[4px] border border-ink/15 px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-navy/40"
                >
                  {isAr ? "حاسبة هامش الربح" : "Profit margin calculator"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* The prose is what earns the ranking — a calculator with no answer in
            it is a thin page. This is also the actual explanation of why the
            number is higher than merchants expect. */}
        <div className="mt-12 max-w-[760px] mx-auto">
          <h2 className="font-display text-2xl font-bold text-ink mb-4">
            {isAr
              ? "ليه تكلفة الدفع عند الاستلام أعلى من سعر الشحن؟"
              : "Why COD costs more than the shipping rate"}
          </h2>
          <div className="flex flex-col gap-4 prose-body text-ink/75 text-sm leading-relaxed">
            <p>
              {isAr
                ? "لما أوردر يترفض، انت دفعت الشحن رايح، ودفعت شحن الرجوع، وما حصّلتش جنيه. البضاعة بترجعلك وتتباع تاني، لكن فلوس الشحن دي راحت."
                : "When an order is refused you have paid the outbound leg, paid the return leg, and collected nothing. The stock comes back and resells — the shipping money does not."}
            </p>
            <p>
              {isAr
                ? "يعني تكلفة الشحن الحقيقية لكل أوردر متسلّم مش سعر الشحنة. بتتقسم على نسبة الأوردرات اللي وصلت فعلاً. عند ٢٠٪ مرتجعات، كل ٤ أوردرات متسلّمة بتشيل تكلفة شحن ٥."
                : "So the real shipping cost of a delivered order is not the label price — it is that price divided by the share that actually arrived. At 20% RTO, every 4 delivered orders carry the shipping cost of 5."
              }
            </p>
            <p>
              {isAr
                ? "وعشان كده فيه نسبة مرتجعات بتخلي المنتج خسران مهما باع كويس. الحاسبة بتطلعلك النسبة دي فوق — لو نسبتك الحالية قريبة منها، المشكلة مش في التسعير."
                : "That is why there is an RTO rate above which a product loses money no matter how well it sells. The break-even figure above is that rate — if yours is anywhere near it, the problem is not your pricing."}
            </p>
            <p>
              {isAr
                ? "في مصر النسبة الطبيعية بتتراوح بين ١٥٪ و٣٠٪ حسب المنتج والمصدر اللي جايب منه العملاء. الإعلانات اللي بتجيب أوردرات بسرعة عادةً بتجيب أعلى نسبة رفض."
                : "In Egypt the usual range is 15–30% depending on the product and where the traffic came from. Channels that produce orders fastest tend to produce the highest refusal rates."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tool;
