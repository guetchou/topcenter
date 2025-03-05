
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { Suspense, lazy } from "react";
import { DynamicNav } from "./components/nav/DynamicNav";
import { Footer } from "./components/Footer";
import { NetworkStatus } from "./components/NetworkStatus";
import { ScrollToTop } from "./components/ScrollToTop";
import { HeroSection } from "./components/sections/HeroSection";
import { AboutSection } from "./components/sections/AboutSection";
import { CallToActionSection } from "./components/sections/CallToActionSection";
import { PartnersSection } from "./components/sections/PartnersSection";
import { TeamSection } from "./components/sections/TeamSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { BlogSection } from "./components/sections/BlogSection";
import { ContactSection } from "./components/sections/ContactSection";
import { NewsletterSection } from "./components/sections/NewsletterSection";
import { LoyaltySection } from "./components/sections/LoyaltySection";
import { SocialMediaSection } from "./components/sections/SocialMediaSection";
import { WebPushNotification } from "./components/notifications/WebPushNotification";
import { AIChatBubble } from "./components/ChatBubble";
import { ImpersonationBanner } from "./components/ImpersonationBanner";
import { queryClient } from "./lib/react-query";
import { useAuth } from "./hooks/useAuth";
import { Spinner } from "./components/ui/spinner";

// Lazy-loaded components pour améliorer les performances
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const NewsAdmin = lazy(() => import("./pages/NewsAdmin"));
const News = lazy(() => import("./pages/News"));
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));
const Services = lazy(() => import("./pages/services/Services"));
const CallCenter = lazy(() => import("./pages/services/CallCenter"));
const OnlineSales = lazy(() => import("./pages/services/OnlineSales"));
const TelephonySystem = lazy(() => import("./pages/services/TelephonySystem"));
const Devis = lazy(() => import("./pages/Devis"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const NewPassword = lazy(() => import("./pages/auth/NewPassword"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const Recruitment = lazy(() => import("./pages/recruitment/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const FAQ = lazy(() => import("./pages/FAQ"));

// Composant pour le chargement pendant le lazy loading
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[70vh]">
    <Spinner size="lg" />
    <span className="ml-2 text-lg">Chargement...</span>
  </div>
);

function HomePage() {
  return (
    <main role="main" className="flex-1">
      <HeroSection />
      <AboutSection />
      <CallToActionSection />
      <PartnersSection />
      <TeamSection />
      <TestimonialsSection />
      <BlogSection />
      <SocialMediaSection />
      <NewsletterSection />
      <LoyaltySection />
      <ContactSection />
    </main>
  );
}

function App() {
  const intl = useIntl();
  const { checkUser, user, impersonatedUser } = useAuth();
  const location = useLocation();

  // Défiler vers le haut lors du changement de route
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    // Vérifier l'authentification au chargement
    checkUser();
  }, [checkUser]);

  // Déterminer quel utilisateur est actuellement actif (réel ou impersonifié)
  const activeUser = impersonatedUser || user;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <ImpersonationBanner />
        <DynamicNav />
        
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutSection />} />
            
            {/* Routes des services */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/call-center" element={<CallCenter />} />
            <Route path="/services/online-sales" element={<OnlineSales />} />
            <Route path="/services/telephony-system" element={<TelephonySystem />} />
            <Route path="/devis" element={<Devis />} />
            
            {/* Route de recrutement */}
            <Route path="/recruitment" element={<Recruitment />} />
            
            {/* Routes d'authentification */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/new-password" element={<NewPassword />} />
            
            {/* Routes du blog */}
            <Route path="/blog" element={<News />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<BlogPost />} />
            <Route path="/news-admin" element={<NewsAdmin />} />
            
            {/* Pages informatives */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Routes super admin */}
            <Route path="/super-admin/users" element={<UserManagement />} />
            
            <Route path="/contact" element={<ContactSection />} />
            
            {/* Page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        
        <Footer />
      </div>
      <AIChatBubble />
      <WebPushNotification />
      <NetworkStatus />
      <ScrollToTop />
    </QueryClientProvider>
  );
}

export default App;
