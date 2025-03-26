
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/providers/ThemeProvider";
import { HelmetProvider } from 'react-helmet-async';
import IntlProviderWrapper from '@/components/IntlProvider';
import { Toaster } from "sonner";
import ErrorBoundary from '@/components/ErrorBoundary';
import Index from '@/pages/Index';
import Contact from '@/pages/Contact';
import Devis from '@/pages/Devis';
import About from '@/pages/About';
import Dashboard from '@/pages/Dashboard';
import { PredictiveAssistant } from "@/components/chat/PredictiveAssistant";
import { PredictiveAnalyticsDisplay } from "@/components/PredictiveAnalyticsDisplay";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="top-center-theme">
      <HelmetProvider>
        <IntlProviderWrapper>
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/devis" element={<Devis />} />
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/predictive-analytics" element={<PredictiveAnalyticsDisplay />} />
              </Routes>
              <PredictiveAssistant />
              <Toaster position="top-right" richColors />
            </BrowserRouter>
          </ErrorBoundary>
        </IntlProviderWrapper>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
