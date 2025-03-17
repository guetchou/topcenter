
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Spinner } from "@/components/ui/spinner";
import { CompanyInfoSection } from "@/components/sections/CompanyInfoSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { RealTimeDashboard } from "@/components/RealTimeStats/RealTimeDashboard";
import { motion } from "framer-motion";

// Lazy loading des sections
const HeroSection = lazy(() => import("@/components/sections/HeroSection"));
const ServicesSection = lazy(() => import("@/components/sections/FeaturesSection"));
const CallToActionSection = lazy(() => import("@/components/sections/CallToActionSection"));
const TestimonialsSection = lazy(() => import("@/components/sections/TestimonialsSection").then(module => ({ default: module.TestimonialsSection })));
const BlogSection = lazy(() => import("@/components/sections/BlogSection").then(module => ({ default: module.BlogSection })));
const TeamSection = lazy(() => import("@/components/sections/TeamSection").then(module => ({ default: module.TeamSection })));
const PartnersSection = lazy(() => import("@/components/sections/PartnersSection").then(module => ({ default: module.PartnersSection })));
const SocialMediaSection = lazy(() => import("@/components/sections/SocialMediaSection").then(module => ({ default: module.SocialMediaSection })));

// Fallback générique
const Fallback = ({ size = "lg" }: { size?: "sm" | "lg" }) => (
  <div className={`min-h-[50vh] flex items-center justify-center`}>
    <Spinner size={size} />
  </div>
);

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TopCenter - Centre d'Appels Professionnel au Congo</title>
        <meta
          name="description"
          content="TopCenter, votre partenaire en solutions de centre d'appels et services clients personnalisés en République du Congo et Afrique centrale. Service client optimisé et technologie de pointe."
        />
        <meta name="keywords" content="centre d'appels, service client, Congo, Brazzaville, relation client, télémarketing, BPO, outsourcing" />
        <meta property="og:title" content="TopCenter - Centre d'Appels Professionnel" />
        <meta property="og:description" content="Solutions innovantes de centre d'appels et service client en République du Congo" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://topcenter.cg" />
        <meta property="og:image" content="/public/lovable-uploads/logo-topcenter.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://topcenter.cg" />
      </Helmet>

      <main>
        <ErrorBoundary>
          <Suspense fallback={<Fallback size="lg" />}>
            <HeroSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <ServicesSection />
          </Suspense>
        </ErrorBoundary>

        <CompanyInfoSection />

        {/* Section de statistiques en temps réel */}
        <motion.section
          className="py-16 bg-muted/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Tableau de bord opérationnel</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Suivez nos performances en temps réel. Nos équipes sont constamment 
                sur le terrain pour vous assurer un service de qualité.
              </p>
            </div>
            <RealTimeDashboard />
          </div>
        </motion.section>

        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <TestimonialsSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <CallToActionSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <BlogSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <TeamSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <PartnersSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <SocialMediaSection />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
};

export default Index;
