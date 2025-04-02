
import React, { Suspense, ComponentType } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageLoader from "@/components/PageLoader";
import { ScrollToTop } from './components/ScrollToTop';
import { Footer } from './components/Footer';
import ResponsiveNavigation from './components/ResponsiveNavigation';
import ErrorBoundary from './components/ErrorBoundary';
import { ChatPalGlobalInitializer } from './components/chat/ChatPalGlobalInitializer';

// Correctly typed lazy loading with proper handling of default exports
const DeploymentDashboard = React.lazy(() => 
  import('./pages/DeploymentDashboard').then(module => ({ 
    default: module.default as ComponentType<any> 
  }))
);

const Index = React.lazy(() => 
  import('./pages/Index').then(module => ({ 
    default: module.default as ComponentType<any> 
  }))
);

const AdminRoutes = React.lazy(() => 
  import('./components/routes/AdminRoutes').then(module => ({ 
    default: module.default as ComponentType<any> 
  }))
);

const Contact = React.lazy(() => 
  import('./pages/Contact').then(module => ({ 
    default: module.default as ComponentType<any> 
  }))
);

function NewApp() {
  return (
    <Router>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <ChatPalGlobalInitializer />
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
            <Route path="/contact" element={
              <>
                <ResponsiveNavigation />
                <Contact />
                <Footer />
              </>
            } />
            <Route path="/" element={<Index />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default NewApp;
