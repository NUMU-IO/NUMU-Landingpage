import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Waitlist page — redirects to home page and scrolls to the waitlist section.
 * Preserves ?ref= query param for referral tracking.
 */
const Waitlist: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    // Redirect to home page with scrollTo state (and ref param preserved in URL)
    navigate(ref ? `/?ref=${ref}` : '/', {
      replace: true,
      state: { scrollTo: 'waitlist' },
    });
  }, [navigate, searchParams]);

  return null;
};

export default Waitlist;
