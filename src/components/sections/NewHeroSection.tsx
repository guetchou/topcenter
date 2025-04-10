
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CarouselBackground } from "./hero/CarouselBackground";
import { HeroContent } from "./hero/HeroContent";

const NewHeroSection = () => {
  const navigate = useNavigate();
  
  // Images for the background carousel - added more images
  const backgroundImages = [
    "/lovable-uploads/staff-tce.jpg",
    "/lovable-uploads/equipe-topcenter.jpg",
    "/lovable-uploads/agent-topcenter1.png",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "/lovable-uploads/avatar-homme-femme.png"
  ];

  const handleCallNow = () => {
    // Simulate a call or contact request
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
      {/* Background carousel with enhanced effects */}
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
