
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Spinner } from "@/components/ui/spinner";
import { CompanyInfoSection } from "@/components/sections/CompanyInfoSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { shouldUseNewDesign } from "@/lib/designUtils";
import { DesignToggle } from "@/components/DesignToggle";

// Lazy loading des sections originales
const HeroSection = lazy(() => import("@/components/sections/HeroSection"));
const ServicesSection = lazy(() => import("@/components/sections/FeaturesSection"));
const CallToActionSection = lazy(() => import("@/components/sections/CallToActionSection"));
const TestimonialsSection = lazy(() => import("@/components/sections/TestimonialsSection").then(module => ({ default: module.TestimonialsSection })));
const BlogSection = lazy(() => import("@/components/sections/BlogSection").then(module => ({ default: module.BlogSection })));
const TeamSection = lazy(() => import("@/components/sections/TeamSection").then(module => ({ default: module.TeamSection })));
const PartnersSection = lazy(() => import("@/components/sections/PartnersSection").then(module => ({ default: module.PartnersSection })));
const SocialMediaSection = lazy(() => import("@/components/sections/SocialMediaSection").then(module => ({ default: module.SocialMediaSection })));

// Lazy loading des nouvelles sections (à implémenter progressivement)
const NewHeroSection = lazy(() => import("@/components/sections/NewHeroSection"));

// Fallback générique
const Fallback = ({ size = "lg" }: { size?: "sm" | "lg" }) => (
  <div className={`min-h-[50vh] flex items-center justify-center`}>
    <Spinner size={size} />
  </div>
);

const Index = () => {
  // Déterminer quelles sections utiliser (ancien ou nouveau design)
  const useNewHero = shouldUseNewDesign('hero');
  const useNewServices = shouldUseNewDesign('services');
  const useNewTestimonials = shouldUseNewDesign('testimonials');

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
            {useNewHero ? <NewHeroSection /> : <HeroSection />}
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <ServicesSection />
          </Suspense>
        </ErrorBoundary>

        <CompanyInfoSection />

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
        
        {/* Toggle de design pour le développement */}
        {process.env.NODE_ENV !== 'production' && <DesignToggle />}
      </main>
    </>
  );
};

export default Index;
