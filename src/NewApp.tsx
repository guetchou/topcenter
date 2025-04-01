
import React, { Suspense, ComponentType } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageLoader from "@/components/PageLoader";
import { ScrollToTop } from './components/ScrollToTop';
import { Footer } from './components/Footer';
import ResponsiveNavigation from './components/ResponsiveNavigation';
import ErrorBoundary from './components/ErrorBoundary';
import { Helmet } from 'react-helmet-async';
import { ChatPalGlobalInitializer } from './components/chat/ChatPalGlobalInitializer';

// Correctly typed lazy loading with proper handling of default exports
const DeploymentDashboard = React.lazy(() => 
  import('./pages/DeploymentDashboard').then(module => ({ 
    default: module.default as ComponentType<any> 
  }))
);

const Index = React.lazy(() => 
  import('./pages/Index').then(module => ({ 
    default: module.default as ComponentType<any> 
  }))
);

const AdminRoutes = React.lazy(() => 
  import('./components/routes/AdminRoutes').then(module => ({ 
    default: module.default as ComponentType<any> 
  }))
);

function NewApp() {
  return (
    <Router>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <ChatPalGlobalInitializer />
          <Routes>
            <Route path="/deploy" element={
              <>
                <Helmet>
                  <title>TopCenter Hub - Déploiement</title>
                  <meta name="description" content="Tableau de bord de déploiement pour la gestion des mises à jour du site web TopCenter" />
                  <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <ResponsiveNavigation />
                <DeploymentDashboard />
                <Footer />
              </>
            } />
            <Route path="/admin/*" element={
              <Suspense fallback={<PageLoader />}>
                <Helmet>
                  <title>TopCenter Hub - Administration</title>
                  <meta name="description" content="Interface d'administration du site TopCenter" />
                  <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <AdminRoutes />
              </Suspense>
            } />
            <Route path="/" element={
              <>
                <Helmet>
                  <title>TopCenter - Centre d'Appels Professionnel au Congo</title>
                  <meta name="description" content="TopCenter, votre partenaire en solutions de centre d'appels et services clients personnalisés en République du Congo et Afrique centrale." />
                  <meta name="keywords" content="centre d'appel, congo, brazzaville, pointe-noire, support client, télémarketing" />
                </Helmet>
                {/* N'affichons qu'un seul header: nous n'avons pas besoin de MainNav car il est déjà inclus dans la page Index */}
                <Index />
                {/* Pas besoin d'inclure Footer ici car il est déjà inclus dans Index */}
              </>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default NewApp;
