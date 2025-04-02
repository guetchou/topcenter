
import { DynamicNav } from "./nav/DynamicNav";
import { NewDesignNav } from "./nav/NewDesignNav";
import { shouldUseNewDesign } from "@/lib/designUtils";
import { useEffect, useState } from "react";

/**
 * MainNav est un composant wrapper autour de la navigation
 * pour permettre une intégration progressive du nouveau design
 */
export function MainNav({ useNewDesign = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Option to toggle between old and new design
  const shouldUseNewNav = useNewDesign || shouldUseNewDesign('navigation');
  
  // Effect to detect scroll position for glass morphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Return appropriate navigation component with glass effect class when scrolled
  return (
    <div className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur shadow-sm' : 'bg-background/50'
    }`}>
      {shouldUseNewNav ? <NewDesignNav /> : <DynamicNav />}
    </div>
  );
}
