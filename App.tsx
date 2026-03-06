import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { LandingConfigProvider } from './contexts/LandingConfigContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const AuthLayout = lazy(() => import('./pages/AuthLayout'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Login = lazy(() => import('./pages/Login'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
    <LanguageProvider>
      <LandingConfigProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<AuthLayout />}>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </LandingConfigProvider>
    </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;