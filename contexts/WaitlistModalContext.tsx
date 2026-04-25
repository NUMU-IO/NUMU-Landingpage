import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface WaitlistModalState {
  isOpen: boolean;
  incomingRef: string;
  open: (ref?: string) => void;
  close: () => void;
}

const WaitlistModalContext = createContext<WaitlistModalState | undefined>(undefined);

export const WaitlistModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [incomingRef, setIncomingRef] = useState('');

  const open = useCallback((ref?: string) => {
    if (ref) setIncomingRef(ref);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <WaitlistModalContext.Provider value={{ isOpen, incomingRef, open, close }}>
      {children}
    </WaitlistModalContext.Provider>
  );
};

export const useWaitlistModal = (): WaitlistModalState => {
  const ctx = useContext(WaitlistModalContext);
  if (!ctx) {
    throw new Error(
      'useWaitlistModal must be used inside <WaitlistModalProvider>',
    );
  }
  return ctx;
};
