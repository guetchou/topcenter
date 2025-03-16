
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { Spinner } from "@/components/ui/spinner";
import { CompanyInfoSection } from "@/components/sections/CompanyInfoSection";

// Lazy loading of sections for better performance
const HeroSection = lazy(() => import("@/components/sections/HeroSection"));
const ServicesSection = lazy(() => import("@/components/sections/ServicesSection"));
const CallToActionSection = lazy(() => import("@/components/sections/CallToActionSection"));
const TestimonialsSection = lazy(() => import("@/components/sections/TestimonialsSection"));
const BlogSection = lazy(() => import("@/components/sections/BlogSection"));
const TeamSection = lazy(() => import("@/components/sections/TeamSection"));
const PartnersSection = lazy(() => import("@/components/sections/PartnersSection"));
const SocialMediaSection = lazy(() => import("@/components/sections/SocialMediaSection"));

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TopCenter - Centre d'Appels Professionnel</title>
        <meta
          name="description"
          content="TopCenter, votre partenaire en solutions de centre d'appels et services clients personnalisés en République du Congo et Afrique centrale."
        />
      </Helmet>

      <main>
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Spinner /></div>}>
          <HeroSection />
        </Suspense>
        
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><Spinner /></div>}>
          <ServicesSection />
        </Suspense>
        
        {/* Section d'informations sur l'entreprise - intégrée directement ici au lieu des bulles flottantes */}
        <CompanyInfoSection />
        
        <Suspense fallback={<div className="min-h-[30vh] flex items-center justify-center"><Spinner /></div>}>
          <TestimonialsSection />
        </Suspense>
        
        <Suspense fallback={<div className="min-h-[30vh] flex items-center justify-center"><Spinner /></div>}>
          <CallToActionSection />
        </Suspense>
        
        <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center"><Spinner /></div>}>
          <BlogSection />
        </Suspense>
        
        <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center"><Spinner /></div>}>
          <TeamSection />
        </Suspense>
        
        <Suspense fallback={<div className="min-h-[20vh] flex items-center justify-center"><Spinner /></div>}>
          <PartnersSection />
        </Suspense>
        
        <Suspense fallback={<div className="min-h-[20vh] flex items-center justify-center"><Spinner /></div>}>
          <SocialMediaSection />
        </Suspense>
      </main>
    </>
  );
};

export default Index;
