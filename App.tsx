import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { LandingConfigProvider } from './contexts/LandingConfigContext';
import { WaitlistModalProvider } from './contexts/WaitlistModalContext';
import { SignupModalProvider } from './contexts/SignupModalContext';
import { DemoModalProvider } from './contexts/DemoModalContext';
import { ContactModalProvider } from './contexts/ContactModalContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import WaitlistModal from './components/WaitlistModal';
import SignupModal from './components/SignupModal';
import SignupRedirect from './components/SignupRedirect';
import ContactModal from './components/ContactModal';
import GlobalDemoModal from './components/GlobalDemoModal';
import LiquidGlassDefs from './components/redesign/LiquidGlassDefs';
import ScrollToTop from './components/ScrollToTop';
import { captureAttribution } from './lib/attribution';

/* GOOGLE_CLIENT_ID moved to components/GoogleAuthScope.tsx.
   Google Identity Services used to be mounted here, at the app root, which
   fetched 99 KiB of third-party script and set nine Google cookies on every
   page view — including for visitors who never went near sign-in. It now
   mounts inside the three surfaces that render a Google button. */

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
const ToolVat = lazy(() => import('./pages/tools/VatCalculator'));
const ToolCod = lazy(() => import('./pages/tools/CodCalculator'));
const Learn = lazy(() => import('./pages/Learn'));
const Stores = lazy(() => import('./pages/Stores'));
const NotFound = lazy(() => import('./pages/NotFound'));

/* Secondary pages introduced by the v1 redesign — `pages/other-pages.md`. */
const Features = lazy(() => import('./pages/Features'));
const IntegrationsPage = lazy(() => import('./pages/IntegrationsPage'));
const ProductTour = lazy(() => import('./pages/ProductTour'));
const TrustNetworkPage = lazy(() => import('./pages/TrustNetworkPage'));
const Support = lazy(() => import('./pages/Support'));
const About = lazy(() => import('./pages/About'));
const Resources = lazy(() => import('./pages/Resources'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  // Remember where this visitor came from before any navigation strips
  // the UTMs off the URL. Idempotent, and the first source seen wins.
  useEffect(() => {
    captureAttribution();
  }, []);

  return (
    <ErrorBoundary>
    <LanguageProvider>
      <LandingConfigProvider>
      <Router>
        <ScrollToTop />
        <WaitlistModalProvider>
        <SignupModalProvider>
        <DemoModalProvider>
        <ContactModalProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* /signup opens the direct sign-up modal on home (replaces the
                old private-beta waitlist). "Try a Demo" stays separate. */}
            <Route path="/signup" element={<SignupRedirect />} />
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
            <Route path="/tools/vat" element={<ToolVat />} />
            <Route path="/tools/cod" element={<ToolCod />} />
            <Route path="/learn" element={<Learn />} />

            {/* v1 redesign secondary pages */}
            <Route path="/features" element={<Features />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/product-tour" element={<ProductTour />} />
            <Route path="/trust-network" element={<TrustNetworkPage />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />

            {/* Crawl entry point for merchant storefronts - see pages/Stores.tsx */}
            <Route path="/stores" element={<Stores />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {/* Global modals — rendered once at root so any CTA can open them */}
        <SignupModal />
        <WaitlistModal />
        <ContactModal />
        <GlobalDemoModal />
        <LiquidGlassDefs />
        <Analytics />
        </ContactModalProvider>
        </DemoModalProvider>
        </SignupModalProvider>
        </WaitlistModalProvider>
      </Router>
    </LandingConfigProvider>
    </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;