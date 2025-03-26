import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from '@/components/IntlProvider';
import { NotificationsProvider } from '@mantine/notifications';
import ErrorBoundary from '@/components/ErrorBoundary';
import Index from '@/pages/Index';
import Contact from '@/pages/Contact';
import Devis from '@/pages/Devis';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import Article from '@/pages/Article';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import Dashboard from '@/pages/Dashboard';
import { PredictiveAssistant } from "@/components/chat/PredictiveAssistant";
import { PredictiveAnalyticsDisplay } from "@/components/PredictiveAnalyticsDisplay";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="top-center-theme">
      <HelmetProvider>
        <IntlProvider>
          <NotificationsProvider>
            <ErrorBoundary>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/devis" element={<Devis />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/article/:id" element={<Article />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/predictive-analytics" element={<PredictiveAnalyticsDisplay />} />
                </Routes>
                <ScrollToTop />
                <ScrollToTopButton />
                <PredictiveAssistant />
              </BrowserRouter>
            </ErrorBoundary>
          </NotificationsProvider>
        </IntlProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
