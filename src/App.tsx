
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { NotificationsProvider } from "@/components/notifications/NotificationsProvider";
import { UIToaster } from "@/components/ui/sonner";
import { Toaster } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { NetworkStatus } from "@/components/NetworkStatus";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { HelmetProvider } from "react-helmet-async";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { WebPushNotification } from "@/components/notifications/WebPushNotification";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { DesignToggle } from "@/components/DesignToggle";
import { shouldUseNewDesign } from "@/lib/designUtils";

// Pages
import Index from "@/pages/Index";
import HomeNew from "@/pages/HomeNew"; // Ajout de la nouvelle page
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
import { AdminDashboard } from "@/pages/admin/Dashboard";
import ArticlesPage from "@/pages/admin/articles/ArticlesPage";
import CategoriesPage from "@/pages/admin/categories/CategoriesPage";
import MediasPage from "@/pages/admin/medias/MediasPage";
import MenusPage from "@/pages/admin/menus/MenusPage";
import SettingsPage from "@/pages/admin/settings/SettingsPage";
import UserManagement from "@/pages/admin/UserManagement";
import { useAuth } from "@/hooks/useAuth";

// Chat Pal Script Integration
const ChatPalScript = () => {
  React.useEffect(() => {
    // Supprimer l'instance précédente si elle existe
    if (window.chatPal) {
      try {
        window.chatPal.destroy();
      } catch (err) {
        console.log("No instance to destroy");
      }
    }
    
    // Initialiser ChatPal
    window.chatPal = new window.ChatPal({
      embedId: 'v8HfNRZjDyZ3',
      remoteBaseUrl: 'https://chatappdemo.com/',
      version: '8.3'
    });

    return () => {
      // Nettoyer lors du démontage du composant
      if (window.chatPal) {
        try {
          window.chatPal.destroy();
        } catch (err) {
          console.log("Error destroying ChatPal instance:", err);
        }
      }
    };
  }, []);

  return null;
};

const App = () => {
  const { user, isAuthenticated } = useAuth();
  const useNewNavigation = shouldUseNewDesign('navigation');
  
  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <NotificationsProvider>
            <ImpersonationBanner />
            <NetworkStatus />
            <MainNav useNewDesign={useNewNavigation} />
            
            <Routes>
              {/* Public routes accessible to all users */}
              <Route path="/" element={<Index />} />
              <Route path="/home-new" element={<HomeNew />} /> {/* Nouvelle route pour tester */}
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
            
            <Footer />
            <WebPushNotification />
            <ChatContainer />
            <ChatPalScript />
            <UIToaster />
            <Toaster position="bottom-right" richColors />
            <PerformanceMonitor />
            
            {/* Afficher le toggle de design uniquement en environnement de développement */}
            {process.env.NODE_ENV !== 'production' && <DesignToggle />}
          </NotificationsProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
