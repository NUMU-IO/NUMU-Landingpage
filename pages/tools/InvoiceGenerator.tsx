import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSEO } from "../../hooks/useSEO";

/**
 * Egyptian invoice generator — free SEO tool (audit §2.6). Produces an
 * ETA-format-compatible printable invoice with the fields the Egyptian
 * Tax Authority expects (seller + buyer registration, VAT breakdown,
 * line items, currency in words). Not a submission tool — that requires
 * ETA credentials and a numu account. This is a lightweight template
 * for merchants who still invoice by hand.
 *
 * Print-to-PDF via window.print() — the printable area uses @media print
 * to hide the editor and show only the invoice body.
 */

const toArabicDigits = (s: string): string =>
  s.replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d, 10)));

const arabicToWestern = (s: string): string =>
  s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

const parseNum = (raw: string): number => {
  const cleaned = arabicToWestern(raw).replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const fmt = (n: number, isAr: boolean, digits = 2): string =>
  n.toLocaleString(isAr ? "ar-EG" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

interface LineItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

const makeId = () => Math.random().toString(36).slice(2, 9);

/** Number to Arabic words — covers 0..999,999,999 for EGP invoice totals.
 *  Sufficient for invoice-scale numbers; not a general library. */
const numberToArabic = (n: number): string => {
  if (n === 0) return "صفر";
  if (n < 0) return "سالب " + numberToArabic(-n);
  const ones = [
    "",
    "واحد",
    "اثنان",
    "ثلاثة",
    "أربعة",
    "خمسة",
    "ستة",
    "سبعة",
    "ثمانية",
    "تسعة",
    "عشرة",
    "أحد عشر",
    "اثنا عشر",
    "ثلاثة عشر",
    "أربعة عشر",
    "خمسة عشر",
    "ستة عشر",
    "سبعة عشر",
    "ثمانية عشر",
    "تسعة عشر",
  ];
  const tens = [
    "",
    "",
    "عشرون",
    "ثلاثون",
    "أربعون",
    "خمسون",
    "ستون",
    "سبعون",
    "ثمانون",
    "تسعون",
  ];
  const hundreds = [
    "",
    "مائة",
    "مائتان",
    "ثلاثمائة",
    "أربعمائة",
    "خمسمائة",
    "ستمائة",
    "سبعمائة",
    "ثمانمائة",
    "تسعمائة",
  ];
  const under1000 = (num: number): string => {
    const parts: string[] = [];
    const h = Math.floor(num / 100);
    const r = num % 100;
    if (h) parts.push(hundreds[h]);
    if (r < 20) {
      if (r) parts.push(ones[r]);
    } else {
      const t = Math.floor(r / 10);
      const o = r % 10;
      if (o && t) parts.push(`${ones[o]} و${tens[t]}`);
      else if (o) parts.push(ones[o]);
      else parts.push(tens[t]);
    }
    return parts.join(" و");
  };
  const million = Math.floor(n / 1_000_000);
  const thousand = Math.floor((n % 1_000_000) / 1000);
  const rest = Math.floor(n % 1000);
  const parts: string[] = [];
  if (million) parts.push(`${under1000(million)} مليون`);
  if (thousand) parts.push(`${under1000(thousand)} ألف`);
  if (rest) parts.push(under1000(rest));
  return parts.join(" و");
};

const numberToEnglish = (n: number): string => {
  if (n === 0) return "Zero";
  if (n < 0) return "Minus " + numberToEnglish(-n);
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const under1000 = (num: number): string => {
    const parts: string[] = [];
    const h = Math.floor(num / 100);
    const r = num % 100;
    if (h) parts.push(`${ones[h]} Hundred`);
    if (r < 20) {
      if (r) parts.push(ones[r]);
    } else {
      const t = Math.floor(r / 10);
      const o = r % 10;
      parts.push(tens[t] + (o ? `-${ones[o]}` : ""));
    }
    return parts.join(" and ");
  };
  const million = Math.floor(n / 1_000_000);
  const thousand = Math.floor((n % 1_000_000) / 1000);
  const rest = Math.floor(n % 1000);
  const parts: string[] = [];
  if (million) parts.push(`${under1000(million)} Million`);
  if (thousand) parts.push(`${under1000(thousand)} Thousand`);
  if (rest) parts.push(under1000(rest));
  return parts.join(" ");
};

const Tool: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  useSEO({
    title: isAr
      ? "مولّد فاتورة إلكترونية مصرية مجاني — نُمُو"
      : "Egyptian invoice generator — numu",
    description: isAr
      ? "اعمل فاتورة بصيغة مصلحة الضرائب المصرية — ضريبة القيمة المضافة، بنود، إجمالي بالحروف، اطبع أو احفظ PDF. مجاني."
      : "Generate ETA-format Egyptian invoices — VAT, line items, totals in words, print or save as PDF. Free, no signup.",
    canonical: "https://numueg.app/tools/invoice",
  });

  // Seller
  const [sellerName, setSellerName] = useState("");
  const [sellerVat, setSellerVat] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  // Buyer
  const [buyerName, setBuyerName] = useState("");
  const [buyerVat, setBuyerVat] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  // Invoice
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [dueDate, setDueDate] = useState("");
  const [vatRate, setVatRate] = useState("14");
  const [currency, setCurrency] = useState<"EGP" | "USD" | "EUR" | "SAR">("EGP");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<LineItem[]>([
    { id: makeId(), description: "", quantity: "1", unitPrice: "0" },
  ]);

  const totals = useMemo(() => {
    const rate = parseNum(vatRate) / 100;
    const subtotal = items.reduce(
      (sum, it) => sum + parseNum(it.quantity) * parseNum(it.unitPrice),
      0,
    );
    const vat = subtotal * rate;
    const grand = subtotal + vat;
    return { subtotal, vat, grand };
  }, [items, vatRate]);

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };
  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { id: makeId(), description: "", quantity: "1", unitPrice: "0" },
    ]);
  const removeItem = (id: string) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));

  const currencySymbol = currency === "EGP" ? (isAr ? "ج.م" : "EGP") : currency;

  const grandInWords = useMemo(() => {
    const whole = Math.floor(totals.grand);
    if (isAr) return numberToArabic(whole) + " جنيه مصري فقط لا غير";
    return numberToEnglish(whole) + " Egyptian Pounds Only";
  }, [totals.grand, isAr]);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-cream paper-grain" dir={dir}>
      {/* Print styles — hide chrome, format invoice panel as A4 */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-area { box-shadow: none !important; border: none !important; }
          nav.site-nav { display: none !important; }
        }
      `}</style>

      <nav className="site-nav no-print flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 border-b border-ink/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
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

      <div className="no-print relative z-10 text-center px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
        <div className="inline-flex items-center gap-2 bg-sage/10 border border-sage/30 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-sage uppercase tracking-[0.18em]">
            § INVOICE GENERATOR · ETA-FORMAT
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.08] mb-4 max-w-3xl mx-auto">
          {isAr ? (
            <>
              فاتورة مصرية
              {" "}
              <span className="text-terracotta">في دقيقة.</span>
            </>
          ) : (
            <>
              Egyptian invoice in{" "}
              <span className="text-terracotta">one minute.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "املأ التفاصيل يسار، اطبع الفاتورة على اليمين. متوافقة مع حقول مصلحة الضرائب."
            : "Fill in the details on the left, print the invoice on the right. ETA-compatible fields."}
        </p>
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Editor */}
          <div className="no-print flex flex-col gap-4">
            {/* Seller */}
            <section className="bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-terracotta mb-3">
                § {isAr ? "بيانات البائع" : "SELLER"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label={isAr ? "اسم الشركة" : "Company name"}
                  value={sellerName}
                  onChange={setSellerName}
                  placeholder={isAr ? "نُمُو للتجارة" : "numu Trading Co."}
                />
                <Input
                  label={isAr ? "الرقم الضريبي" : "VAT / Tax ID"}
                  value={sellerVat}
                  onChange={setSellerVat}
                  placeholder="123-456-789"
                />
                <Input
                  label={isAr ? "العنوان" : "Address"}
                  value={sellerAddress}
                  onChange={setSellerAddress}
                  className="sm:col-span-2"
                />
                <Input
                  label={isAr ? "التليفون" : "Phone"}
                  value={sellerPhone}
                  onChange={setSellerPhone}
                  placeholder="+20 ..."
                />
                <Input
                  label={isAr ? "الإيميل" : "Email"}
                  value={sellerEmail}
                  onChange={setSellerEmail}
                  placeholder="sales@example.com"
                />
              </div>
            </section>

            {/* Buyer */}
            <section className="bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-navy mb-3">
                § {isAr ? "بيانات المشتري" : "BUYER"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label={isAr ? "اسم المشتري" : "Buyer name"}
                  value={buyerName}
                  onChange={setBuyerName}
                />
                <Input
                  label={isAr ? "الرقم الضريبي (اختياري)" : "Tax ID (optional)"}
                  value={buyerVat}
                  onChange={setBuyerVat}
                />
                <Input
                  label={isAr ? "العنوان" : "Address"}
                  value={buyerAddress}
                  onChange={setBuyerAddress}
                  className="sm:col-span-2"
                />
              </div>
            </section>

            {/* Meta */}
            <section className="bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-saffron mb-3">
                § {isAr ? "تفاصيل الفاتورة" : "INVOICE"}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={isAr ? "رقم الفاتورة" : "Invoice #"}
                  value={invoiceNumber}
                  onChange={setInvoiceNumber}
                />
                <div>
                  <label className="block font-display text-sm font-semibold text-ink mb-1">
                    {isAr ? "العملة" : "Currency"}
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as typeof currency)}
                    className="w-full h-10 px-3 bg-cream border border-ink/15 rounded-[4px] font-display text-sm text-ink focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
                  >
                    <option value="EGP">EGP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="SAR">SAR</option>
                  </select>
                </div>
                <Input
                  label={isAr ? "تاريخ الإصدار" : "Issue date"}
                  value={issueDate}
                  onChange={setIssueDate}
                  type="date"
                />
                <Input
                  label={isAr ? "تاريخ الاستحقاق" : "Due date"}
                  value={dueDate}
                  onChange={setDueDate}
                  type="date"
                />
                <Input
                  label={isAr ? "نسبة الضريبة %" : "VAT rate %"}
                  value={vatRate}
                  onChange={setVatRate}
                  placeholder="14"
                />
              </div>
            </section>

            {/* Line items */}
            <section className="bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-sage">
                  § {isAr ? "البنود" : "LINE ITEMS"}
                </p>
                <button
                  type="button"
                  onClick={addItem}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-terracotta hover:text-navy transition-colors"
                >
                  + {isAr ? "بند جديد" : "Add item"}
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {items.map((it, idx) => {
                  const lineTotal = parseNum(it.quantity) * parseNum(it.unitPrice);
                  return (
                    <div
                      key={it.id}
                      className="grid grid-cols-12 gap-2 items-end"
                    >
                      <input
                        type="text"
                        value={it.description}
                        onChange={(e) =>
                          updateItem(it.id, { description: e.target.value })
                        }
                        placeholder={isAr ? `البند ${idx + 1}` : `Item ${idx + 1}`}
                        className="col-span-6 h-10 px-3 bg-cream border border-ink/15 rounded-[4px] font-display text-sm text-ink focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
                      />
                      <input
                        type="text"
                        inputMode="decimal"
                        value={it.quantity}
                        onChange={(e) =>
                          updateItem(it.id, { quantity: e.target.value })
                        }
                        dir="ltr"
                        className="col-span-2 h-10 px-2 bg-cream border border-ink/15 rounded-[4px] font-display text-sm text-ink tabular-nums text-center focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
                      />
                      <input
                        type="text"
                        inputMode="decimal"
                        value={it.unitPrice}
                        onChange={(e) =>
                          updateItem(it.id, { unitPrice: e.target.value })
                        }
                        dir="ltr"
                        className="col-span-3 h-10 px-2 bg-cream border border-ink/15 rounded-[4px] font-display text-sm text-ink tabular-nums text-end focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        aria-label={isAr ? "حذف" : "Remove"}
                        className="col-span-1 h-10 flex items-center justify-center text-ink-soft/50 hover:text-terracotta transition-colors"
                      >
                        ×
                      </button>
                      <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/55 -mt-1">
                        {isAr ? "الإجمالي:" : "Line total:"}{" "}
                        <span className="text-ink font-semibold tabular-nums">
                          {isAr ? toArabicDigits(fmt(lineTotal, isAr)) : fmt(lineTotal, isAr)}{" "}
                          {currencySymbol}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Notes */}
            <section className="bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6">
              <label
                htmlFor="notes"
                className="block font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70 mb-2"
              >
                § {isAr ? "ملاحظات (اختياري)" : "NOTES (OPTIONAL)"}
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={
                  isAr
                    ? "شروط الدفع · تفاصيل البنك · رسالة شكر..."
                    : "Payment terms · bank details · thank-you note..."
                }
                className="w-full px-3 py-2 bg-cream border border-ink/15 rounded-[4px] font-display text-sm text-ink focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
              />
            </section>

            <button
              type="button"
              onClick={handlePrint}
              className="group bg-navy text-cream font-semibold py-3.5 px-7 rounded-[4px] hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center gap-2 justify-center text-sm"
            >
              <span>{isAr ? "اطبع / احفظ PDF" : "Print / Save as PDF"}</span>
              <span aria-hidden="true" className="text-base text-saffron">
                ⎙
              </span>
            </button>
          </div>

          {/* Live invoice preview */}
          <div className="print-area bg-paper border border-ink/10 rounded-[10px] shadow-card p-6 sm:p-8 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-auto lg:max-h-none lg:overflow-visible">
            {/* Invoice header */}
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta font-semibold mb-1">
                  § {isAr ? "فاتورة" : "INVOICE"}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  {sellerName || (isAr ? "اسم الشركة" : "Your Company")}
                </h2>
                {sellerVat && (
                  <p className="font-mono text-[11px] text-ink-soft/70 mt-1">
                    {isAr ? "الرقم الضريبي: " : "VAT: "} {sellerVat}
                  </p>
                )}
              </div>
              <div className="text-end">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 mb-1">
                  # {invoiceNumber || "INV-0001"}
                </p>
                <p className="font-display text-sm font-semibold text-ink">
                  {isAr ? "التاريخ: " : "Date: "}
                  {issueDate}
                </p>
                {dueDate && (
                  <p className="font-display text-sm text-ink-soft/75">
                    {isAr ? "الاستحقاق: " : "Due: "}
                    {dueDate}
                  </p>
                )}
              </div>
            </div>

            <div className="h-px bg-bone mb-6" />

            {/* Parties */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 font-semibold mb-1">
                  {isAr ? "من" : "From"}
                </p>
                <p className="text-sm text-ink whitespace-pre-line">
                  {sellerAddress}
                  {sellerPhone && `\n${sellerPhone}`}
                  {sellerEmail && `\n${sellerEmail}`}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 font-semibold mb-1">
                  {isAr ? "إلى" : "To"}
                </p>
                <p className="font-display text-sm font-semibold text-ink mb-1">
                  {buyerName || "—"}
                </p>
                <p className="text-sm text-ink-soft/80 whitespace-pre-line">
                  {buyerAddress}
                </p>
                {buyerVat && (
                  <p className="font-mono text-[11px] text-ink-soft/70 mt-1">
                    {isAr ? "الرقم الضريبي: " : "Tax ID: "} {buyerVat}
                  </p>
                )}
              </div>
            </div>

            {/* Items table */}
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="border-b-2 border-navy">
                  <th className="text-start font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-ink-soft/70 py-2">
                    {isAr ? "البند" : "Description"}
                  </th>
                  <th className="text-center font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-ink-soft/70 py-2 w-14">
                    {isAr ? "عدد" : "Qty"}
                  </th>
                  <th className="text-end font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-ink-soft/70 py-2 w-24">
                    {isAr ? "السعر" : "Unit"}
                  </th>
                  <th className="text-end font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-ink-soft/70 py-2 w-24">
                    {isAr ? "الإجمالي" : "Total"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const q = parseNum(it.quantity);
                  const p = parseNum(it.unitPrice);
                  const tot = q * p;
                  return (
                    <tr key={it.id} className="border-b border-bone">
                      <td className="py-3 text-sm text-ink">
                        {it.description || (isAr ? `البند ${idx + 1}` : `Item ${idx + 1}`)}
                      </td>
                      <td className="py-3 text-sm text-ink text-center tabular-nums">
                        {isAr ? toArabicDigits(fmt(q, isAr, 0)) : fmt(q, isAr, 0)}
                      </td>
                      <td className="py-3 text-sm text-ink text-end tabular-nums">
                        {isAr ? toArabicDigits(fmt(p, isAr)) : fmt(p, isAr)}
                      </td>
                      <td className="py-3 text-sm text-ink font-semibold text-end tabular-nums">
                        {isAr ? toArabicDigits(fmt(tot, isAr)) : fmt(tot, isAr)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-full sm:w-72">
                <div className="flex justify-between py-1.5 text-sm text-ink">
                  <span>{isAr ? "الإجمالي قبل الضريبة" : "Subtotal"}</span>
                  <span className="tabular-nums font-semibold">
                    {isAr ? toArabicDigits(fmt(totals.subtotal, isAr)) : fmt(totals.subtotal, isAr)}{" "}
                    {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 text-sm text-ink">
                  <span>
                    {isAr
                      ? `الضريبة (${toArabicDigits(vatRate)}%)`
                      : `VAT (${vatRate}%)`}
                  </span>
                  <span className="tabular-nums font-semibold">
                    {isAr ? toArabicDigits(fmt(totals.vat, isAr)) : fmt(totals.vat, isAr)}{" "}
                    {currencySymbol}
                  </span>
                </div>
                <div className="border-t-2 border-navy mt-2 pt-2 flex justify-between">
                  <span className="font-display font-bold text-ink">
                    {isAr ? "الإجمالي" : "Grand total"}
                  </span>
                  <span className="font-display font-bold text-terracotta tabular-nums text-lg">
                    {isAr ? toArabicDigits(fmt(totals.grand, isAr)) : fmt(totals.grand, isAr)}{" "}
                    {currencySymbol}
                  </span>
                </div>
                {currency === "EGP" && totals.grand > 0 && (
                  <p className="mt-3 text-[11px] text-ink-soft/70 italic">
                    ({grandInWords})
                  </p>
                )}
              </div>
            </div>

            {notes && (
              <div className="pt-4 border-t border-bone">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 font-semibold mb-1">
                  {isAr ? "ملاحظات" : "Notes"}
                </p>
                <p className="text-sm text-ink-soft/85 whitespace-pre-line">{notes}</p>
              </div>
            )}

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/40 text-center">
              {isAr ? "أُنشئت بـ " : "Generated with "}
              <span className="text-terracotta">numueg.app/tools/invoice</span>
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="no-print mt-12 bg-navy rounded-[14px] p-6 sm:p-8 text-center">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-cream tracking-tight mb-2">
            {isAr
              ? "نُمُو بيعمل فواتير ETA تلقائي على كل أوردر."
              : "numu generates ETA e-invoices automatically on every order."}
          </h2>
          <p className="prose-body-sm text-cream/75 max-w-xl mx-auto mb-5">
            {isAr
              ? "مش فاتورة على ورق — فاتورة إلكترونية مُسلّمة لمصلحة الضرائب."
              : "Not a PDF — a digitally submitted e-invoice to the Egyptian Tax Authority."}
          </p>
          <Link
            to="/?demo=1"
            className="group inline-flex items-center justify-center gap-2 bg-cream text-navy font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu"
          >
            <span>{isAr ? "جرّب الأتمتة" : "Try automated invoicing"}</span>
            <span
              aria-hidden="true"
              className="text-lg text-terracotta group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Input: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}> = ({ label, value, onChange, placeholder, type = "text", className = "" }) => (
  <div className={className}>
    <label className="block font-display text-sm font-semibold text-ink mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 px-3 bg-cream border border-ink/15 rounded-[4px] font-display text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
    />
  </div>
);

export default Tool;
