
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Toaster } from "sonner";
import { NotificationsProvider } from "@/components/notifications/NotificationsProvider";
import { Toaster as UIToaster } from "@/components/ui/sonner";
import { AIChatAssistant } from "@/components/AIChatAssistant";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { NetworkStatus } from "@/components/NetworkStatus";

// Routes
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Support from "@/pages/Support";
import Devis from "@/pages/Devis";
import NotFound from "@/pages/NotFound";
import BlogIndex from "@/pages/blog/Index";
import BlogPost from "@/pages/blog/BlogPost";
import RecruitmentIndex from "@/pages/recruitment/Index";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import ResetPassword from "@/pages/auth/ResetPassword";
import ClientPortal from "@/pages/ClientPortal";
import AuthCallback from "@/components/auth/AuthCallback";

// Admin
import { CMSLayout } from "@/pages/admin/CMSLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import ArticlesPage from "@/pages/admin/articles/ArticlesPage";
import CategoriesPage from "@/pages/admin/categories/CategoriesPage";
import MediasPage from "@/pages/admin/medias/MediasPage";
import MenusPage from "@/pages/admin/menus/MenusPage";
import SettingsPage from "@/pages/admin/settings/SettingsPage";
import UserManagement from "@/pages/admin/UserManagement";
import { useAuth } from "@/hooks/useAuth";

import { WebPushNotification } from "@/components/notifications/WebPushNotification";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { LiveChat } from "@/components/LiveChat";
import { ElegantNotification } from "@/components/notifications/ElegantNotification";
import { AIChatBubble } from "@/components/AIChatBubble";

// Ajouter le script ChatterPal
const ChatterPalScript = () => {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://chatterpal.me/build/js/embed.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

const App = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider>
          <ImpersonationBanner />
          <NetworkStatus />
          
          <Routes>
            {/* Public routes accessible to all users */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
            <Route path="/devis" element={<Devis />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/recruitment" element={<RecruitmentIndex />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected client routes */}
            <Route path="/client" element={
              <ProtectedRoute>
                <ClientPortal />
              </ProtectedRoute>
            } />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <CMSLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<ArticlesPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="medias" element={<MediasPage />} />
              <Route path="menus" element={<MenusPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <WebPushNotification />
          <AIChatAssistant />
          <ChatContainer />
          <LiveChat />
          <ChatterPalScript />
          <AIChatBubble />
          <UIToaster />
          <Toaster position="bottom-right" richColors />
          <PerformanceMonitor />
        </NotificationsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
