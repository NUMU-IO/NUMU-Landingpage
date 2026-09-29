import { useEffect, useState } from 'react';
import { DEFAULT_TRIAL_DAYS } from './trialInfo';

export interface PublicPlanFeature {
  en: string;
  ar: string;
}

export interface PublicPlan {
  key: string;
  name_en: string;
  name_ar: string;
  price_monthly: number;
  price_annual: number;
  currency: string;
  cta: string;
  popular: boolean;
  commission_percent?: number;
  features: PublicPlanFeature[];
}

const UNLIMITED = { en: 'Unlimited orders', ar: 'أوردرات بلا حدود' };
const COMMERCIAL = new Set(['starter', 'pro', 'enterprise', 'payg']);
const isOrderFeature = (feature: PublicPlanFeature) =>
  /orders?/i.test(feature.en) || /أوردر|اوردر|طلب/.test(feature.ar);

/** Keep stale admin marketing JSON from contradicting enforced paid-plan limits. */
export const normalizePublicPlans = (plans: PublicPlan[]): PublicPlan[] =>
  plans.map((plan) => {
    if (plan.key === 'trial') {
      return {
        ...plan,
        name_en: `${DEFAULT_TRIAL_DAYS}-Day Free Trial`,
        name_ar: `تجربة مجانية ${DEFAULT_TRIAL_DAYS} يوم`,
      };
    }
    if (!COMMERCIAL.has(plan.key)) return plan;
    return { ...plan, features: [UNLIMITED, ...plan.features.filter((f) => !isOrderFeature(f))] };
  });

export interface PricingPromo {
  code: string;
  text_ar: string;
  text_en: string;
}

export interface PricingData {
  plans: PublicPlan[];
  promo?: PricingPromo | null;
  trial?: { enabled: boolean; days: number; visible: boolean };
}

const API_URL = import.meta.env.VITE_API_URL || 'https://numueg.app/api/v1';

const shape = (data: unknown): PricingData | null => {
  const d = data as PricingData | null;
  return d && Array.isArray(d.plans) ? { ...d, plans: normalizePublicPlans(d.plans) } : null;
};

/** The payload `scripts/prerender.mjs` bakes into every page that shows plans. */
const readSnapshot = (): PricingData | null => {
  if (typeof document === 'undefined') return null;
  try {
    return shape(JSON.parse(document.getElementById('numu-pricing')?.textContent ?? 'null'));
  } catch {
    return null;
  }
};

let request: Promise<PricingData | null> | null = null;

/** One request per page load, shared by every pricing surface. */
export const loadPricing = () =>
  (request ??= fetch(`${API_URL}/public/pricing-plans`, { credentials: 'include' })
    .then((r) => r.json())
    .then((json) => shape(json?.data))
    .catch(() => null));

/**
 * Plans for any pricing surface. Starts from the prerendered snapshot, so the
 * cards are on screen at first paint and survive a failed request; the live
 * endpoint then replaces them with whatever the admin set today.
 */
export function usePricing(): PricingData | null {
  const [data, setData] = useState<PricingData | null>(readSnapshot);
  useEffect(() => {
    let alive = true;
    void loadPricing().then((d) => {
      if (alive && d) setData(d);
    });
    return () => {
      alive = false;
    };
  }, []);
  return data;
}
