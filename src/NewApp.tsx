
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageLoader from "@/components/PageLoader";
import { ScrollToTop } from './components/ScrollToTop';
import { MainNav } from './components/MainNav';
import { Footer } from './components/Footer';
import ResponsiveNavigation from './components/ResponsiveNavigation';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for better performance
const DeploymentDashboard = React.lazy(() => import('./pages/DeploymentDashboard'));
const Index = React.lazy(() => import('./pages/Index'));
const AdminRoutes = React.lazy(() => import('./components/routes/AdminRoutes'));

function NewApp() {
  const handleError = (error: Error) => {
    console.error("Application error:", error);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/deploy" element={
              <>
                <ResponsiveNavigation />
                <DeploymentDashboard />
                <Footer />
              </>
            } />
            <Route path="/admin/*" element={
              <Suspense fallback={<PageLoader />}>
                <AdminRoutes />
              </Suspense>
            } />
            <Route path="/" element={
              <>
                <MainNav />
                <Index />
                <Footer />
              </>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default NewApp;
