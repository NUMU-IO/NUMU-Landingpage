import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSignupModal } from '../contexts/SignupModalContext';

/**
 * Opens the sign-up modal from the URL, from anywhere in the app.
 *
 * This used to live in `components/Hero.tsx`. The redesign replaced that hero
 * with `redesign/HeroSection` and nothing imports the old file any more, so
 * the handler stopped running — and with it every `?signup=1` entry point:
 * `/signup`, the pricing CTAs, the calculator pages' "start free" buttons, and
 * the referral links. They all changed the URL and then did nothing, which is
 * the worst failure shape available: no error, no modal, a visitor who thinks
 * the button is broken and leaves.
 *
 * Mounted next to `<SignupModal />` in App, so it is alive on every route and
 * cannot be orphaned by a page being redesigned again. It renders nothing.
 *
 * `?ref=CODE` opens the modal too: a referral link is an invitation to create
 * an account, and it used to open the private-beta WAITLIST instead — asking
 * an invited merchant to queue for access they had just been given.
 */
const SignupUrlTrigger: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { open } = useSignupModal();

  useEffect(() => {
    const ref = searchParams.get('ref');
    const wants = searchParams.get('signup') === '1' || Boolean(ref);
    if (!wants) return;

    open(null, ref);

    // `signup` is consumed — it has done its job and should not survive a
    // refresh. `ref` deliberately stays: the code is held in context now, but
    // a visitor who reloads, or shares the page they landed on, should still
    // be carrying the referral.
    if (searchParams.has('signup')) {
      const next = new URLSearchParams(searchParams);
      next.delete('signup');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, open]);

  return null;
};

export default SignupUrlTrigger;
