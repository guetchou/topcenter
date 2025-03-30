
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageLoader from "@/components/PageLoader";
import { ScrollToTop } from './components/ScrollToTop';
import { MainNav } from './components/MainNav';
import { Footer } from './components/Footer';

// Lazy load pages for better performance
const DeploymentDashboard = React.lazy(() => import('./pages/DeploymentDashboard'));
const Index = React.lazy(() => import('./pages/Index'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/deploy" element={
            <>
              <MainNav />
              <DeploymentDashboard />
              <Footer />
            </>
          } />
          <Route path="/" element={<Index />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
