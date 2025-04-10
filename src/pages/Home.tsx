
import React from "react";
import { Helmet } from "react-helmet-async";
import NewHeroSection from "@/components/sections/NewHeroSection";
import { CallToActionSection } from "@/components/sections/CallToActionSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>TopCenter - Centre d'Appels Professionnel</title>
        <meta
          name="description"
          content="TopCenter, votre partenaire en solutions de centre d'appels et services clients personnalisés en République du Congo et Afrique centrale."
        />
      </Helmet>

      <main className="bg-background font-sans">
        {/* Hero Section avec Carousel */}
        <NewHeroSection />
        
        {/* Autres sections */}
        <ServicesSection />
        <TestimonialsSection />
        <CallToActionSection />
      </main>
    </>
  );
}
