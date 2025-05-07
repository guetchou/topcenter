
import { lazy, Suspense, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Spinner } from "@/components/ui/spinner";
import { CompanyInfoSection } from "@/components/sections/CompanyInfoSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { shouldUseNewDesign } from "@/lib/designUtils";
import { DesignToggle } from "@/components/DesignToggle";
import { useInView } from "react-intersection-observer";
import { NewsHighlightSection } from "@/components/sections/NewsHighlightSection";
import { MapLocation } from "@/components/sections/about/MapLocation";

// Lazy loading original sections
const HeroSection = lazy(() => import("@/components/sections/HeroSection"));
const ServicesSection = lazy(() => import("@/components/sections/FeaturesSection"));
const CallToActionSection = lazy(() => import("@/components/sections/CallToActionSection"));
const TestimonialsSection = lazy(() => import("@/components/sections/TestimonialsSection").then(module => ({ default: module.TestimonialsSection })));
const BlogSection = lazy(() => import("@/components/sections/BlogSection").then(module => ({ default: module.BlogSection })));
const TeamSection = lazy(() => import("@/components/sections/TeamSection").then(module => ({ default: module.TeamSection })));
const PartnersSection = lazy(() => import("@/components/sections/PartnersSection").then(module => ({ default: module.PartnersSection })));
const SocialMediaSection = lazy(() => import("@/components/sections/SocialMediaSection").then(module => ({ default: module.SocialMediaSection })));

// Lazy loading new sections
const NewHeroSection = lazy(() => import("@/components/sections/NewHeroSection"));

// Enhanced fallback with more contextual information
const Fallback = ({ size = "lg", label = "Chargement" }: { size?: "sm" | "lg", label?: string }) => (
  <div className="min-h-[50vh] flex items-center justify-center" aria-live="polite">
    <div className="flex flex-col items-center gap-3">
      <Spinner size={size} aria-hidden="true" />
      <p className="text-sm text-muted-foreground animate-pulse">
        {label}...
      </p>
    </div>
  </div>
);

// Intersection Observer component to lazy load when in viewport
const LazySection = ({ 
  children, 
  fallbackHeight = "50vh",
  id,
  threshold = 0.1
}: { 
  children: React.ReactNode,
  fallbackHeight?: string,
  id: string,
  threshold?: number
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (inView && !isLoaded) {
      setIsLoaded(true);
    }
  }, [inView, isLoaded]);

  return (
    <div 
      ref={ref} 
      id={id} 
      style={{ minHeight: isLoaded ? 'auto' : fallbackHeight }}
      className="relative"
    >
      {(inView || isLoaded) ? (
        <ErrorBoundary>
          <Suspense fallback={<Fallback label={`Chargement de la section ${id}`} />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      ) : (
        <div 
          className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-background to-background/50"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

const Index = () => {
  // Toujours utiliser le nouveau design du héros avec le carrousel
  const useNewHero = true;
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
          <Suspense fallback={<Fallback size="lg" label="Chargement de la page d'accueil" />}>
            {useNewHero ? <NewHeroSection /> : <HeroSection />}
          </Suspense>
        </ErrorBoundary>

        <LazySection id="services" fallbackHeight="60vh">
          <ServicesSection />
        </LazySection>

        <LazySection id="news" fallbackHeight="50vh">
          <NewsHighlightSection />
        </LazySection>

        <LazySection id="company-info" fallbackHeight="40vh">
          <CompanyInfoSection />
        </LazySection>

        <LazySection id="testimonials" fallbackHeight="50vh">
          <TestimonialsSection />
        </LazySection>

        <LazySection id="call-to-action" fallbackHeight="30vh">
          <CallToActionSection />
        </LazySection>

        <LazySection id="blog" fallbackHeight="60vh">
          <BlogSection />
        </LazySection>

        <LazySection id="team" fallbackHeight="60vh">
          <TeamSection />
        </LazySection>

        <LazySection id="location" fallbackHeight="50vh">
          <div className="container mx-auto px-4 py-12">
            <MapLocation />
          </div>
        </LazySection>

        <LazySection id="partners" fallbackHeight="40vh">
          <PartnersSection />
        </LazySection>

        <LazySection id="social-media" fallbackHeight="30vh">
          <SocialMediaSection />
        </LazySection>
        
        {/* Design toggle for development */}
        {import.meta.env.DEV && <DesignToggle />}
      </main>
    </>
  );
};

export default Index;
