import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Signup modal — the landing's primary conversion path. Replaces the
 * private-beta waitlist: any visitor can create a real account directly
 * (Google one-click or email/password), the same registration flow a
 * merchant gets from the invite email. Kept deliberately separate from the
 * "Try a Demo" modal (which provisions a throwaway demo tenant).
 *
 * `planIntent` carries which pricing card the visitor clicked before
 * opening the modal ("payg" | "starter" | "pro"). It's sent to the
 * backend at registration: a payg intent auto-activates Pay as you Grow
 * when the store is created; paid intents are recorded for attribution.
 *
 * `referralCode` rides alongside it for the same reason and by the same
 * route. A referral link used to open the WAITLIST modal, so someone
 * following a merchant's link landed on a private-beta form instead of
 * creating the account they were invited to make — and the code was lost
 * either way, because /signup redirected without its query string.
 */
export type PlanIntent = 'payg' | 'starter' | 'pro' | null;

interface SignupModalState {
  isOpen: boolean;
  planIntent: PlanIntent;
  referralCode: string | null;
  open: (plan?: PlanIntent, referralCode?: string | null) => void;
  close: () => void;
}

const SignupModalContext = createContext<SignupModalState | undefined>(undefined);

export const SignupModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [planIntent, setPlanIntent] = useState<PlanIntent>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const open = useCallback((plan: PlanIntent = null, ref: string | null = null) => {
    setPlanIntent(plan);
    // Only overwrite when a code is supplied: a visitor who arrives on a
    // referral link, closes the modal and later clicks a pricing card is
    // still that merchant's referral.
    if (ref) setReferralCode(ref);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <SignupModalContext.Provider
      value={{ isOpen, planIntent, referralCode, open, close }}
    >
      {children}
    </SignupModalContext.Provider>
  );
};

export const useSignupModal = (): SignupModalState => {
  const ctx = useContext(SignupModalContext);
  if (!ctx) {
    throw new Error('useSignupModal must be used inside <SignupModalProvider>');
  }
  return ctx;
};
