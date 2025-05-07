
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CarouselBackground } from "./hero/CarouselBackground";
import { HeroContent } from "./hero/HeroContent";

const NewHeroSection = () => {
  const navigate = useNavigate();
  
  // Images pour le carrousel d'arrière-plan - ajout de plusieurs images
  const backgroundImages = [
    "/lovable-uploads/staff-tce.jpg",
    "/lovable-uploads/equipe-topcenter.jpg",
    "/lovable-uploads/agent-topcenter1.png",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "/lovable-uploads/avatar-homme-femme.png"
  ];

  const handleCallNow = () => {
    // Simuler une demande d'appel ou de contact
    toast.success("Demande de contact", {
      description: "Un membre de notre équipe vous contactera bientôt."
    });
    navigate("/contact");
  };

  const handleQuoteRequest = () => {
    navigate("/devis");
    toast.success("Demande de devis", {
      description: "Remplissez le formulaire pour obtenir un devis personnalisé."
    });
  };

  return (
    <section className="relative bg-gradient-to-r from-primary/90 to-primary py-20 text-white overflow-hidden min-h-[80vh] flex items-center">
      {/* Carrousel d'arrière-plan avec effets améliorés */}
      <CarouselBackground 
        images={backgroundImages} 
        interval={5000}
        overlayOpacity={0.4}
        animationDuration={1500}
        blur={2}
        effect="kenBurns"
        overlayGradient={true}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-1 gap-8 items-center mx-auto max-w-3xl text-center">
          <HeroContent 
            onCallNow={handleCallNow} 
            onQuoteRequest={handleQuoteRequest}
          />
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;
