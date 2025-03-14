
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Toaster } from "sonner";
import { NotificationsProvider } from "@/components/notifications/NotificationsProvider";
import { Toaster as UIToaster } from "@/components/ui/sonner";
import { AIChatAssistant } from "@/components/AIChatAssistant";

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

// Admin
import { CMSLayout } from "@/pages/admin/CMSLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import ArticlesPage from "@/pages/admin/articles/ArticlesPage";
import CategoriesPage from "@/pages/admin/categories/CategoriesPage";
import MediasPage from "@/pages/admin/medias/MediasPage";
import MenusPage from "@/pages/admin/menus/MenusPage";
import SettingsPage from "@/pages/admin/settings/SettingsPage";
import UserManagement from "@/pages/admin/UserManagement";
import { AuthProvider } from "@/contexts/AuthContext";

import { WebPushNotification } from "@/components/notifications/WebPushNotification";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationsProvider>
            <Router>
              <ImpersonationBanner />
              <Routes>
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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Auth routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<CMSLayout />}>
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
              <UIToaster />
              <Toaster position="bottom-right" richColors />
              <PerformanceMonitor />
            </Router>
          </NotificationsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
