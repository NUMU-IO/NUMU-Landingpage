import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, matchPath, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { SignupModalProvider } from './contexts/SignupModalContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import SignupModal from './components/SignupModal';
import SignupRedirect from './components/SignupRedirect';
import SignupUrlTrigger from './components/SignupUrlTrigger';
import ScrollToTop from './components/ScrollToTop';
import { captureAttribution } from './lib/attribution';

/* GOOGLE_CLIENT_ID moved to components/GoogleAuthScope.tsx.
   Google Identity Services used to be mounted here, at the app root, which
   fetched 99 KiB of third-party script and set nine Google cookies on every
   page view — including for visitors who never went near sign-in. It now
   mounts inside the two surfaces that render a Google button. */

type PageModule = { default: React.ComponentType };

/**
 * A lazy route that can also be loaded ahead of its first render.
 *
 * `lazy` always suspends once, even when the chunk is already in memory, so a
 * prerendered page was replaced by the Suspense spinner for a moment on every
 * visit. A route that was preloaded renders its real component directly.
 */
function page(load: () => Promise<PageModule>) {
  const Lazy = lazy(load);
  let Loaded: React.ComponentType | undefined;
  const Page = () => {
    // Fixed for the life of this mount, so a later preload cannot swap the
    // component type underneath a page that is already on screen.
    const Component = useRef(Loaded ?? Lazy).current;
    return <Component />;
  };
  Page.preload = () =>
    load().then((m) => {
      Loaded = m.default;
    });
  return Page;
}

const Home = page(() => import('./pages/Home'));
const AuthLayout = page(() => import('./pages/AuthLayout'));
const VerifyEmail = page(() => import('./pages/VerifyEmail'));
const Waitlist = page(() => import('./pages/Waitlist'));
const Pricing = page(() => import('./pages/Pricing'));
const Privacy = page(() => import('./pages/Privacy'));
const Terms = page(() => import('./pages/Terms'));
const DataDeletion = page(() => import('./pages/DataDeletion'));
const Contact = page(() => import('./pages/Contact'));
const Refund = page(() => import('./pages/Refund'));
const Apps = page(() => import('./pages/Apps'));
const Developers = page(() => import('./pages/Developers'));
const Themes = page(() => import('./pages/Themes'));
const Tools = page(() => import('./pages/Tools'));
const ToolStoreNames = page(() => import('./pages/tools/StoreNameGenerator'));
const ToolProfitMargin = page(() => import('./pages/tools/ProfitMarginCalculator'));
const ToolInvoice = page(() => import('./pages/tools/InvoiceGenerator'));
const ToolAIDescription = page(() => import('./pages/tools/AIDescription'));
const ToolVat = page(() => import('./pages/tools/VatCalculator'));
const ToolCod = page(() => import('./pages/tools/CodCalculator'));
const Learn = page(() => import('./pages/Learn'));
const Stores = page(() => import('./pages/Stores'));
const Partners = page(() => import('./pages/Partners'));
const NotFound = page(() => import('./pages/NotFound'));

/* Secondary pages introduced by the v1 redesign — `pages/other-pages.md`. */
const Features = page(() => import('./pages/Features'));
const IntegrationsPage = page(() => import('./pages/IntegrationsPage'));
const ProductTour = page(() => import('./pages/ProductTour'));
const TrustNetworkPage = page(() => import('./pages/TrustNetworkPage'));
const Support = page(() => import('./pages/Support'));
const About = page(() => import('./pages/About'));
const Resources = page(() => import('./pages/Resources'));
const Facts = page(() => import('./pages/Facts'));
const LearnArticle = page(() => import('./pages/LearnArticle'));
const Blog = page(() => import('./pages/Blog'));
const BlogPost = page(() => import('./pages/BlogPost'));
const IntegrationDetail = page(() => import('./pages/IntegrationDetail'));
const ComparisonPage = page(() => import('./pages/ComparisonPage'));

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
  ['blog', Blog],
  ['blog/:slug', BlogPost],
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
  ['partners', Partners],
  ['partners/:id', Partners],
] as const;

/**
 * Load the code for the page at `pathname` before React first renders, so the
 * prerendered HTML stays on screen until the same page can be painted over it.
 * Resolves straight away for paths that are not one of the content routes.
 */
export function preloadRoute(pathname: string): Promise<void> {
  const path = pathname.replace(/^\/(ar|en)(?=\/|$)/, '').replace(/\/+$/, '') || '/';
  const hit = routeComponents.find(([pattern]) => matchPath(`/${pattern}`, path));
  return hit ? hit[1].preload() : Promise.resolve();
}

const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'https://merchant.numueg.app';

/**
 * Login and password reset live on the merchant hub only: one implementation,
 * and the only one that handles two-factor sign-in. Landing links to /login
 * keep working and arrive in the visitor's language.
 */
const HubAuthRedirect: React.FC<{ path: 'login' | 'forgot-password' }> = ({ path }) => {
  const { language } = useLanguage();
  useEffect(() => {
    window.location.replace(`${DASHBOARD_URL}/${path}?lang=${language}`);
  }, [path, language]);
  return <LoadingFallback />;
};

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
        <ScrollToTop />
        <SignupModalProvider>
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
              <Route key={`${locale}-login`} path={`/${locale}/login`} element={<HubAuthRedirect path="login" />} />,
              <Route key={`${locale}-forgot`} path={`/${locale}/forgot-password`} element={<HubAuthRedirect path="forgot-password" />} />,
              <Route key={`${locale}-auth`} element={<AuthLayout />}>
                <Route path={`/${locale}/verify-email`} element={<VerifyEmail />} />
              </Route>,
              <Route key={`${locale}-waitlist`} path={`/${locale}/waitlist`} element={<Waitlist />} />,
            ])}
            <Route path="*" element={<LegacyLocaleRedirect />} />
          </Routes>
        </Suspense>
        {/* Global modal — rendered once at root so any CTA can open it */}
        <SignupUrlTrigger />
        <SignupModal />
        <Analytics />
        </SignupModalProvider>
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
