import React from "react";

/**
 * ThemePreview — renders a miniature storefront mockup for a given theme
 * spec. Used on /themes to give visitors a visual sense of each industry
 * template without loading real image assets. Everything is SVG + CSS, so
 * it ships with zero network cost.
 *
 * The palette maps to brand-kit accents but each theme picks its own
 * surface + accent combo to feel industry-appropriate.
 */

export interface ThemeSpec {
  slug: string;
  name_en: string;
  name_ar: string;
  industry_en: string;
  industry_ar: string;
  /** Hex or tailwind-compatible color tokens — used inline via style. */
  palette: {
    surface: string;
    ink: string;
    accent: string;
    accentSoft: string;
    muted: string;
  };
  /** Brand name that appears in the nav of the mini storefront. */
  brand_en: string;
  brand_ar: string;
  /** Hero headline rendered inside the mockup. */
  heroLead_en: string;
  heroLead_ar: string;
  heroSub_en: string;
  heroSub_ar: string;
  /** 4 sample products shown in the grid. Price is raw number (EGP). */
  products: {
    name_en: string;
    name_ar: string;
    price: number;
    /** Optional hex for the product card swatch background. Falls back
     *  to a tinted accent if omitted. */
    swatch?: string;
    /** Optional abstract glyph class — we render a simple shape per product. */
    shape?: "pill" | "circle" | "square" | "diamond" | "arch" | "bottle";
  }[];
  /** Display direction for the mini storefront (rtl/ltr). */
  dir: "rtl" | "ltr";
}

const ProductShape: React.FC<{
  shape?: ThemeSpec["products"][number]["shape"];
  color: string;
}> = ({ shape = "square", color }) => {
  switch (shape) {
    case "circle":
      return <circle cx="24" cy="24" r="16" fill={color} />;
    case "pill":
      return <rect x="8" y="14" width="32" height="20" rx="10" fill={color} />;
    case "diamond":
      return <path d="M24 6 L42 24 L24 42 L6 24 Z" fill={color} />;
    case "arch":
      return (
        <path
          d="M8 36 L8 22 A16 16 0 0 1 40 22 L40 36 Z"
          fill={color}
        />
      );
    case "bottle":
      return (
        <g fill={color}>
          <rect x="20" y="6" width="8" height="6" rx="1" />
          <path d="M14 18 Q14 12 20 12 L28 12 Q34 12 34 18 L34 40 Q34 42 32 42 L16 42 Q14 42 14 40 Z" />
        </g>
      );
    case "square":
    default:
      return <rect x="8" y="8" width="32" height="32" rx="4" fill={color} />;
  }
};

const fmtPrice = (n: number, isAr: boolean): string => {
  const str = n.toLocaleString(isAr ? "ar-EG" : "en-US");
  return `${str} ${isAr ? "ج.م" : "EGP"}`;
};

interface Props {
  theme: ThemeSpec;
  isAr: boolean;
  /** Small variant used in grid; full variant fills the width in a modal. */
  size?: "sm" | "md";
}

const ThemePreview: React.FC<Props> = ({ theme, isAr, size = "md" }) => {
  const { palette, dir, products } = theme;
  const brand = isAr ? theme.brand_ar : theme.brand_en;
  const heroLead = isAr ? theme.heroLead_ar : theme.heroLead_en;
  const heroSub = isAr ? theme.heroSub_ar : theme.heroSub_en;

  return (
    <div
      className={`relative rounded-[8px] overflow-hidden ${size === "sm" ? "text-[10px]" : "text-[11px]"}`}
      style={{
        background: palette.surface,
        color: palette.ink,
        direction: dir,
      }}
      aria-hidden="true"
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: palette.muted }}
      >
        <span
          className="font-bold tracking-tight"
          style={{ fontSize: size === "sm" ? "0.65rem" : "0.75rem" }}
        >
          {brand}
        </span>
        <div className="flex items-center gap-2 opacity-70">
          <span style={{ fontSize: size === "sm" ? "0.55rem" : "0.65rem" }}>
            {isAr ? "متجر · منتجات · تواصل" : "shop · products · contact"}
          </span>
          <span
            className="size-3 rounded-full"
            style={{ background: palette.accent, opacity: 0.9 }}
          />
        </div>
      </div>

      {/* Hero band */}
      <div
        className="px-3 py-3 flex items-center gap-3"
        style={{ background: palette.accentSoft }}
      >
        <div className="flex-1 min-w-0">
          <p
            className="font-bold tracking-tight leading-tight"
            style={{
              fontSize: size === "sm" ? "0.75rem" : "0.9rem",
              color: palette.ink,
            }}
          >
            {heroLead}
          </p>
          <p
            className="opacity-70 leading-snug mt-0.5"
            style={{ fontSize: size === "sm" ? "0.55rem" : "0.65rem" }}
          >
            {heroSub}
          </p>
        </div>
        <div
          className="shrink-0 rounded-full flex items-center justify-center"
          style={{
            width: size === "sm" ? 32 : 42,
            height: size === "sm" ? 32 : 42,
            background: palette.accent,
            color: palette.surface,
            fontSize: size === "sm" ? "0.55rem" : "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          {isAr ? "تسوّق" : "SHOP"}
        </div>
      </div>

      {/* Product grid */}
      <div
        className="grid grid-cols-4 gap-1.5 p-2.5"
        style={{ background: palette.surface }}
      >
        {products.slice(0, 4).map((p, i) => (
          <div
            key={i}
            className="flex flex-col"
            style={{ fontSize: size === "sm" ? "0.55rem" : "0.65rem" }}
          >
            <div
              className="rounded-[4px] flex items-center justify-center mb-1"
              style={{
                background: p.swatch || palette.accentSoft,
                aspectRatio: "1 / 1",
              }}
            >
              <svg viewBox="0 0 48 48" className="w-2/3 h-2/3">
                <ProductShape shape={p.shape} color={palette.accent} />
              </svg>
            </div>
            <span
              className="truncate leading-tight"
              style={{ color: palette.ink, fontWeight: 600 }}
            >
              {isAr ? p.name_ar : p.name_en}
            </span>
            <span
              className="opacity-70 tabular-nums"
              style={{ fontSize: size === "sm" ? "0.5rem" : "0.6rem" }}
            >
              {fmtPrice(p.price, isAr)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer strip */}
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{
          borderTop: `1px solid ${palette.muted}`,
          background: palette.surface,
          fontSize: size === "sm" ? "0.5rem" : "0.6rem",
          opacity: 0.6,
        }}
      >
        <span>{isAr ? "شحن مجاني فوق ٥٠٠ ج.م" : "Free shipping over 500 EGP"}</span>
        <span>{isAr ? "بيموب · فوري · COD" : "Paymob · Fawry · COD"}</span>
      </div>
    </div>
  );
};

export default ThemePreview;
