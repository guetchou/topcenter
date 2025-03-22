
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AnimationWrapper } from "./AnimationWrapper";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
      
      // Attendre que l'animation de sortie se termine
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
        // Faire défiler vers le haut de la page lors de la navigation
        window.scrollTo(0, 0);
      }, 300); // Correspondre à la durée CSS
      
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <AnimationWrapper
      type={transitionStage === "fadeIn" ? "fade-in" : "none"}
      duration={300}
      className={cn(
        "transition-all duration-300 ease-in-out min-h-screen",
        transitionStage === "fadeOut" && "opacity-0 transform translate-y-4"
      )}
    >
      {children}
    </AnimationWrapper>
  );
};
