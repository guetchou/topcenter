
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CarouselBackground } from "./hero/CarouselBackground";
import { HeroContent } from "./hero/HeroContent";

const NewHeroSection = () => {
  const navigate = useNavigate();
  
  // Images pour le carrousel en arrière-plan
  const backgroundImages = [
    "/lovable-uploads/staff-tce.jpg",
    "/lovable-uploads/agent-topcenter1.png",
    "/lovable-uploads/equipe-topcenter.jpg"
  ];

  const handleCallNow = () => {
    // Simuler un appel ou demande de contact
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
  
  const handleConnect = () => {
    navigate("/login");
    toast.success("Connexion", {
      description: "Connectez-vous à votre compte TopCenter."
    });
  };

  return (
    <section className="relative bg-gradient-to-r from-primary/90 to-primary py-20 text-white overflow-hidden min-h-[80vh] flex items-center">
      {/* Carrousel en arrière-plan avec effet de transition */}
      <CarouselBackground 
        images={backgroundImages} 
        interval={7000}
        overlayOpacity={0.2}
        animationDuration={2000}
        blur={2}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-1 gap-8 items-center mx-auto max-w-3xl text-center">
          <HeroContent 
            onCallNow={handleCallNow} 
            onQuoteRequest={handleQuoteRequest}
            onConnect={handleConnect}
          />
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;
