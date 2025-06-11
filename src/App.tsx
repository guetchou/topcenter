
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { WebPushNotification } from '@/components/notifications/WebPushNotification';

// Import lazily loaded components
const DynamicNav = lazy(() => import('@/components/nav/DynamicNav').then(module => ({ default: module.DynamicNav })));
const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));

// Import lazily loaded pages
const Index = lazy(() => import('@/pages/Index'));
const Services = lazy(() => import('@/pages/Services'));
const Contact = lazy(() => import('@/pages/Contact'));
const About = lazy(() => import('@/pages/About'));
const DeployDashboard = lazy(() => import('@/pages/DeployDashboard'));
const NewsDetail = lazy(() => import('@/pages/NewsDetail'));
const NotFound = lazy(() => import('@/pages/NotFound'));
import { useAuth } from './providers/AuthProvider';
const Profile = lazy(() => import('@/pages/Profile'));
const Appointments = lazy(() => import('@/pages/Appointments'));
const BookAppointment = lazy(() => import('@/pages/BookAppointment'));
const Login = lazy(() => import('@/pages/Login'));
const SignUp = lazy(() => import('@/pages/SignUp'));
const News = lazy(() => import('@/pages/News'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Devis = lazy(() => import('@/pages/Devis'));
const Training = lazy(() => import('@/pages/Training'));
const TrainingContent = lazy(() => import('@/pages/TrainingContent'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Support = lazy(() => import('@/pages/Support'));
const TeamPage = lazy(() => import('@/pages/TeamPage'));
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage'));

// Admin modules - fix imports with proper default exports
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard').then(module => ({ default: module.default })));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const CredentialsDocPage = lazy(() => import('@/pages/admin/CredentialsDocPage'));
const PocketBaseDashboard = lazy(() => import('@/pages/admin/PocketBaseDashboard'));
const PocketBaseTestPage = lazy(() => import('@/pages/admin/PocketBaseTest'));
const CMSLayout = lazy(() => import('@/pages/admin/CMSLayout').then(module => ({ default: module.default })));

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Suspense fallback={<div className="flex items-center justify-center h-[100vh]">Chargement...</div>}>
        <DynamicNav />
        
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/deploy" element={<DeployDashboard />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/actualites" element={<News />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/devis" element={<Devis />} />
            <Route path="/training" element={<Training />} />
            <Route path="/training/content" element={<TrainingContent />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/support" element={<Support />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login />} />
            <Route path="/appointments" element={isLoggedIn ? <Appointments /> : <Login />} />
            <Route path="/book" element={isLoggedIn ? <BookAppointment /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/credentials" element={<CredentialsDocPage />} />
            <Route path="/admin/pocketbase" element={<PocketBaseDashboard />} />
            <Route path="/admin/pocketbase-test" element={<PocketBaseTestPage />} />
            <Route path="/admin/cms" element={<CMSLayout />} />
          </Routes>
        </main>
        
        <Footer />
        <ScrollToTop />
      </Suspense>
      
      {/* PWA components */}
      <NetworkStatusIndicator />
      <PWAInstallPrompt />
      <WebPushNotification />
      
      {/* Performance monitoring in development */}
      {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}

      {/* Notification systems */}
      <SonnerToaster position="top-right" />
      <Toaster />
    </>
  );
}

export default App;
