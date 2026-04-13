import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { LandingConfigProvider } from './contexts/LandingConfigContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ErrorBoundary } from './components/ErrorBoundary';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const Home = lazy(() => import('./pages/Home'));
const AuthLayout = lazy(() => import('./pages/AuthLayout'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Login = lazy(() => import('./pages/Login'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Waitlist = lazy(() => import('./pages/Waitlist'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));
const Refund = lazy(() => import('./pages/Refund'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <LanguageProvider>
      <LandingConfigProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<AuthLayout />}>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Route>
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/refund" element={<Refund />} />
          </Routes>
        </Suspense>
      </Router>
    </LandingConfigProvider>
    </LanguageProvider>
    </GoogleOAuthProvider>
    </ErrorBoundary>
  );
};

export default App;