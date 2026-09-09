import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

/**
 * `/signup` → home with the sign-up modal open, carrying the query string.
 *
 * This replaced `<Navigate to="/?signup=1" replace />`, which discarded
 * everything after the path. Referral links are `numueg.app/signup?ref=CODE`,
 * so every merchant who followed one arrived with the code already thrown
 * away — the referrer was never credited, and the "Referred Merchants" list
 * stayed empty no matter how many people signed up through it.
 *
 * Forwards the whole query rather than only `ref`: the same URL shape carries
 * `plan` from pricing and the UTM parameters attribution reads, and a
 * redirect that keeps one parameter is the same bug waiting for the next one.
 */
const SignupRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  params.set('signup', '1');
  return <Navigate to={`/?${params.toString()}`} replace />;
};

export default SignupRedirect;
