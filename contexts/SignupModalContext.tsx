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
 */
export type PlanIntent = 'payg' | 'starter' | 'pro' | null;

interface SignupModalState {
  isOpen: boolean;
  planIntent: PlanIntent;
  open: (plan?: PlanIntent) => void;
  close: () => void;
}

const SignupModalContext = createContext<SignupModalState | undefined>(undefined);

export const SignupModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [planIntent, setPlanIntent] = useState<PlanIntent>(null);

  const open = useCallback((plan: PlanIntent = null) => {
    setPlanIntent(plan);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <SignupModalContext.Provider value={{ isOpen, planIntent, open, close }}>
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
