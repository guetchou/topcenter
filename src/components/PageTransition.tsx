
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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
      }, 300); // Correspondre à la durée CSS
      
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <div
      className={cn(
        "transition-opacity duration-300 ease-in-out",
        transitionStage === "fadeIn" ? "opacity-100" : "opacity-0"
      )}
    >
      {children}
    </div>
  );
};
