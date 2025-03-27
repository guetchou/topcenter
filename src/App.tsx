import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import PageLoader from "@/components/PageLoader";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import AdminDashboard from "./pages/AdminDashboard";
import DatabaseExplorer from "./pages/DatabaseExplorer";
import PocketBaseTest from './pages/PocketBaseTest';
import ARViewer from './pages/ARViewer';
import ServicePage from './pages/ServicePage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import NotFoundPage from './pages/NotFoundPage';
import ComingSoonPage from './pages/ComingSoonPage';
import { AuthRoute } from './components/AuthRoute';
import { AdminRoute } from './components/AdminRoute';
import { useAuth } from './hooks/useAuth';
import { ScrollToTop } from './components/ScrollToTop';
import { DocsPage } from './pages/DocsPage';
import DeploymentDashboard from "./pages/DeploymentDashboard";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <SiteHeader />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/account" element={
            <AuthRoute>
              <AccountPage />
            </AuthRoute>
          } />
          
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/db-explorer" element={
            <AdminRoute>
              <DatabaseExplorer />
            </AdminRoute>
          } />
          
          <Route path="/pbtest" element={<PocketBaseTest />} />
          <Route path="/ar" element={<ARViewer />} />
          <Route path="/service/:slug" element={<ServicePage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/docs/:slug" element={<DocsPage />} />
          <Route path="/deploy" element={<DeploymentDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <SiteFooter />
    </Router>
  );
}

export default App;
