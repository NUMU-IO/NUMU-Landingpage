import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ContactVariant = 'email' | 'call';

interface ContactModalState {
  isOpen: boolean;
  variant: ContactVariant;
  open: (variant: ContactVariant) => void;
  close: () => void;
}

const ContactModalContext = createContext<ContactModalState | undefined>(undefined);

export const ContactModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<ContactVariant>('email');

  const open = useCallback((v: ContactVariant) => {
    setVariant(v);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ContactModalContext.Provider value={{ isOpen, variant, open, close }}>
      {children}
    </ContactModalContext.Provider>
  );
};

export const useContactModal = (): ContactModalState => {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error(
      'useContactModal must be used inside <ContactModalProvider>',
    );
  }
  return ctx;
};
