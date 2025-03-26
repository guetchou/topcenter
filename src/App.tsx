
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import Index from '@/pages/Index';
import Contact from '@/pages/Contact';
import Devis from '@/pages/Devis';
import About from '@/pages/About';
import Dashboard from '@/pages/Dashboard';
import DeployDashboard from '@/pages/DeployDashboard';
import DeploymentDashboard from '@/pages/DeploymentDashboard';
import { PredictiveAssistant } from "@/components/chat/PredictiveAssistant";
import { PredictiveAnalyticsDisplay } from "@/components/PredictiveAnalyticsDisplay";
import TeamPage from '@/pages/TeamPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/devis" element={<Devis />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deploy" element={<DeployDashboard />} />
          <Route path="/deployment" element={<DeploymentDashboard />} />
          <Route path="/predictive-analytics" element={<PredictiveAnalyticsDisplay />} />
          <Route path="/equipe" element={<TeamPage />} />
        </Routes>
        <PredictiveAssistant />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
