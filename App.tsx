import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { LandingConfigProvider } from './contexts/LandingConfigContext';
import { WaitlistModalProvider } from './contexts/WaitlistModalContext';
import { SignupModalProvider } from './contexts/SignupModalContext';
import { ContactModalProvider } from './contexts/ContactModalContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ErrorBoundary } from './components/ErrorBoundary';
import WaitlistModal from './components/WaitlistModal';
import SignupModal from './components/SignupModal';
import ContactModal from './components/ContactModal';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const Home = lazy(() => import('./pages/Home'));
const AuthLayout = lazy(() => import('./pages/AuthLayout'));
const Login = lazy(() => import('./pages/Login'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Waitlist = lazy(() => import('./pages/Waitlist'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const DataDeletion = lazy(() => import('./pages/DataDeletion'));
const Contact = lazy(() => import('./pages/Contact'));
const Refund = lazy(() => import('./pages/Refund'));
const Apps = lazy(() => import('./pages/Apps'));
const Developers = lazy(() => import('./pages/Developers'));
const Themes = lazy(() => import('./pages/Themes'));
const Tools = lazy(() => import('./pages/Tools'));
const ToolStoreNames = lazy(() => import('./pages/tools/StoreNameGenerator'));
const ToolProfitMargin = lazy(() => import('./pages/tools/ProfitMarginCalculator'));
const ToolInvoice = lazy(() => import('./pages/tools/InvoiceGenerator'));
const ToolAIDescription = lazy(() => import('./pages/tools/AIDescription'));
const Learn = lazy(() => import('./pages/Learn'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
        <WaitlistModalProvider>
        <SignupModalProvider>
        <ContactModalProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* /signup opens the direct sign-up modal on home (replaces the
                old private-beta waitlist). "Try a Demo" stays separate. */}
            <Route path="/signup" element={<Navigate to="/?signup=1" replace />} />
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Route>
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/data-deletion" element={<DataDeletion />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/themes" element={<Themes />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/store-names" element={<ToolStoreNames />} />
            <Route path="/tools/profit-margin" element={<ToolProfitMargin />} />
            <Route path="/tools/invoice" element={<ToolInvoice />} />
            <Route path="/tools/ai-description" element={<ToolAIDescription />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {/* Global modals — rendered once at root so any CTA can open them */}
        <SignupModal />
        <WaitlistModal />
        <ContactModal />
        </ContactModalProvider>
        </SignupModalProvider>
        </WaitlistModalProvider>
      </Router>
    </LandingConfigProvider>
    </LanguageProvider>
    </GoogleOAuthProvider>
    </ErrorBoundary>
  );
};

export default App;