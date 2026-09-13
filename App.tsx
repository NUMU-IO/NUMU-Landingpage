import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
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
import SignupUrlTrigger from './components/SignupUrlTrigger';
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
const Facts = lazy(() => import('./pages/Facts'));
const LearnArticle = lazy(() => import('./pages/LearnArticle'));
const IntegrationDetail = lazy(() => import('./pages/IntegrationDetail'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));

const LoadingFallback = () => (
  <div data-suspense-fallback className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
  </div>
);

const routeComponents = [
  ['', Home],
  ['pricing', Pricing],
  ['privacy', Privacy],
  ['terms', Terms],
  ['data-deletion', DataDeletion],
  ['contact', Contact],
  ['refund', Refund],
  ['apps', Apps],
  ['themes', Themes],
  ['developers', Developers],
  ['tools', Tools],
  ['tools/store-names', ToolStoreNames],
  ['tools/profit-margin', ToolProfitMargin],
  ['tools/invoice', ToolInvoice],
  ['tools/ai-description', ToolAIDescription],
  ['tools/vat', ToolVat],
  ['tools/cod', ToolCod],
  ['learn', Learn],
  ['learn/:slug', LearnArticle],
  ['features', Features],
  ['integrations', IntegrationsPage],
  ['integrations/:slug', IntegrationDetail],
  ['compare/:slug', ComparisonPage],
  ['product-tour', ProductTour],
  ['trust-network', TrustNetworkPage],
  ['support', Support],
  ['about', About],
  ['about/facts', Facts],
  ['resources', Resources],
  ['stores', Stores],
] as const;

const LegacyLocaleRedirect: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  if (/^\/(ar|en)(?:\/|$)/.test(location.pathname)) return <NotFound />;
  return (
    <Navigate
      replace
      to={`/${language}${location.pathname === '/' ? '' : location.pathname}${location.search}${location.hash}`}
    />
  );
};

const RoutedApp: React.FC = () => {
  // Remember where this visitor came from before any navigation strips
  // the UTMs off the URL. Idempotent, and the first source seen wins.
  useEffect(() => {
    captureAttribution();
  }, []);

  return (
    <ErrorBoundary>
    <LanguageProvider>
      <LandingConfigProvider>
        <ScrollToTop />
        <WaitlistModalProvider>
        <SignupModalProvider>
        <DemoModalProvider>
        <ContactModalProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {(['ar', 'en'] as const).flatMap((locale) =>
              routeComponents.map(([path, Component]) => (
                <Route
                  key={`${locale}/${path}`}
                  path={`/${locale}${path ? `/${path}` : ''}`}
                  element={<Component />}
                />
              )),
            )}
            {(['ar', 'en'] as const).flatMap((locale) => [
              <Route key={`${locale}-signup`} path={`/${locale}/signup`} element={<SignupRedirect />} />,
              <Route key={`${locale}-auth`} element={<AuthLayout />}>
                <Route path={`/${locale}/login`} element={<Login />} />
                <Route path={`/${locale}/verify-email`} element={<VerifyEmail />} />
              </Route>,
              <Route key={`${locale}-waitlist`} path={`/${locale}/waitlist`} element={<Waitlist />} />,
            ])}
            <Route path="*" element={<LegacyLocaleRedirect />} />
          </Routes>
        </Suspense>
        {/* Global modals — rendered once at root so any CTA can open them */}
        <SignupUrlTrigger />
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
    </LandingConfigProvider>
    </LanguageProvider>
    </ErrorBoundary>
  );
};

const App: React.FC = () => (
  <Router>
    <RoutedApp />
  </Router>
);

export default App;
