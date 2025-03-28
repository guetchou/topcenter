
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageLoader from "@/components/PageLoader";
import { ScrollToTop } from './components/ScrollToTop';
import DeploymentDashboard from "./pages/DeploymentDashboard";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/deploy" element={<DeploymentDashboard />} />
          <Route path="*" element={<DeploymentDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
