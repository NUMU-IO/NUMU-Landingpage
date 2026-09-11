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
