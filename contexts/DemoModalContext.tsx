import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Demo modal — the landing's secondary conversion path, opened by the fixed
 * `شاهد الديمو` CTA.
 *
 * `DemoStartModal` used to be mounted locally by whichever section needed it
 * (Hero, PricingSection), each with its own `useState`. The redesign fixes one
 * secondary CTA label used in several sections, so ownership moves to a single
 * provider and the modal is mounted once at the app root — the same shape
 * `SignupModalContext` already uses for the primary CTA.
 */
interface DemoModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DemoModalContext = createContext<DemoModalState | undefined>(undefined);

export const DemoModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <DemoModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </DemoModalContext.Provider>
  );
};

export const useDemoModal = (): DemoModalState => {
  const ctx = useContext(DemoModalContext);
  if (!ctx) {
    throw new Error('useDemoModal must be used inside <DemoModalProvider>');
  }
  return ctx;
};
