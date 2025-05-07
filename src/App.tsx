
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { WebPushNotification } from '@/components/notifications/WebPushNotification';

// Import lazily loaded components
const DynamicNav = lazy(() => import('@/components/nav/DynamicNav'));
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
            <Route path="*" element={<NotFound />} />
            <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login />} />
            <Route path="/appointments" element={isLoggedIn ? <Appointments /> : <Login />} />
            <Route path="/book" element={isLoggedIn ? <BookAppointment /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
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
